package com.equipment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateEquipmentRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    private String name;

    @NotNull(message = "Type ID is required")
    private Long typeId;

    @NotNull(message = "Status is required")
    @Pattern(regexp = "Active|Inactive|Under Maintenance", message = "Status must be Active, Inactive, or Under Maintenance")
    private String status;

    private LocalDate lastCleanedDate;
}
