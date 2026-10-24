package com.sdl.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wellness_services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WellnessService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long serviceId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    private String mode = "Both";

    private String venue;

    @Builder.Default
    private Integer dailyCapacity = 10;

    @Builder.Default
    private String status = "Active";

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_counselor_id")
    private User assignedCounselor;
}
