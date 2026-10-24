package com.sdl.backend.repository;

import com.sdl.backend.model.ClinicalNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClinicalNoteRepository extends JpaRepository<ClinicalNote, Long> {
    Optional<ClinicalNote> findByAppointmentAppointmentId(Long appointmentId);
    Optional<ClinicalNote> findByRequestRequestId(Long requestId);
}
