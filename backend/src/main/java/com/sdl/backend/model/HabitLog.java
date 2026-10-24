package com.sdl.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "habit_logs", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "log_date"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HabitLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    private Double sleepHours;

    private Double waterIntakeLiters;

    private Integer meditationMinutes;

    private Integer workoutMinutes;

    private Integer moodScore; // 1 to 5

    private String journalTag;

    @Builder.Default
    private Integer streakCount = 1;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
