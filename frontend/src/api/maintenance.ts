import axios from 'axios';
import type { MaintenanceLog, CreateMaintenanceRequest } from '@/types';

const API_BASE_URL = 'http://localhost:8080/api';

export const maintenanceApi = {
  create: async (data: CreateMaintenanceRequest): Promise<MaintenanceLog> => {
    const response = await axios.post<MaintenanceLog>(`${API_BASE_URL}/maintenance`, data);
    return response.data;
  },

  getHistory: async (equipmentId: number): Promise<MaintenanceLog[]> => {
    const response = await axios.get<MaintenanceLog[]>(
      `${API_BASE_URL}/equipment/${equipmentId}/maintenance`
    );
    return response.data;
  },
};
