package com.sdl.backend;

import com.sdl.backend.dto.*;
import com.sdl.backend.exception.BusinessRuleException;
import com.sdl.backend.model.*;
import com.sdl.backend.repository.AvailabilitySlotRepository;
import com.sdl.backend.repository.ServiceRequestRepository;
import com.sdl.backend.repository.UserRepository;
import com.sdl.backend.repository.WellnessServiceRepository;
import com.sdl.backend.service.BookingService;
import com.sdl.backend.service.RequestService;
import com.sdl.backend.service.TriageService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class CoreWorkflowsIntegrationTest {

    @Autowired
    private RequestService requestService;

    @Autowired
    private TriageService triageService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WellnessServiceRepository serviceRepository;

    @Autowired
    private ServiceRequestRepository requestRepository;

    @Autowired
    private AvailabilitySlotRepository slotRepository;

    @Test
    @DisplayName("UC-005 & BR-002: Student support request submission and active request limit validation")
    void testSupportRequestSubmissionAndLimit() {
        User student = userRepository.findByEmail("24ucs001@lnmiit.ac.in").orElseThrow();
        WellnessService service = serviceRepository.findAll().get(0);

        // Submit first additional request (Alakh has 1 pending from seed data) -> Total 2 active requests
        CreateSupportRequestDto req1 = CreateSupportRequestDto.builder()
                .serviceId(service.getServiceId())
                .urgencyLevel(UrgencyLevel.ROUTINE)
                .description("Need guidance with academic stress and scheduling")
                .preferredMode("In-person")
                .build();

        ServiceRequest created1 = requestService.submitSupportRequest(student.getUserId(), req1);
        assertNotNull(created1.getRequestId());
        assertEquals(RequestStatus.PENDING_REVIEW, created1.getStatus());

        // Attempt to submit a 3rd request -> BR-002 must block submission
        CreateSupportRequestDto req2 = CreateSupportRequestDto.builder()
                .serviceId(service.getServiceId())
                .urgencyLevel(UrgencyLevel.PRIORITY)
                .description("Attempting third request while two are already active")
                .build();

        BusinessRuleException ex = assertThrows(BusinessRuleException.class, () -> {
            requestService.submitSupportRequest(student.getUserId(), req2);
        });

        assertTrue(ex.getMessage().contains("BR-002"));
    }

    @Test
    @DisplayName("UC-010: Counselor clinical triage evaluation and case assignment")
    void testClinicalTriageEvaluation() {
        User counselor = userRepository.findByEmail("counselor@lnmiit.ac.in").orElseThrow();

        // Get pending request from seed data
        ServiceRequest pending = triageService.getPendingTriageQueue().get(0);
        assertEquals(RequestStatus.PENDING_REVIEW, pending.getStatus());

        // Perform clinical evaluation
        TriageEvaluationDto evalDto = TriageEvaluationDto.builder()
                .priorityLevel(UrgencyLevel.PRIORITY)
                .remarks("Student displays moderate distress. Assigned priority counseling.")
                .assignedCounselorId(counselor.getUserId())
                .build();

        ServiceRequest triaged = triageService.evaluateAndAssign(pending.getRequestId(), counselor, evalDto);

        assertEquals(RequestStatus.TRIAGED, triaged.getStatus());
        assertEquals(counselor.getUserId(), triaged.getAssignedCounselor().getUserId());
    }

    @Test
    @DisplayName("UC-010 & BR-007: Emergency escalation to Campus Health Center")
    void testEmergencyEscalation() {
        User counselor = userRepository.findByEmail("counselor@lnmiit.ac.in").orElseThrow();
        ServiceRequest pending = triageService.getPendingTriageQueue().get(0);

        EmergencyEscalationDto escalationDto = EmergencyEscalationDto.builder()
                .reason("Acute emotional crisis requiring immediate clinical evaluation.")
                .priority("URGENT_EMERGENCY")
                .build();

        HealthCenterReferral referral = triageService.escalateToHealthCenter(pending.getRequestId(), counselor, escalationDto);

        assertNotNull(referral.getReferralId());
        assertEquals("PENDING_INTAKE", referral.getReferralStatus());

        ServiceRequest updatedReq = requestRepository.findById(pending.getRequestId()).orElseThrow();
        assertEquals(RequestStatus.ESCALATED, updatedReq.getStatus());
    }

    @Test
    @DisplayName("UC-007, BR-003, BR-004 & BR-011: Slot booking, 24h advance check, atomic lock, and Telehealth URL generation")
    void testSlotBookingWorkflow() {
        User student = userRepository.findByEmail("24ucs002@lnmiit.ac.in").orElseThrow();
        User counselor = userRepository.findByEmail("counselor@lnmiit.ac.in").orElseThrow();

        // Find triaged request for Daksh from seed data
        ServiceRequest triagedReq = requestRepository.findByStudentUserIdOrderByCreatedAtDesc(student.getUserId())
                .stream()
                .filter(r -> r.getStatus() == RequestStatus.TRIAGED)
                .findFirst()
                .orElseThrow();

        // Create a slot 48 hours in the future
        AvailabilitySlot slot = AvailabilitySlot.builder()
                .counselor(counselor)
                .slotDate(LocalDate.now().plusDays(2))
                .startTime(LocalTime.of(14, 0))
                .endTime(LocalTime.of(14, 45))
                .status(SlotStatus.AVAILABLE)
                .build();
        slot = slotRepository.save(slot);

        // Book slot with Telehealth mode
        BookAppointmentDto bookingDto = BookAppointmentDto.builder()
                .requestId(triagedReq.getRequestId())
                .slotId(slot.getSlotId())
                .mode("Telehealth")
                .build();

        Appointment appointment = bookingService.bookAppointment(student.getUserId(), bookingDto);

        assertNotNull(appointment.getAppointmentId());
        assertEquals(AppointmentStatus.CONFIRMED, appointment.getStatus());
        assertNotNull(appointment.getMeetingLink(), "Telehealth link must be dynamically generated per BR-011");
        assertTrue(appointment.getMeetingLink().contains("meet.jit.si"));

        // Verify slot is now BOOKED (BR-004)
        AvailabilitySlot updatedSlot = slotRepository.findById(slot.getSlotId()).orElseThrow();
        assertEquals(SlotStatus.BOOKED, updatedSlot.getStatus());

        // Verify associated service request status transitioned to SCHEDULED
        ServiceRequest updatedReq = requestRepository.findById(triagedReq.getRequestId()).orElseThrow();
        assertEquals(RequestStatus.SCHEDULED, updatedReq.getStatus());

        // Attempting to book the already-booked slot for another request must throw BR-004 concurrency exception
        ServiceRequest otherTriagedReq = ServiceRequest.builder()
                .student(student)
                .service(triagedReq.getService())
                .urgencyLevel(UrgencyLevel.PRIORITY)
                .description("Another inquiry")
                .status(RequestStatus.TRIAGED)
                .build();
        otherTriagedReq = requestRepository.save(otherTriagedReq);

        BookAppointmentDto duplicateBookingDto = BookAppointmentDto.builder()
                .requestId(otherTriagedReq.getRequestId())
                .slotId(slot.getSlotId())
                .mode("Telehealth")
                .build();

        BusinessRuleException conflictEx = assertThrows(BusinessRuleException.class, () -> {
            bookingService.bookAppointment(student.getUserId(), duplicateBookingDto);
        });
        assertTrue(conflictEx.getMessage().contains("BR-004") || conflictEx.getMessage().contains("Conflict"));
    }
}
