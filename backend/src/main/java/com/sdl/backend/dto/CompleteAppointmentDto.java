package com.sdl.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompleteAppointmentDto {
    @NotBlank(message = "Session clinical summary is mandatory")
    private String sessionSummary;

    private String clinicalObservations;

    private String actionPlan;

    @NotBlank(message = "Outcome categorization is mandatory")
    private String outcomeCategory; // e.g. "Follow-up Required", "Resolved", "Referred"
}
