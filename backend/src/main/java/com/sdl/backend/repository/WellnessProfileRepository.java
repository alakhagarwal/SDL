package com.sdl.backend.repository;

import com.sdl.backend.model.WellnessProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WellnessProfileRepository extends JpaRepository<WellnessProfile, Long> {
    Optional<WellnessProfile> findByUserUserId(Long userId);
}
