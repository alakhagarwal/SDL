package com.sdl.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wellness_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WellnessProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long profileId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String emergencyContactName;

    private String emergencyContactPhone;

    private String emergencyContactRelation;

    private String primaryConcerns;

    @Builder.Default
    private String preferredCounselingMode = "In-person";

    private String anonymityAlias;

    @Builder.Default
    private Boolean onboardingCompleted = false;
}
