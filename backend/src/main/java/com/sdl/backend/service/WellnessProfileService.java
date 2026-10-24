package com.sdl.backend.service;

import com.sdl.backend.dto.WellnessProfileDto;
import com.sdl.backend.exception.ResourceNotFoundException;
import com.sdl.backend.model.User;
import com.sdl.backend.model.WellnessProfile;
import com.sdl.backend.repository.UserRepository;
import com.sdl.backend.repository.WellnessProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WellnessProfileService {

    private final WellnessProfileRepository profileRepository;
    private final UserRepository userRepository;

    public WellnessProfile getProfileByUserId(Long userId) {
        return profileRepository.findByUserUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
                    WellnessProfile newProfile = WellnessProfile.builder()
                            .user(user)
                            .anonymityAlias("Student_" + user.getUserId())
                            .preferredCounselingMode("In-person")
                            .onboardingCompleted(false)
                            .build();
                    return profileRepository.save(newProfile);
                });
    }

    @Transactional
    public WellnessProfile updateProfile(Long userId, WellnessProfileDto dto) {
        WellnessProfile profile = getProfileByUserId(userId);
        if (dto.getEmergencyContactName() != null) profile.setEmergencyContactName(dto.getEmergencyContactName());
        if (dto.getEmergencyContactPhone() != null) profile.setEmergencyContactPhone(dto.getEmergencyContactPhone());
        if (dto.getEmergencyContactRelation() != null) profile.setEmergencyContactRelation(dto.getEmergencyContactRelation());
        if (dto.getPrimaryConcerns() != null) profile.setPrimaryConcerns(dto.getPrimaryConcerns());
        if (dto.getPreferredCounselingMode() != null) profile.setPreferredCounselingMode(dto.getPreferredCounselingMode());
        if (dto.getAnonymityAlias() != null) profile.setAnonymityAlias(dto.getAnonymityAlias());
        if (dto.getOnboardingCompleted() != null) profile.setOnboardingCompleted(dto.getOnboardingCompleted());
        return profileRepository.save(profile);
    }
}
