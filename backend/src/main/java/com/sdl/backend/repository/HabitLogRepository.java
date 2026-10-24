package com.sdl.backend.repository;

import com.sdl.backend.model.HabitLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HabitLogRepository extends JpaRepository<HabitLog, Long> {
    Optional<HabitLog> findByStudentUserIdAndLogDate(Long studentId, LocalDate logDate);
    List<HabitLog> findByStudentUserIdAndLogDateBetweenOrderByLogDateAsc(Long studentId, LocalDate startDate, LocalDate endDate);
    List<HabitLog> findTop7ByStudentUserIdOrderByLogDateDesc(Long studentId);
    Optional<HabitLog> findTopByStudentUserIdOrderByLogDateDesc(Long studentId);
}
