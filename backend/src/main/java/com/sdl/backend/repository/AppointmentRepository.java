package com.sdl.backend.repository;

import com.sdl.backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByStudentUserIdOrderByAppointmentDateDescStartTimeDesc(Long studentId);
    List<Appointment> findByCounselorUserIdOrderByAppointmentDateDescStartTimeDesc(Long counselorId);
    Optional<Appointment> findByRequestRequestId(Long requestId);
    Optional<Appointment> findBySlotSlotId(Long slotId);
}
