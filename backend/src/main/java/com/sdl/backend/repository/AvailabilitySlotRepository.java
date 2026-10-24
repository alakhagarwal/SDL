package com.sdl.backend.repository;

import com.sdl.backend.model.AvailabilitySlot;
import com.sdl.backend.model.SlotStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, Long> {

    List<AvailabilitySlot> findByCounselorUserIdAndStatusOrderBySlotDateAscStartTimeAsc(Long counselorId, SlotStatus status);

    List<AvailabilitySlot> findByCounselorUserIdOrderBySlotDateAscStartTimeAsc(Long counselorId);

    List<AvailabilitySlot> findByStatusAndSlotDateGreaterThanEqualOrderBySlotDateAscStartTimeAsc(SlotStatus status, LocalDate minDate);

    // BR-004: Atomic slot locking to prevent race conditions & double-booking
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM AvailabilitySlot s WHERE s.slotId = :slotId")
    Optional<AvailabilitySlot> findWithLockBySlotId(@Param("slotId") Long slotId);
}
