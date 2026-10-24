package com.sdl.backend.repository;

import com.sdl.backend.model.TriageEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TriageEvaluationRepository extends JpaRepository<TriageEvaluation, Long> {
    Optional<TriageEvaluation> findByRequestRequestId(Long requestId);
}
