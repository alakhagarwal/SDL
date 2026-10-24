package com.sdl.backend.service;

import com.sdl.backend.dto.BookAppointmentDto;
import com.sdl.backend.dto.CompleteAppointmentDto;
import com.sdl.backend.dto.CreateSlotDto;
import com.sdl.backend.exception.BusinessRuleException;
import com.sdl.backend.exception.ResourceNotFoundException;
import com.sdl.backend.model.*;
import com.sdl.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final AvailabilitySlotRepository slotRepository;
    private final AppointmentRepository appointmentRepository;
    private final ServiceRequestRepository requestRepository;
    private final ClinicalNoteRepository clinicalNoteRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    // FR-045: Counselor manages availability slots
    @Transactional
    public AvailabilitySlot createSlot(User counselor, CreateSlotDto dto) {
        if (dto.getSlotDate().isBefore(LocalDate.now())) {
            throw new BusinessRuleException("Cannot create availability slots in the past.");
        }
        if (dto.getStartTime().isAfter(dto.getEndTime())) {
            throw new BusinessRuleException("Slot start time must precede end time.");
        }

        AvailabilitySlot slot = AvailabilitySlot.builder()
                .counselor(counselor)
                .slotDate(dto.getSlotDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .status(SlotStatus.AVAILABLE)
                .build();

        return slotRepository.save(slot);
    }

    public List<AvailabilitySlot> getAvailableSlotsForCounselor(Long counselorId) {
        return slotRepository.findByCounselorUserIdAndStatusOrderBySlotDateAscStartTimeAsc(
                counselorId,
                SlotStatus.AVAILABLE
        );
    }

    public List<AvailabilitySlot> getAllAvailableUpcomingSlots() {
        return slotRepository.findByStatusAndSlotDateGreaterThanEqualOrderBySlotDateAscStartTimeAsc(
                SlotStatus.AVAILABLE,
                LocalDate.now()
        );
    }

    public List<AvailabilitySlot> getSlotsByCounselor(Long counselorId) {
        return slotRepository.findByCounselorUserIdOrderBySlotDateAscStartTimeAsc(counselorId);
    }

    // UC-007: Book Counseling Consultation Appointment
    @Transactional
    public Appointment bookAppointment(Long studentId, BookAppointmentDto dto) {
        ServiceRequest request = requestRepository.findById(dto.getRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + dto.getRequestId()));

        // Validation: Verify student owns request
        if (!request.getStudent().getUserId().equals(studentId)) {
            throw new BusinessRuleException("You can only book appointments for your own support requests.");
        }

        // AC-09: Student must possess an approved or triaged support request
        if (request.getStatus() != RequestStatus.TRIAGED) {
            throw new BusinessRuleException(
                    "Appointment cannot be booked. Support request #REQ-" + request.getRequestId() +
                    " must be in TRIAGED status (Current status: " + request.getStatus() + ")."
            );
        }

        // BR-004 & AC-12: Slot must be locked atomically to prevent double-booking race conditions
        AvailabilitySlot slot = slotRepository.findWithLockBySlotId(dto.getSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Availability slot not found: " + dto.getSlotId()));

        if (slot.getStatus() != SlotStatus.AVAILABLE) {
            throw new BusinessRuleException(
                    "Concurrency Conflict: Selected slot is already booked or locked by another student (BR-004). " +
                    "Please choose a different time slot."
            );
        }

        // BR-003 & AC-11: Routine appointments must enforce minimum 24-hour advance booking rule
        LocalDateTime slotDateTime = LocalDateTime.of(slot.getSlotDate(), slot.getStartTime());
        if (request.getUrgencyLevel() == UrgencyLevel.ROUTINE) {
            if (slotDateTime.isBefore(LocalDateTime.now().plusHours(24))) {
                throw new BusinessRuleException(
                        "Advance notice restriction: Routine non-emergency counseling appointments must be booked " +
                        "at least 24 hours in advance (BR-003). For immediate urgent concerns, please consult emergency services."
                );
            }
        }

        // Lock slot atomically (BR-004)
        slot.setStatus(SlotStatus.BOOKED);
        slotRepository.save(slot);

        // BR-011 & AC-13: Virtual appointments dynamically generate secure Telehealth meeting URL
        String mode = dto.getMode() != null ? dto.getMode() : request.getPreferredMode();
        String meetingLink = null;
        String venue = "Counseling Room 204, Student Wellness Wing";
        if ("Telehealth".equalsIgnoreCase(mode)) {
            meetingLink = "https://meet.jit.si/lnmiit-counseling-" + UUID.randomUUID().toString().substring(0, 8);
            venue = "Online Video Consultation (Telehealth)";
        }

        // AC-14: Create Appointment record with status CONFIRMED
        Appointment appointment = Appointment.builder()
                .request(request)
                .slot(slot)
                .student(request.getStudent())
                .counselor(slot.getCounselor())
                .appointmentDate(slot.getSlotDate())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .mode(mode)
                .meetingLink(meetingLink)
                .venue(venue)
                .status(AppointmentStatus.CONFIRMED)
                .createdAt(LocalDateTime.now())
                .build();
        Appointment savedAppointment = appointmentRepository.save(appointment);

        // UC-007 Step 8: Update associated ServiceRequest status to SCHEDULED
        request.setStatus(RequestStatus.SCHEDULED);
        request.setAssignedCounselor(slot.getCounselor());
        request.setUpdatedAt(LocalDateTime.now());
        requestRepository.save(request);

        // AC-15 & FR-040: Automated booking confirmations dispatched to both student and counselor
        String studentMessage = "Your consultation with " + slot.getCounselor().getFullName() +
                " is confirmed for " + slot.getSlotDate() + " at " + slot.getStartTime() + " (" + mode + ").";
        if (meetingLink != null) {
            studentMessage += " Secure Telehealth Link: " + meetingLink;
        }

        notificationService.sendNotification(
                request.getStudent(),
                "BOOKING_CONFIRMATION",
                "Appointment Confirmed (#APT-" + savedAppointment.getAppointmentId() + ")",
                studentMessage,
                "/appointments"
        );

        notificationService.sendNotification(
                slot.getCounselor(),
                "BOOKING_CONFIRMATION",
                "New Consultation Scheduled",
                "Student " + request.getStudent().getFullName() + " booked slot on " +
                slot.getSlotDate() + " at " + slot.getStartTime() + " (" + mode + ").",
                "/counselor/appointments"
        );

        auditLogService.recordAction(
                request.getStudent(),
                "BOOK_APPOINTMENT",
                "Appointment",
                savedAppointment.getAppointmentId(),
                "Booked consultation slot #" + slot.getSlotId() + " with counselor " + slot.getCounselor().getFullName()
        );

        return savedAppointment;
    }

    public List<Appointment> getStudentAppointments(Long studentId) {
        return appointmentRepository.findByStudentUserIdOrderByAppointmentDateDescStartTimeDesc(studentId);
    }

    public List<Appointment> getCounselorAppointments(Long counselorId) {
        return appointmentRepository.findByCounselorUserIdOrderByAppointmentDateDescStartTimeDesc(counselorId);
    }

    // FR-039 & BR-009: Appointment Cancellation with at least 4 hours notice
    @Transactional
    public Appointment cancelAppointment(Long appointmentId, User actor, String reason) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + appointmentId));

        LocalDateTime appointmentTime = LocalDateTime.of(appointment.getAppointmentDate(), appointment.getStartTime());

        // BR-009: Must be executed at least 4 hours prior to scheduled start time
        if (LocalDateTime.now().plusHours(4).isAfter(appointmentTime)) {
            throw new BusinessRuleException(
                    "Late cancellation restriction: Appointments must be cancelled at least 4 hours in advance " +
                    "to allow the slot to be released to other students (BR-009)."
            );
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Reopen availability slot (BR-009)
        AvailabilitySlot slot = appointment.getSlot();
        if (slot != null) {
            slot.setStatus(SlotStatus.AVAILABLE);
            slotRepository.save(slot);
        }

        // Return service request to TRIAGED state so student can rebook
        ServiceRequest req = appointment.getRequest();
        if (req != null) {
            req.setStatus(RequestStatus.TRIAGED);
            requestRepository.save(req);
        }

        // Notify both parties
        notificationService.sendNotification(
                appointment.getStudent(),
                "BOOKING_CONFIRMATION",
                "Appointment Cancelled",
                "Your appointment on " + appointment.getAppointmentDate() + " was cancelled. Reason: " + reason,
                "/appointments"
        );

        notificationService.sendNotification(
                appointment.getCounselor(),
                "BOOKING_CONFIRMATION",
                "Appointment Cancelled",
                "Consultation on " + appointment.getAppointmentDate() + " was cancelled. Slot reopened.",
                "/counselor/appointments"
        );

        auditLogService.recordAction(
                actor,
                "CANCEL_APPOINTMENT",
                "Appointment",
                appointmentId,
                "Cancelled consultation with reason: " + reason
        );

        return savedAppointment;
    }

    // FR-041, FR-043, FR-047 & BR-015: Completed consultations require mandatory closing remarks
    @Transactional
    public ClinicalNote completeAppointmentWithNotes(Long appointmentId, User counselor, CompleteAppointmentDto dto) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + appointmentId));

        if (!appointment.getCounselor().getUserId().equals(counselor.getUserId())) {
            throw new BusinessRuleException("Only the assigned authoring counselor can record clinical notes (BR-005).");
        }

        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);

        ServiceRequest request = appointment.getRequest();
        request.setStatus(RequestStatus.COMPLETED);
        request.setUpdatedAt(LocalDateTime.now());
        requestRepository.save(request);

        // Record confidential clinical notes
        ClinicalNote note = ClinicalNote.builder()
                .appointment(appointment)
                .request(request)
                .counselor(counselor)
                .student(appointment.getStudent())
                .sessionSummary(dto.getSessionSummary())
                .clinicalObservations(dto.getClinicalObservations())
                .actionPlan(dto.getActionPlan())
                .outcomeCategory(dto.getOutcomeCategory())
                .confidentialityLevel("RESTRICTED_CLINICAL")
                .recordedAt(LocalDateTime.now())
                .build();
        ClinicalNote savedNote = clinicalNoteRepository.save(note);

        notificationService.sendNotification(
                appointment.getStudent(),
                "REQUEST_UPDATE",
                "Counseling Session Concluded",
                "Your consultation on " + appointment.getAppointmentDate() + " has been completed. Follow-up plan recorded.",
                "/dashboard"
        );

        auditLogService.recordAction(
                counselor,
                "CASE_CLOSURE",
                "ServiceRequest",
                request.getRequestId(),
                "Counselor finalized session and archived case with outcome: " + dto.getOutcomeCategory()
        );

        return savedNote;
    }

    public ClinicalNote getClinicalNoteForAppointment(Long appointmentId, User actor) {
        ClinicalNote note = clinicalNoteRepository.findByAppointmentAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("No clinical notes found for appointment ID: " + appointmentId));

        // BR-005: Clinical consultation notes are confidential and only accessible to assigned counselor and medical leads
        boolean isAuthorized = actor.getRole() == Role.ADMIN ||
                actor.getRole() == Role.HEALTH_CENTER ||
                (actor.getRole() == Role.COUNSELOR && note.getCounselor().getUserId().equals(actor.getUserId()));

        if (!isAuthorized) {
            throw new BusinessRuleException("Access Denied: Clinical consultation notes are confidential (BR-005).");
        }

        return note;
    }
}
