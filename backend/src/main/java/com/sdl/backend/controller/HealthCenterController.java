package com.sdl.backend.controller;

import com.sdl.backend.model.HealthCenterReferral;
import com.sdl.backend.security.UserPrincipal;
import com.sdl.backend.service.TriageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/health-center")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('HEALTH_CENTER', 'ADMIN', 'COUNSELOR')")
public class HealthCenterController {

    private final TriageService triageService;

    // View all escalated emergency referrals from counselors
    @GetMapping("/referrals")
    public ResponseEntity<List<HealthCenterReferral>> getAllReferrals() {
        return ResponseEntity.ok(triageService.getAllReferrals());
    }

    // Acknowledge intake of an escalated student case
    @PostMapping("/referrals/{id}/acknowledge")
    public ResponseEntity<HealthCenterReferral> acknowledgeReferral(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody(required = false) Map<String, String> body
    ) {
        String notes = (body != null && body.containsKey("notes")) ? body.get("notes") : "Intake acknowledged by Campus Health Center staff.";
        return ResponseEntity.ok(triageService.acknowledgeReferral(id, principal.getUser(), notes));
    }
}
