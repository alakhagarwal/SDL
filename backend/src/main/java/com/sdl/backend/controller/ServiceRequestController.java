package com.sdl.backend.controller;

import com.sdl.backend.dto.CancelRequestDto;
import com.sdl.backend.dto.CreateSupportRequestDto;
import com.sdl.backend.model.ServiceRequest;
import com.sdl.backend.security.UserPrincipal;
import com.sdl.backend.service.RequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class ServiceRequestController {

    private final RequestService requestService;

    // UC-005: Submit Confidential Wellness Support Request (FR-024 to FR-028, BR-002)
    @PostMapping
    public ResponseEntity<ServiceRequest> submitSupportRequest(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateSupportRequestDto dto
    ) {
        ServiceRequest request = requestService.submitSupportRequest(principal.getId(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(request);
    }

    // FR-028: Real-time request status tracker for students
    @GetMapping("/my")
    public ResponseEntity<List<ServiceRequest>> getMyRequests(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(requestService.getStudentRequests(principal.getId()));
    }

    // Detailed request view
    @GetMapping("/{id}")
    public ResponseEntity<ServiceRequest> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRequestById(id));
    }

    // FR-030: Student Support Request Cancellation with mandatory reason
    @PostMapping("/{id}/cancel")
    public ResponseEntity<ServiceRequest> cancelRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CancelRequestDto dto
    ) {
        return ResponseEntity.ok(requestService.cancelRequest(id, principal.getId(), dto));
    }
}
