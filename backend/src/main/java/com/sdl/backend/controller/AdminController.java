package com.sdl.backend.controller;

import com.sdl.backend.model.AdminAuditLog;
import com.sdl.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminAuditLogRepository auditLogRepository;
    private final ServiceRequestRepository requestRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final WellnessServiceRepository serviceRepository;

    // FR-069 & NFR-007: Immutable audit log tracking
    @GetMapping("/audit-logs")
    public ResponseEntity<List<AdminAuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditLogRepository.findAllByOrderByTimestampDesc());
    }

    // FR-067: Anonymized institutional metrics dashboard
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getInstitutionalMetrics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalRequests", requestRepository.count());
        stats.put("totalAppointments", appointmentRepository.count());
        stats.put("activeServices", serviceRepository.findByStatus("Active").size());
        stats.put("totalAuditLogs", auditLogRepository.count());
        return ResponseEntity.ok(stats);
    }
}
