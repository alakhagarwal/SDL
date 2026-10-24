package com.sdl.backend.controller;

import com.sdl.backend.dto.BookAppointmentDto;
import com.sdl.backend.dto.CancelRequestDto;
import com.sdl.backend.dto.CompleteAppointmentDto;
import com.sdl.backend.dto.CreateSlotDto;
import com.sdl.backend.model.Appointment;
import com.sdl.backend.model.AvailabilitySlot;
import com.sdl.backend.model.ClinicalNote;
import com.sdl.backend.security.UserPrincipal;
import com.sdl.backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AppointmentController {

    private final BookingService bookingService;

    // UC-007: Book Counseling Consultation Appointment (FR-033 to FR-037, BR-003, BR-004, BR-011)
    @PostMapping("/api/appointments/book")
    public ResponseEntity<Appointment> bookAppointment(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody BookAppointmentDto dto
    ) {
        Appointment appointment = bookingService.bookAppointment(principal.getId(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(appointment);
    }

    // Student view of their scheduled appointments
    @GetMapping("/api/appointments/my")
    public ResponseEntity<List<Appointment>> getMyAppointments(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(bookingService.getStudentAppointments(principal.getId()));
    }

    // Counselor view of their consultation agenda
    @GetMapping("/api/counselor/appointments")
    @PreAuthorize("hasAnyRole('COUNSELOR', 'ADMIN')")
    public ResponseEntity<List<Appointment>> getCounselorAppointments(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(bookingService.getCounselorAppointments(principal.getId()));
    }

    // FR-033: Available slots published by a specific counselor
    @GetMapping("/api/counselors/{counselorId}/slots")
    public ResponseEntity<List<AvailabilitySlot>> getAvailableSlotsForCounselor(@PathVariable Long counselorId) {
        return ResponseEntity.ok(bookingService.getAvailableSlotsForCounselor(counselorId));
    }

    // Available upcoming slots across counselors for fast booking
    @GetMapping("/api/counselors/slots/all")
    public ResponseEntity<List<AvailabilitySlot>> getAllAvailableSlots() {
        return ResponseEntity.ok(bookingService.getAllAvailableUpcomingSlots());
    }

    // FR-045: Counselor slot management: publish availability slots
    @PostMapping("/api/counselor/slots")
    @PreAuthorize("hasAnyRole('COUNSELOR', 'ADMIN')")
    public ResponseEntity<AvailabilitySlot> createSlot(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateSlotDto dto
    ) {
        AvailabilitySlot slot = bookingService.createSlot(principal.getUser(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(slot);
    }

    // FR-039 & BR-009: Appointment Cancellation with at least 4 hours notice
    @PostMapping("/api/appointments/{id}/cancel")
    public ResponseEntity<Appointment> cancelAppointment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody(required = false) CancelRequestDto dto
    ) {
        String reason = (dto != null && dto.getReason() != null) ? dto.getReason() : "Cancelled by participant";
        return ResponseEntity.ok(bookingService.cancelAppointment(id, principal.getUser(), reason));
    }

    // FR-041, FR-043, FR-047 & BR-015: Conclude session, record clinical notes, archive case
    @PostMapping("/api/appointments/{id}/complete")
    @PreAuthorize("hasAnyRole('COUNSELOR', 'ADMIN')")
    public ResponseEntity<ClinicalNote> completeAppointment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CompleteAppointmentDto dto
    ) {
        return ResponseEntity.ok(bookingService.completeAppointmentWithNotes(id, principal.getUser(), dto));
    }

    // BR-005: View confidential clinical notes (restricted access)
    @GetMapping("/api/appointments/{id}/notes")
    public ResponseEntity<ClinicalNote> getClinicalNotes(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(bookingService.getClinicalNoteForAppointment(id, principal.getUser()));
    }
}
