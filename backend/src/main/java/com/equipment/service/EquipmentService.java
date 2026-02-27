package com.equipment.service;

import com.equipment.dto.CreateEquipmentRequest;
import com.equipment.dto.EquipmentDTO;
import com.equipment.dto.UpdateEquipmentRequest;
import com.equipment.exception.BusinessRuleViolationException;
import com.equipment.exception.ResourceNotFoundException;
import com.equipment.model.Equipment;
import com.equipment.model.EquipmentType;
import com.equipment.repository.EquipmentRepository;
import com.equipment.repository.EquipmentTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final EquipmentTypeRepository equipmentTypeRepository;

    @Transactional(readOnly = true)
    public List<EquipmentDTO> getAllEquipment() {
        return equipmentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EquipmentDTO getEquipmentById(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with id: " + id));
        return convertToDTO(equipment);
    }

    @Transactional
    public EquipmentDTO createEquipment(CreateEquipmentRequest request) {
        // Verify equipment type exists
        equipmentTypeRepository.findById(request.getTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment type not found with id: " + request.getTypeId()));

        // Validate 30-day rule for Active status
        validate30DayRule(request.getStatus(), request.getLastCleanedDate());

        Equipment equipment = new Equipment();
        equipment.setName(request.getName());
        equipment.setTypeId(request.getTypeId());
        equipment.setStatus(request.getStatus());
        equipment.setLastCleanedDate(request.getLastCleanedDate());

        Equipment saved = equipmentRepository.save(equipment);
        return convertToDTO(saved);
    }

    @Transactional
    public EquipmentDTO updateEquipment(Long id, UpdateEquipmentRequest request) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with id: " + id));

        // Verify equipment type exists
        equipmentTypeRepository.findById(request.getTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment type not found with id: " + request.getTypeId()));

        // Validate 30-day rule for Active status (WORKFLOW 2)
        validate30DayRule(request.getStatus(), request.getLastCleanedDate());

        equipment.setName(request.getName());
        equipment.setTypeId(request.getTypeId());
        equipment.setStatus(request.getStatus());
        equipment.setLastCleanedDate(request.getLastCleanedDate());

        Equipment updated = equipmentRepository.save(equipment);
        return convertToDTO(updated);
    }

    @Transactional
    public void deleteEquipment(Long id) {
        if (!equipmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Equipment not found with id: " + id);
        }
        equipmentRepository.deleteById(id);
    }

    /**
     * WORKFLOW 2: 30-Day Status Constraint
     * Equipment cannot be marked as "Active" if Last Cleaned Date is older than 30 days
     */
    private void validate30DayRule(String status, LocalDate lastCleanedDate) {
        if ("Active".equals(status)) {
            if (lastCleanedDate == null) {
                throw new BusinessRuleViolationException(
                        "Cannot set status to Active: Last Cleaned Date is required"
                );
            }

            long daysSinceLastCleaned = ChronoUnit.DAYS.between(lastCleanedDate, LocalDate.now());
            if (daysSinceLastCleaned > 30) {
                throw new BusinessRuleViolationException(
                        "Cannot set status to Active: Last Cleaned Date is older than 30 days (" + daysSinceLastCleaned + " days ago)"
                );
            }
        }
    }

    private EquipmentDTO convertToDTO(Equipment equipment) {
        EquipmentDTO dto = new EquipmentDTO();
        dto.setId(equipment.getId());
        dto.setName(equipment.getName());
        dto.setTypeId(equipment.getTypeId());
        dto.setStatus(equipment.getStatus());
        dto.setLastCleanedDate(equipment.getLastCleanedDate());

        // Fetch type name
        equipmentTypeRepository.findById(equipment.getTypeId())
                .ifPresent(type -> dto.setTypeName(type.getName()));

        return dto;
    }
}
