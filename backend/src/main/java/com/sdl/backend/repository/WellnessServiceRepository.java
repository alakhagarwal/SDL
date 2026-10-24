package com.sdl.backend.repository;

import com.sdl.backend.model.WellnessService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WellnessServiceRepository extends JpaRepository<WellnessService, Long> {
    List<WellnessService> findByStatus(String status);
    List<WellnessService> findByCategoryIgnoreCaseAndStatus(String category, String status);
}
