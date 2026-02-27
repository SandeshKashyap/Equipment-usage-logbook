package com.equipment.controller;

import com.equipment.dto.CreateMaintenanceRequest;
import com.equipment.dto.MaintenanceLogDTO;
import com.equipment.service.MaintenanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @PostMapping("/maintenance")
    public ResponseEntity<MaintenanceLogDTO> createMaintenance(@Valid @RequestBody CreateMaintenanceRequest request) {
        MaintenanceLogDTO created = maintenanceService.createMaintenance(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/equipment/{equipmentId}/maintenance")
    public ResponseEntity<List<MaintenanceLogDTO>> getMaintenanceHistory(@PathVariable Long equipmentId) {
        List<MaintenanceLogDTO> history = maintenanceService.getMaintenanceHistory(equipmentId);
        return ResponseEntity.ok(history);
    }
}
