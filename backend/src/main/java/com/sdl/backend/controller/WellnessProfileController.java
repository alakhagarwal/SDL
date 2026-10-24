package com.sdl.backend.controller;

import com.sdl.backend.dto.WellnessProfileDto;
import com.sdl.backend.model.WellnessProfile;
import com.sdl.backend.security.UserPrincipal;
import com.sdl.backend.service.WellnessProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class WellnessProfileController {

    private final WellnessProfileService profileService;

    // FR-009 & FR-010: Student wellness profile setup & retrieval
    @GetMapping
    public ResponseEntity<WellnessProfile> getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(profileService.getProfileByUserId(principal.getId()));
    }

    // FR-010 & FR-011: Profile updates, emergency contacts, and anonymity preferences
    @PutMapping
    public ResponseEntity<WellnessProfile> updateMyProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody WellnessProfileDto dto
    ) {
        return ResponseEntity.ok(profileService.updateProfile(principal.getId(), dto));
    }
}
