package com.equipment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentDTO {
    private Long id;
    private String name;
    private Long typeId;
    private String typeName;
    private String status;
    private LocalDate lastCleanedDate;
}
