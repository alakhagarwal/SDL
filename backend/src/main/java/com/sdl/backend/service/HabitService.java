package com.sdl.backend.service;

import com.sdl.backend.dto.HabitTrendResponse;
import com.sdl.backend.dto.LogHabitDto;
import com.sdl.backend.exception.BusinessRuleException;
import com.sdl.backend.exception.ResourceNotFoundException;
import com.sdl.backend.model.HabitLog;
import com.sdl.backend.model.User;
import com.sdl.backend.repository.HabitLogRepository;
import com.sdl.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HabitService {

    private final HabitLogRepository habitLogRepository;
    private final UserRepository userRepository;

    // FR-049, FR-050, FR-051, FR-054, BR-012: Daily Activity Logging
    @Transactional
    public HabitLog logDailyHabit(Long studentId, LogHabitDto dto) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));

        LocalDate targetDate = dto.getLogDate() != null ? dto.getLogDate() : LocalDate.now();

        // BR-012 & FR-054: Habit backlog constraint: maximum 48 hours in the past
        LocalDate earliestPermittedDate = LocalDate.now().minusDays(2);
        if (targetDate.isBefore(earliestPermittedDate)) {
            throw new BusinessRuleException(
                    "Backlog limit exceeded: Daily habit entries can only be logged or edited within a 48-hour historical window (BR-012)."
            );
        }
        if (targetDate.isAfter(LocalDate.now())) {
            throw new BusinessRuleException("Cannot log self-care habits for future dates.");
        }

        // AC-18: Validate physiological input limits
        if (dto.getSleepHours() != null && (dto.getSleepHours() < 0 || dto.getSleepHours() > 24)) {
            throw new BusinessRuleException("Sleep duration must be between 0 and 24 hours.");
        }
        if (dto.getMoodScore() != null && (dto.getMoodScore() < 1 || dto.getMoodScore() > 5)) {
            throw new BusinessRuleException("Mood score must be on a 1-5 scale.");
        }

        // AC-19: Calculate consecutive daily streak
        int streak = calculateStreak(studentId, targetDate);

        Optional<HabitLog> existing = habitLogRepository.findByStudentUserIdAndLogDate(studentId, targetDate);
        HabitLog log = existing.orElseGet(() -> HabitLog.builder()
                .student(student)
                .logDate(targetDate)
                .createdAt(LocalDateTime.now())
                .build());

        if (dto.getSleepHours() != null) log.setSleepHours(dto.getSleepHours());
        if (dto.getWaterIntakeLiters() != null) log.setWaterIntakeLiters(dto.getWaterIntakeLiters());
        if (dto.getMeditationMinutes() != null) log.setMeditationMinutes(dto.getMeditationMinutes());
        if (dto.getWorkoutMinutes() != null) log.setWorkoutMinutes(dto.getWorkoutMinutes());
        if (dto.getMoodScore() != null) log.setMoodScore(dto.getMoodScore());
        if (dto.getJournalTag() != null) log.setJournalTag(dto.getJournalTag());
        log.setStreakCount(streak);

        return habitLogRepository.save(log);
    }

    private int calculateStreak(Long studentId, LocalDate logDate) {
        // Check if previous consecutive day was logged
        LocalDate yesterday = logDate.minusDays(1);
        Optional<HabitLog> yesterdayLog = habitLogRepository.findByStudentUserIdAndLogDate(studentId, yesterday);
        if (yesterdayLog.isPresent()) {
            return yesterdayLog.get().getStreakCount() + 1;
        }
        return 1;
    }

    // FR-052 & AC-20: 7-day trend metrics and streak calculation
    public HabitTrendResponse getHabitTrends(Long studentId) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(6);

        List<HabitLog> logs = habitLogRepository.findByStudentUserIdAndLogDateBetweenOrderByLogDateAsc(studentId, startDate, endDate);

        Optional<HabitLog> latestLog = habitLogRepository.findTopByStudentUserIdOrderByLogDateDesc(studentId);
        int currentStreak = 0;
        if (latestLog.isPresent()) {
            LocalDate lastDate = latestLog.get().getLogDate();
            if (lastDate.equals(LocalDate.now()) || lastDate.equals(LocalDate.now().minusDays(1))) {
                currentStreak = latestLog.get().getStreakCount();
            }
        }

        double avgSleep = logs.stream()
                .filter(l -> l.getSleepHours() != null)
                .mapToDouble(HabitLog::getSleepHours)
                .average()
                .orElse(7.0);

        double avgWater = logs.stream()
                .filter(l -> l.getWaterIntakeLiters() != null)
                .mapToDouble(HabitLog::getWaterIntakeLiters)
                .average()
                .orElse(2.5);

        double avgMood = logs.stream()
                .filter(l -> l.getMoodScore() != null)
                .mapToInt(HabitLog::getMoodScore)
                .average()
                .orElse(4.0);

        return HabitTrendResponse.builder()
                .currentStreak(currentStreak)
                .averageSleepHours(Math.round(avgSleep * 10.0) / 10.0)
                .averageWaterIntake(Math.round(avgWater * 10.0) / 10.0)
                .averageMoodScore(Math.round(avgMood * 10.0) / 10.0)
                .recentLogs(logs)
                .build();
    }
}
