package com.sdl.backend.dto;

import com.sdl.backend.model.UrgencyLevel;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TriageEvaluationDto {
    @NotNull(message = "Clinical priority level is required")
    private UrgencyLevel priorityLevel;

    private String remarks;

    private Long assignedCounselorId;
}
