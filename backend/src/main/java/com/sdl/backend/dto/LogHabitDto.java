package com.sdl.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LogHabitDto {
    private LocalDate logDate;

    @Min(value = 0, message = "Sleep hours cannot be negative")
    @Max(value = 24, message = "Sleep hours cannot exceed 24")
    private Double sleepHours;

    @Min(value = 0, message = "Water intake cannot be negative")
    @Max(value = 20, message = "Water intake exceeds physiological limit")
    private Double waterIntakeLiters;

    @Min(value = 0, message = "Meditation minutes cannot be negative")
    private Integer meditationMinutes;

    @Min(value = 0, message = "Workout minutes cannot be negative")
    private Integer workoutMinutes;

    @Min(value = 1, message = "Mood score must be between 1 and 5")
    @Max(value = 5, message = "Mood score must be between 1 and 5")
    private Integer moodScore;

    private String journalTag;
}
