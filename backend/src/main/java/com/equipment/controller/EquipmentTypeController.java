package com.equipment.controller;

import com.equipment.dto.EquipmentTypeDTO;
import com.equipment.service.EquipmentTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/equipment-types")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EquipmentTypeController {

    private final EquipmentTypeService equipmentTypeService;

    @GetMapping
    public ResponseEntity<List<EquipmentTypeDTO>> getAllEquipmentTypes() {
        List<EquipmentTypeDTO> types = equipmentTypeService.getAllEquipmentTypes();
        return ResponseEntity.ok(types);
    }
}
