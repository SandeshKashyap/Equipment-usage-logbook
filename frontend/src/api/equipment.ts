import axios from 'axios';
import type { Equipment, CreateEquipmentRequest, UpdateEquipmentRequest } from '@/types';

const API_BASE_URL = 'http://localhost:8080/api';

export const equipmentApi = {
  getAll: async (): Promise<Equipment[]> => {
    const response = await axios.get<Equipment[]>(`${API_BASE_URL}/equipment`);
    return response.data;
  },

  getById: async (id: number): Promise<Equipment> => {
    const response = await axios.get<Equipment>(`${API_BASE_URL}/equipment/${id}`);
    return response.data;
  },

  create: async (data: CreateEquipmentRequest): Promise<Equipment> => {
    const response = await axios.post<Equipment>(`${API_BASE_URL}/equipment`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateEquipmentRequest): Promise<Equipment> => {
    const response = await axios.put<Equipment>(`${API_BASE_URL}/equipment/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/equipment/${id}`);
  },
};
