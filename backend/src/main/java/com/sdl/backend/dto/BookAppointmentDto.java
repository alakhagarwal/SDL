package com.sdl.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookAppointmentDto {
    @NotNull(message = "Service Request ID is required")
    private Long requestId;

    @NotNull(message = "Availability Slot ID is required")
    private Long slotId;

    @Builder.Default
    private String mode = "In-person"; // In-person or Telehealth
}
