import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
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

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

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

  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      const matchesSearch = searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.typeName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === '' || item.status === statusFilter;
      const matchesType = typeFilter === '' || item.typeName === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [equipment, searchQuery, statusFilter, typeFilter]);

  const hasActiveFilters = searchQuery !== '' || statusFilter !== '' || typeFilter !== '';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setTypeFilter('');
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
        return 'bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/40 dark:to-emerald-800/30 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-700 ring-1 ring-emerald-600/20 dark:ring-emerald-400/30 shadow-sm shadow-emerald-200/50 dark:shadow-emerald-900/30';
      case 'Under Maintenance':
        return 'bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/40 dark:to-amber-800/30 text-amber-700 dark:text-amber-300 border-2 border-amber-300 dark:border-amber-700 ring-1 ring-amber-600/20 dark:ring-amber-400/30 shadow-sm shadow-amber-200/50 dark:shadow-amber-900/30';
      default:
        return 'bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-600 ring-1 ring-slate-600/20 dark:ring-slate-400/30 shadow-sm';
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
          className="flex items-center justify-between mb-8 pb-6 border-b-2 border-slate-200 dark:border-slate-700"
        >
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 title-primary">
              Equipment Management System
            </h1>
            <p className="text-lg font-medium flex items-center gap-2 text-primary">
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Manage and track your pharmaceutical equipment inventory
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
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
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
        >
          <div className="relative flex-1 w-full sm:max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <Input
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </Select>
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full sm:w-48"
          >
            <option value="">All Types</option>
            {equipmentTypes.map((type) => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
          </Select>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="whitespace-nowrap text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Clear filters
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Equipment Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl shadow-slate-300/50 dark:shadow-slate-950/60 bg-white dark:bg-slate-900 overflow-hidden"
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
              {filteredEquipment.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-muted-foreground"
                    >
                      {hasActiveFilters ? (
                        <>
                          <p className="text-lg font-medium">No matching equipment</p>
                          <p className="text-sm mt-2">Try adjusting your search or filters</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearFilters}
                            className="mt-4"
                          >
                            Clear filters
                          </Button>
                        </>
                      ) : (
                        <>
                          <p className="text-lg font-medium">No equipment found</p>
                          <p className="text-sm mt-2">Click "Add Equipment" to get started</p>
                        </>
                      )}
                    </motion.div>
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredEquipment.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-slate-200 dark:border-slate-700 transition-colors bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/50"
                    >
                      <TableCell className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">{item.typeName}</TableCell>
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
                        <span className={needsCleaning(item.lastCleanedDate) ? 'text-orange-600 dark:text-orange-400 font-bold' : 'text-slate-600 dark:text-slate-400 font-medium'}>
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
                              className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 hover:text-blue-700 dark:hover:text-blue-400 hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:shadow-md hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30"
                            >
                              Maintenance
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleHistory(item)}
                              className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 dark:hover:from-purple-900/30 dark:hover:to-purple-800/30 hover:text-purple-700 dark:hover:text-purple-400 hover:border-purple-400 dark:hover:border-purple-600 transition-all hover:shadow-md hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30"
                            >
                              History
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(item)}
                              className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-700 dark:hover:to-slate-600 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500 transition-all hover:shadow-md"
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
        </motion.div>
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
