package com.sdl.backend.controller;

import com.sdl.backend.dto.EmergencyEscalationDto;
import com.sdl.backend.dto.TriageEvaluationDto;
import com.sdl.backend.model.HealthCenterReferral;
import com.sdl.backend.model.ServiceRequest;
import com.sdl.backend.security.UserPrincipal;
import com.sdl.backend.service.TriageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/triage")
@RequiredArgsConstructor
public class TriageController {

    private final TriageService triageService;

    // FR-042: Counselor Triage Queue sorted by urgency badges and submission timestamp
    @GetMapping("/queue")
    public ResponseEntity<List<ServiceRequest>> getPendingQueue() {
        return ResponseEntity.ok(triageService.getPendingTriageQueue());
    }

    // View all requests across all lifecycle states
    @GetMapping("/all")
    public ResponseEntity<List<ServiceRequest>> getAllRequests() {
        return ResponseEntity.ok(triageService.getAllRequests());
    }

    // UC-010: Conduct Clinical Triage & Case Assignment (Routine/Priority path)
    @PostMapping("/{id}/evaluate")
    public ResponseEntity<ServiceRequest> evaluateAndAssign(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody TriageEvaluationDto dto
    ) {
        ServiceRequest evaluated = triageService.evaluateAndAssign(id, principal.getUser(), dto);
        return ResponseEntity.ok(evaluated);
    }

    // UC-010 Emergency Alternative Flow (BR-007 / FR-046): Immediate Campus Health Center Referral
    @PostMapping("/{id}/escalate")
    public ResponseEntity<HealthCenterReferral> escalateCase(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody EmergencyEscalationDto dto
    ) {
        HealthCenterReferral referral = triageService.escalateToHealthCenter(id, principal.getUser(), dto);
        return ResponseEntity.ok(referral);
    }
}
