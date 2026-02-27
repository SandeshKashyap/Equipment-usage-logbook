import axios from 'axios';
import type { EquipmentType } from '@/types';

const API_BASE_URL = 'http://localhost:8080/api';

export const equipmentTypesApi = {
  getAll: async (): Promise<EquipmentType[]> => {
    const response = await axios.get<EquipmentType[]>(`${API_BASE_URL}/equipment-types`);
    return response.data;
  },
};
