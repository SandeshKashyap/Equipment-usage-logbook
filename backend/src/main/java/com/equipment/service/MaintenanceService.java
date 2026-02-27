package com.equipment.service;

import com.equipment.dto.CreateMaintenanceRequest;
import com.equipment.dto.MaintenanceLogDTO;
import com.equipment.exception.ResourceNotFoundException;
import com.equipment.model.Equipment;
import com.equipment.model.MaintenanceLog;
import com.equipment.repository.EquipmentRepository;
import com.equipment.repository.MaintenanceLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaintenanceService {

    private final MaintenanceLogRepository maintenanceLogRepository;
    private final EquipmentRepository equipmentRepository;

    /**
     * WORKFLOW 1: Maintenance Auto-Update
     * When a maintenance record is created:
     * 1. Save the maintenance log
     * 2. Automatically set equipment status to "Active"
     * 3. Automatically update Last Cleaned Date to Maintenance Date
     */
    @Transactional
    public MaintenanceLogDTO createMaintenance(CreateMaintenanceRequest request) {
        // Verify equipment exists
        Equipment equipment = equipmentRepository.findById(request.getEquipmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with id: " + request.getEquipmentId()));

        // Create and save maintenance log
        MaintenanceLog maintenanceLog = new MaintenanceLog();
        maintenanceLog.setEquipmentId(request.getEquipmentId());
        maintenanceLog.setMaintenanceDate(request.getMaintenanceDate());
        maintenanceLog.setNotes(request.getNotes());
        maintenanceLog.setPerformedBy(request.getPerformedBy());

        MaintenanceLog savedLog = maintenanceLogRepository.save(maintenanceLog);

        // WORKFLOW 1: Automatically update equipment status and last cleaned date
        equipment.setStatus("Active");
        equipment.setLastCleanedDate(request.getMaintenanceDate());
        equipmentRepository.save(equipment);

        return convertToDTO(savedLog, equipment.getName());
    }

    @Transactional(readOnly = true)
    public List<MaintenanceLogDTO> getMaintenanceHistory(Long equipmentId) {
        // Verify equipment exists
        Equipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with id: " + equipmentId));

        List<MaintenanceLog> logs = maintenanceLogRepository.findByEquipmentIdOrderByMaintenanceDateDesc(equipmentId);

        return logs.stream()
                .map(log -> convertToDTO(log, equipment.getName()))
                .collect(Collectors.toList());
    }

    private MaintenanceLogDTO convertToDTO(MaintenanceLog log, String equipmentName) {
        MaintenanceLogDTO dto = new MaintenanceLogDTO();
        dto.setId(log.getId());
        dto.setEquipmentId(log.getEquipmentId());
        dto.setEquipmentName(equipmentName);
        dto.setMaintenanceDate(log.getMaintenanceDate());
        dto.setNotes(log.getNotes());
        dto.setPerformedBy(log.getPerformedBy());
        return dto;
    }
}
