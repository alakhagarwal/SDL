package com.sdl.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "clinical_notes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClinicalNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long noteId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    private Appointment appointment;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "request_id", nullable = false)
    private ServiceRequest request;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "counselor_id", nullable = false)
    private User counselor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String sessionSummary;

    @Column(columnDefinition = "TEXT")
    private String clinicalObservations;

    @Column(columnDefinition = "TEXT")
    private String actionPlan;

    private String outcomeCategory;

    @Builder.Default
    private String confidentialityLevel = "RESTRICTED_CLINICAL";

    @Builder.Default
    private LocalDateTime recordedAt = LocalDateTime.now();
}
