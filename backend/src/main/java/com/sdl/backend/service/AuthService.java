package com.sdl.backend.service;

import com.sdl.backend.dto.AuthResponse;
import com.sdl.backend.dto.LoginRequest;
import com.sdl.backend.dto.RegisterRequest;
import com.sdl.backend.exception.BusinessRuleException;
import com.sdl.backend.exception.ResourceNotFoundException;
import com.sdl.backend.model.Role;
import com.sdl.backend.model.User;
import com.sdl.backend.model.WellnessProfile;
import com.sdl.backend.repository.UserRepository;
import com.sdl.backend.repository.WellnessProfileRepository;
import com.sdl.backend.security.JwtService;
import com.sdl.backend.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final WellnessProfileRepository wellnessProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuditLogService auditLogService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        // FR-001 & BR-001: Enforce verified institutional email domain (@lnmiit.ac.in)
        if (!email.endsWith("@lnmiit.ac.in")) {
            throw new BusinessRuleException("Only institutional email addresses ending with @lnmiit.ac.in are permitted (BR-001).");
        }

        if (userRepository.existsByEmail(email)) {
            throw new BusinessRuleException("An account with this institutional email already exists.");
        }

        User user = User.builder()
                .fullName(request.getFullName().trim())
                .email(email)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.STUDENT)
                .rollNumber(request.getRollNumber())
                .department(request.getDepartment())
                .contactNumber(request.getContactNumber())
                .accountStatus("Active")
                .build();

        User savedUser = userRepository.save(user);

        // FR-009: Initialize default wellness profile for students
        if (savedUser.getRole() == Role.STUDENT) {
            WellnessProfile profile = WellnessProfile.builder()
                    .user(savedUser)
                    .anonymityAlias("Student_" + savedUser.getUserId())
                    .preferredCounselingMode("In-person")
                    .onboardingCompleted(false)
                    .build();
            wellnessProfileRepository.save(profile);
        }

        auditLogService.recordAction(savedUser, "USER_REGISTER", "User", savedUser.getUserId(),
                "Registered new user with role " + savedUser.getRole());

        UserPrincipal principal = new UserPrincipal(savedUser);
        String token = jwtService.generateToken(principal, savedUser.getUserId(), savedUser.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .userId(savedUser.getUserId())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .rollNumber(savedUser.getRollNumber())
                .department(savedUser.getDepartment())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        // Performs authentication check; BadCredentialsException handled centrally by GlobalExceptionHandler (FR-003)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if ("Suspended".equalsIgnoreCase(user.getAccountStatus())) {
            throw new BusinessRuleException("Your account has been deactivated. Please contact administrator (FR-008).");
        }

        UserPrincipal principal = new UserPrincipal(user);
        String token = jwtService.generateToken(principal, user.getUserId(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .rollNumber(user.getRollNumber())
                .department(user.getDepartment())
                .build();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }
}
