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
public class EmergencyEscalationDto {
    @NotBlank(message = "Escalation reason and clinical justification are required")
    private String reason;

    @Builder.Default
    private String priority = "URGENT_EMERGENCY";
}
