package com.sdl.backend.controller;

import com.sdl.backend.dto.HabitTrendResponse;
import com.sdl.backend.dto.LogHabitDto;
import com.sdl.backend.model.HabitLog;
import com.sdl.backend.security.UserPrincipal;
import com.sdl.backend.service.HabitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/habits")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService habitService;

    // FR-049 & FR-050: Daily activity & mood check-in (with BR-012 48-hr window constraint)
    @PostMapping("/log")
    public ResponseEntity<HabitLog> logDailyHabit(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody LogHabitDto dto
    ) {
        HabitLog log = habitService.logDailyHabit(principal.getId(), dto);
        return ResponseEntity.ok(log);
    }

    // FR-051 & FR-052: Daily habit streaks and 7-day visual trend analytics
    @GetMapping("/trends")
    public ResponseEntity<HabitTrendResponse> getHabitTrends(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(habitService.getHabitTrends(principal.getId()));
    }
}
