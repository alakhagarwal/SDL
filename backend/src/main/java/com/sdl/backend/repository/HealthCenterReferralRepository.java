package com.sdl.backend.repository;

import com.sdl.backend.model.HealthCenterReferral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HealthCenterReferralRepository extends JpaRepository<HealthCenterReferral, Long> {
    List<HealthCenterReferral> findAllByOrderByReferredAtDesc();
    Optional<HealthCenterReferral> findByRequestRequestId(Long requestId);
}
