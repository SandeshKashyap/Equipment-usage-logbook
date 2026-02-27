import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { EquipmentForm, type EquipmentFormData } from './EquipmentForm';
import { MaintenanceHistory } from '../maintenance/MaintenanceHistory';
import { MaintenanceForm, type MaintenanceFormData } from '../maintenance/MaintenanceForm';
import { GXPConfirmDialog } from '../common/GXPConfirmDialog';
import { equipmentApi } from '@/api/equipment';
import { equipmentTypesApi } from '@/api/equipmentTypes';
import { maintenanceApi } from '@/api/maintenance';
import { formatDateWithRelative, needsCleaning } from '@/utils/date';
import type { Equipment, EquipmentType } from '@/types';
import axios from 'axios';

export function EquipmentList() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [equipmentData, typesData] = await Promise.all([
        equipmentApi.getAll(),
        equipmentTypesApi.getAll(),
      ]);
      setEquipment(equipmentData);
      setEquipmentTypes(typesData);
    } catch (error) {
      toast.error('Failed to load equipment data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: EquipmentFormData) => {
    try {
      await equipmentApi.create({
        ...data,
        lastCleanedDate: data.lastCleanedDate || null,
      });
      toast.success('Equipment created successfully');
      setIsAddOpen(false);
      loadData();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to create equipment');
      }
    }
  };

  const handleUpdate = async (data: EquipmentFormData) => {
    if (!selectedEquipment) return;
    try {
      await equipmentApi.update(selectedEquipment.id, {
        ...data,
        lastCleanedDate: data.lastCleanedDate || null,
      });
      toast.success('Equipment updated successfully');
      setIsEditOpen(false);
      setSelectedEquipment(null);
      loadData();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update equipment');
      }
    }
  };

  const handleDeleteClick = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async (reason: string, performedBy: string) => {
    if (!selectedEquipment) return;
    try {
      await equipmentApi.delete(selectedEquipment.id);
      toast.success('Equipment deleted successfully');
      setIsDeleteOpen(false);
      setSelectedEquipment(null);
      loadData();
    } catch (error) {
      toast.error('Failed to delete equipment');
    }
  };

  const handleMaintenanceSubmit = async (data: MaintenanceFormData) => {
    if (!selectedEquipment) return;
    try {
      await maintenanceApi.create({
        equipmentId: selectedEquipment.id,
        ...data,
      });
      toast.success('Maintenance log created. Equipment status updated to Active.');
      setIsMaintenanceOpen(false);
      setSelectedEquipment(null);
      loadData();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to create maintenance log');
      }
    }
  };

  const handleEdit = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsEditOpen(true);
  };

  const handleMaintenance = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsMaintenanceOpen(true);
  };

  const handleHistory = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsHistoryOpen(true);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-600/10';
      case 'Under Maintenance':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-600/10';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 ring-1 ring-slate-600/10';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading equipment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              Equipment Management System
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Manage and track your pharmaceutical equipment inventory
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setIsAddOpen(true)}
              size="lg"
              className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              Add Equipment
            </Button>
          </motion.div>
        </motion.div>

        {/* Equipment Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="border rounded-xl shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Cleaned</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipment.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-muted-foreground"
                    >
                      <p className="text-lg font-medium">No equipment found</p>
                      <p className="text-sm mt-2">Click "Add Equipment" to get started</p>
                    </motion.div>
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence mode="popLayout">
                  {equipment.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell className="font-semibold text-slate-900">{item.name}</TableCell>
                      <TableCell className="text-slate-600">{item.typeName}</TableCell>
                      <TableCell>
                        <motion.span
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(item.status)}`}
                        >
                          {item.status}
                        </motion.span>
                      </TableCell>
                      <TableCell>
                        <span className={needsCleaning(item.lastCleanedDate) ? 'text-orange-600 font-bold' : 'text-slate-600 font-medium'}>
                          {formatDateWithRelative(item.lastCleanedDate)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMaintenance(item)}
                              className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors"
                            >
                              Maintenance
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleHistory(item)}
                              className="hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 transition-colors"
                            >
                              History
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(item)}
                              className="hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 transition-colors"
                            >
                              Edit
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClick(item)}
                              className="hover:shadow-lg hover:shadow-red-500/20 transition-shadow"
                            >
                              Delete
                            </Button>
                          </motion.div>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Equipment Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Equipment</DialogTitle>
          </DialogHeader>
          <EquipmentForm
            equipmentTypes={equipmentTypes}
            onSubmit={handleCreate}
            onCancel={() => setIsAddOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Equipment Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Equipment</DialogTitle>
          </DialogHeader>
          {selectedEquipment && (
            <EquipmentForm
              initialData={selectedEquipment}
              equipmentTypes={equipmentTypes}
              onSubmit={handleUpdate}
              onCancel={() => {
                setIsEditOpen(false);
                setSelectedEquipment(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Maintenance Dialog */}
      <Dialog open={isMaintenanceOpen} onOpenChange={setIsMaintenanceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Maintenance</DialogTitle>
          </DialogHeader>
          {selectedEquipment && (
            <MaintenanceForm
              equipmentName={selectedEquipment.name}
              onSubmit={handleMaintenanceSubmit}
              onCancel={() => {
                setIsMaintenanceOpen(false);
                setSelectedEquipment(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Maintenance History Dialog */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Maintenance History</DialogTitle>
          </DialogHeader>
          {selectedEquipment && (
            <MaintenanceHistory
              equipmentId={selectedEquipment.id}
              equipmentName={selectedEquipment.name}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* GXP Delete Confirmation */}
      <GXPConfirmDialog
        open={isDeleteOpen}
        title="Delete Equipment"
        message={`Are you sure you want to delete "${selectedEquipment?.name}"? This action cannot be undone.`}
        actionType="delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteOpen(false);
          setSelectedEquipment(null);
        }}
      />
    </div>
  );
}
