package com.sdl.backend.dto;

import com.sdl.backend.model.HabitLog;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HabitTrendResponse {
    private Integer currentStreak;
    private Double averageSleepHours;
    private Double averageWaterIntake;
    private Double averageMoodScore;
    private List<HabitLog> recentLogs;
}
