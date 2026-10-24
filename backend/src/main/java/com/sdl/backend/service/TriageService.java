package com.sdl.backend.service;

import com.sdl.backend.dto.EmergencyEscalationDto;
import com.sdl.backend.dto.TriageEvaluationDto;
import com.sdl.backend.exception.BusinessRuleException;
import com.sdl.backend.exception.ResourceNotFoundException;
import com.sdl.backend.model.*;
import com.sdl.backend.repository.HealthCenterReferralRepository;
import com.sdl.backend.repository.ServiceRequestRepository;
import com.sdl.backend.repository.TriageEvaluationRepository;
import com.sdl.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TriageService {

    private final ServiceRequestRepository requestRepository;
    private final TriageEvaluationRepository triageEvaluationRepository;
    private final HealthCenterReferralRepository healthCenterReferralRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    // FR-042: Counselor Triage Queue sorted by urgency & wait time
    public List<ServiceRequest> getPendingTriageQueue() {
        return requestRepository.findPendingTriageQueue(RequestStatus.PENDING_REVIEW);
    }

    public List<ServiceRequest> getAllRequests() {
        return requestRepository.findAllByOrderByCreatedAtDesc();
    }

    // UC-010: Conduct Clinical Triage & Case Assignment (Routine/Priority path)
    @Transactional
    public ServiceRequest evaluateAndAssign(Long requestId, User counselor, TriageEvaluationDto dto) {
        ServiceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + requestId));

        if (request.getStatus() != RequestStatus.PENDING_REVIEW) {
            throw new BusinessRuleException("Request #REQ-" + requestId + " is not in PENDING_REVIEW state (Current: " + request.getStatus() + ")");
        }

        // Determine assigned counselor
        User assigned = counselor;
        if (dto.getAssignedCounselorId() != null) {
            assigned = userRepository.findById(dto.getAssignedCounselorId())
                    .orElse(counselor);
        }

        // Persist TriageEvaluation record
        TriageEvaluation evaluation = TriageEvaluation.builder()
                .request(request)
                .counselor(counselor)
                .priorityLevel(dto.getPriorityLevel())
                .remarks(dto.getRemarks())
                .evaluatedAt(LocalDateTime.now())
                .build();
        triageEvaluationRepository.save(evaluation);

        // Update request state to TRIAGED
        request.setStatus(RequestStatus.TRIAGED);
        request.setAssignedCounselor(assigned);
        request.setUrgencyLevel(dto.getPriorityLevel());
        request.setUpdatedAt(LocalDateTime.now());
        ServiceRequest updatedRequest = requestRepository.save(request);

        // Notify student: calendar is now unlocked for appointment booking
        notificationService.sendNotification(
                request.getStudent(),
                "REQUEST_UPDATE",
                "Support Request Triaged (#REQ-" + requestId + ")",
                "Your request has been triaged by " + counselor.getFullName() +
                ". You can now schedule your counseling consultation slot.",
                "/dashboard"
        );

        // NFR-007 / FR-032: Tamper-evident audit log
        auditLogService.recordAction(
                counselor,
                "TRIAGE_EVAL",
                "ServiceRequest",
                requestId,
                "Clinical triage completed. Priority: " + dto.getPriorityLevel() +
                ", Assigned Counselor: " + assigned.getFullName() + ", Remarks: " + dto.getRemarks()
        );

        return updatedRequest;
    }

    // UC-010 Emergency Alternative Flow (BR-007 / UC-011): Escalate to Campus Health Center
    @Transactional
    public HealthCenterReferral escalateToHealthCenter(Long requestId, User counselor, EmergencyEscalationDto dto) {
        ServiceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + requestId));

        // Update state to ESCALATED
        request.setStatus(RequestStatus.ESCALATED);
        request.setUpdatedAt(LocalDateTime.now());
        requestRepository.save(request);

        HealthCenterReferral referral = HealthCenterReferral.builder()
                .request(request)
                .counselor(counselor)
                .reason(dto.getReason())
                .priority(dto.getPriority() != null ? dto.getPriority() : "URGENT_EMERGENCY")
                .referralStatus("PENDING_INTAKE")
                .referredAt(LocalDateTime.now())
                .build();
        HealthCenterReferral savedReferral = healthCenterReferralRepository.save(referral);

        // Alert Health Center medical specialists
        List<User> healthStaff = userRepository.findByRole(Role.HEALTH_CENTER);
        for (User staff : healthStaff) {
            notificationService.sendNotification(
                    staff,
                    "ESCALATION_ALERT",
                    "🚨 CRITICAL MEDICAL ESCALATION: Case #REQ-" + requestId,
                    "Emergency referral from counselor " + counselor.getFullName() + ". Reason: " + dto.getReason(),
                    "/health-center/referrals"
            );
        }

        // Notify Student
        notificationService.sendNotification(
                request.getStudent(),
                "ESCALATION_ALERT",
                "Emergency Care Coordination Initiated",
                "Your support request has been escalated to the Campus Health Center for priority medical assistance. " +
                "A specialist is reviewing your case immediately.",
                "/dashboard"
        );

        // Permanent audit trail entry (NFR-020)
        auditLogService.recordAction(
                counselor,
                "EMERGENCY_ESCALATION",
                "HealthCenterReferral",
                savedReferral.getReferralId(),
                "High-risk escalation dispatched to Campus Health Center for Request #REQ-" + requestId + ". Reason: " + dto.getReason()
        );

        return savedReferral;
    }

    public List<HealthCenterReferral> getAllReferrals() {
        return healthCenterReferralRepository.findAllByOrderByReferredAtDesc();
    }

    @Transactional
    public HealthCenterReferral acknowledgeReferral(Long referralId, User actor, String notes) {
        HealthCenterReferral referral = healthCenterReferralRepository.findById(referralId)
                .orElseThrow(() -> new ResourceNotFoundException("Referral not found: " + referralId));
        referral.setReferralStatus("ACKNOWLEDGED");
        referral.setIntakeNotes(notes);
        HealthCenterReferral saved = healthCenterReferralRepository.save(referral);

        auditLogService.recordAction(
                actor,
                "HEALTH_CENTER_INTAKE",
                "HealthCenterReferral",
                referralId,
                "Campus Health Center acknowledged referral intake. Notes: " + notes
        );

        return saved;
    }
}
