package com.equipment.service;

import com.equipment.dto.EquipmentTypeDTO;
import com.equipment.model.EquipmentType;
import com.equipment.repository.EquipmentTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EquipmentTypeService {

    private final EquipmentTypeRepository equipmentTypeRepository;

    @Transactional(readOnly = true)
    public List<EquipmentTypeDTO> getAllEquipmentTypes() {
        return equipmentTypeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private EquipmentTypeDTO convertToDTO(EquipmentType type) {
        EquipmentTypeDTO dto = new EquipmentTypeDTO();
        dto.setId(type.getId());
        dto.setName(type.getName());
        return dto;
    }
}
