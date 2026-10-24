package com.sdl.backend.repository;

import com.sdl.backend.model.RequestStatus;
import com.sdl.backend.model.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    List<ServiceRequest> findByStudentUserIdOrderByCreatedAtDesc(Long studentId);

    List<ServiceRequest> findByAssignedCounselorUserIdOrderByCreatedAtDesc(Long counselorId);

    @Query("SELECT r FROM ServiceRequest r WHERE r.status = :status ORDER BY " +
           "CASE r.urgencyLevel WHEN com.sdl.backend.model.UrgencyLevel.URGENT THEN 1 " +
           "WHEN com.sdl.backend.model.UrgencyLevel.PRIORITY THEN 2 " +
           "WHEN com.sdl.backend.model.UrgencyLevel.ROUTINE THEN 3 ELSE 4 END ASC, " +
           "r.createdAt ASC")
    List<ServiceRequest> findPendingTriageQueue(@Param("status") RequestStatus status);

    List<ServiceRequest> findAllByOrderByCreatedAtDesc();

    // BR-002: count active pending/ongoing requests for a student
    @Query("SELECT COUNT(r) FROM ServiceRequest r WHERE r.student.userId = :studentId " +
           "AND r.status IN (com.sdl.backend.model.RequestStatus.PENDING_REVIEW, " +
           "com.sdl.backend.model.RequestStatus.TRIAGED, " +
           "com.sdl.backend.model.RequestStatus.SCHEDULED, " +
           "com.sdl.backend.model.RequestStatus.IN_PROGRESS)")
    long countActiveRequestsByStudent(@Param("studentId") Long studentId);
}
