package com.equipment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateMaintenanceRequest {

    @NotNull(message = "Equipment ID is required")
    private Long equipmentId;

    @NotNull(message = "Maintenance date is required")
    private LocalDate maintenanceDate;

    private String notes;

    @NotBlank(message = "Performed by is required")
    @Size(max = 255, message = "Performed by must not exceed 255 characters")
    private String performedBy;
}
