package com.sdl.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "health_center_referrals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthCenterReferral {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long referralId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "request_id", nullable = false, unique = true)
    private ServiceRequest request;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "counselor_id")
    private User counselor;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String reason;

    @Builder.Default
    private String priority = "URGENT_EMERGENCY";

    @Builder.Default
    private String referralStatus = "PENDING_INTAKE";

    @Builder.Default
    private LocalDateTime referredAt = LocalDateTime.now();

    @Column(columnDefinition = "TEXT")
    private String intakeNotes;
}
