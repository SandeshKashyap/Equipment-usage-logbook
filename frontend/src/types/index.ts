export interface Equipment {
  id: number;
  name: string;
  typeId: number;
  typeName: string;
  status: 'Active' | 'Inactive' | 'Under Maintenance';
  lastCleanedDate: string | null;
}

export interface EquipmentType {
  id: number;
  name: string;
}

export interface MaintenanceLog {
  id: number;
  equipmentId: number;
  equipmentName: string;
  maintenanceDate: string;
  notes: string | null;
  performedBy: string;
}

export interface CreateEquipmentRequest {
  name: string;
  typeId: number;
  status: 'Active' | 'Inactive' | 'Under Maintenance';
  lastCleanedDate: string | null;
}

export interface UpdateEquipmentRequest {
  name: string;
  typeId: number;
  status: 'Active' | 'Inactive' | 'Under Maintenance';
  lastCleanedDate: string | null;
}

export interface CreateMaintenanceRequest {
  equipmentId: number;
  maintenanceDate: string;
  notes: string | null;
  performedBy: string;
}

export interface ErrorResponse {
  status: number;
  message: string;
  timestamp: string;
}
