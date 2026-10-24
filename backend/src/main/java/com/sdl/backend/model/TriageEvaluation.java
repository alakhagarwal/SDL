package com.sdl.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "triage_evaluations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TriageEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long evaluationId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "request_id", nullable = false, unique = true)
    private ServiceRequest request;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "counselor_id", nullable = false)
    private User counselor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UrgencyLevel priorityLevel;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Builder.Default
    private LocalDateTime evaluatedAt = LocalDateTime.now();
}
