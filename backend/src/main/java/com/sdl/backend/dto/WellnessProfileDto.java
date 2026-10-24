package com.sdl.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WellnessProfileDto {
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String emergencyContactRelation;
    private String primaryConcerns;
    private String preferredCounselingMode;
    private String anonymityAlias;
    private Boolean onboardingCompleted;
}
