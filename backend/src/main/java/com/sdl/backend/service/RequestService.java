package com.sdl.backend.service;

import com.sdl.backend.dto.CancelRequestDto;
import com.sdl.backend.dto.CreateSupportRequestDto;
import com.sdl.backend.exception.BusinessRuleException;
import com.sdl.backend.exception.ResourceNotFoundException;
import com.sdl.backend.model.*;
import com.sdl.backend.repository.ServiceRequestRepository;
import com.sdl.backend.repository.UserRepository;
import com.sdl.backend.repository.WellnessServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RequestService {

    private final ServiceRequestRepository requestRepository;
    private final WellnessServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    @Transactional
    public ServiceRequest submitSupportRequest(Long studentId, CreateSupportRequestDto dto) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));

        // BR-002 & AC-02: A student cannot have more than 2 active open support requests simultaneously
        long activeCount = requestRepository.countActiveRequestsByStudent(studentId);
        if (activeCount >= 2) {
            throw new BusinessRuleException(
                    "Submission blocked: You already have " + activeCount + " active open support requests. " +
                    "Per institutional policy (BR-002), a student cannot have more than 2 active requests simultaneously. " +
                    "Please wait for your pending cases to be resolved or withdraw one."
            );
        }

        // AC-03: Selected wellness service must be in Active status
        WellnessService service = serviceRepository.findById(dto.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Wellness service not found: " + dto.getServiceId()));

        if (!"Active".equalsIgnoreCase(service.getStatus())) {
            throw new BusinessRuleException("Selected wellness service is currently unavailable or inactive.");
        }

        ServiceRequest request = ServiceRequest.builder()
                .student(student)
                .service(service)
                .urgencyLevel(dto.getUrgencyLevel())
                .description(dto.getDescription())
                .preferredSchedule(dto.getPreferredSchedule())
                .preferredMode(dto.getPreferredMode() != null ? dto.getPreferredMode() : service.getMode())
                .status(RequestStatus.PENDING_REVIEW)
                .assignedCounselor(service.getAssignedCounselor())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        ServiceRequest savedRequest = requestRepository.save(request);

        // AC-07: In-app confirmation notification to student
        notificationService.sendNotification(
                student,
                "REQUEST_UPDATE",
                "Support Request Submitted (#REQ-" + savedRequest.getRequestId() + ")",
                "Your confidential request for '" + service.getTitle() + "' has been queued for counselor clinical triage.",
                "/dashboard"
        );

        // AC-08 & FR-026: Alert counselors on duty (especially if URGENT)
        List<User> counselors = userRepository.findByRole(com.sdl.backend.model.Role.COUNSELOR);
        String alertTitle = savedRequest.getUrgencyLevel() == UrgencyLevel.URGENT
                ? "⚠️ PRIORITY ALERT: Urgent Support Request #REQ-" + savedRequest.getRequestId()
                : "New Support Request #REQ-" + savedRequest.getRequestId();

        String alertMessage = "New " + savedRequest.getUrgencyLevel() + " request submitted under " + service.getTitle();
        for (User c : counselors) {
            notificationService.sendNotification(c, "REQUEST_UPDATE", alertTitle, alertMessage, "/counselor/triage");
        }

        // FR-032 / NFR-007: Log creation in audit trail
        auditLogService.recordAction(
                student,
                "SUBMIT_SUPPORT_REQUEST",
                "ServiceRequest",
                savedRequest.getRequestId(),
                "Submitted support request with urgency: " + savedRequest.getUrgencyLevel()
        );

        return savedRequest;
    }

    public List<ServiceRequest> getStudentRequests(Long studentId) {
        return requestRepository.findByStudentUserIdOrderByCreatedAtDesc(studentId);
    }

    public ServiceRequest getRequestById(Long requestId) {
        return requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Support request not found with ID: " + requestId));
    }

    @Transactional
    public ServiceRequest cancelRequest(Long requestId, Long studentId, CancelRequestDto dto) {
        ServiceRequest request = getRequestById(requestId);

        if (!request.getStudent().getUserId().equals(studentId)) {
            throw new BusinessRuleException("You are not authorized to cancel this support request.");
        }

        if (request.getStatus() == RequestStatus.COMPLETED || request.getStatus() == RequestStatus.CANCELLED) {
            throw new BusinessRuleException("This support request cannot be cancelled in its current state (" + request.getStatus() + ").");
        }

        request.setStatus(RequestStatus.CANCELLED);
        request.setCancellationReason(dto.getReason());
        request.setUpdatedAt(LocalDateTime.now());
        ServiceRequest updated = requestRepository.save(request);

        notificationService.sendNotification(
                request.getStudent(),
                "REQUEST_UPDATE",
                "Support Request Cancelled",
                "Your request #REQ-" + requestId + " has been withdrawn. Reason: " + dto.getReason(),
                "/dashboard"
        );

        User student = request.getStudent();
        auditLogService.recordAction(student, "CANCEL_SUPPORT_REQUEST", "ServiceRequest", requestId,
                "Student cancelled request with reason: " + dto.getReason());

        return updated;
    }
}
