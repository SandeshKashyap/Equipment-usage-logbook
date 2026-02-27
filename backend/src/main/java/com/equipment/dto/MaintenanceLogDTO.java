package com.equipment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceLogDTO {
    private Long id;
    private Long equipmentId;
    private String equipmentName;
    private LocalDate maintenanceDate;
    private String notes;
    private String performedBy;
}
