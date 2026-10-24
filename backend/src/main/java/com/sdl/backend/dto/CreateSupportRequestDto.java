package com.sdl.backend.dto;

import com.sdl.backend.model.UrgencyLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSupportRequestDto {
    @NotNull(message = "Service ID is required")
    private Long serviceId;

    @NotNull(message = "Urgency level must be specified (Routine, Priority, Urgent)")
    private UrgencyLevel urgencyLevel;

    @NotBlank(message = "Concern description is required")
    private String description;

    private String preferredSchedule;

    private String preferredMode;
}
