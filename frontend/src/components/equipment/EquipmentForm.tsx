import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import type { Equipment, EquipmentType } from '@/types';

interface EquipmentFormProps {
  initialData?: Equipment;
  equipmentTypes: EquipmentType[];
  onSubmit: (data: EquipmentFormData) => Promise<void>;
  onCancel: () => void;
}

export interface EquipmentFormData {
  name: string;
  typeId: number;
  status: 'Active' | 'Inactive' | 'Under Maintenance';
  lastCleanedDate: string;
}

export function EquipmentForm({
  initialData,
  equipmentTypes,
  onSubmit,
  onCancel,
}: EquipmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EquipmentFormData>({
    defaultValues: initialData
      ? {
          name: initialData.name,
          typeId: initialData.typeId,
          status: initialData.status,
          lastCleanedDate: initialData.lastCleanedDate || '',
        }
      : {
          name: '',
          typeId: equipmentTypes[0]?.id || 0,
          status: 'Inactive',
          lastCleanedDate: '',
        },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        typeId: initialData.typeId,
        status: initialData.status,
        lastCleanedDate: initialData.lastCleanedDate || '',
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Equipment Name *</Label>
        <Input
          id="name"
          {...register('name', { required: 'Name is required' })}
          placeholder="Enter equipment name"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="typeId">Type *</Label>
        <Select
          id="typeId"
          {...register('typeId', {
            required: 'Type is required',
            valueAsNumber: true,
          })}
        >
          {equipmentTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </Select>
        {errors.typeId && (
          <p className="text-sm text-destructive">{errors.typeId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select id="status" {...register('status', { required: 'Status is required' })}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Under Maintenance">Under Maintenance</option>
        </Select>
        {errors.status && (
          <p className="text-sm text-destructive">{errors.status.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastCleanedDate">Last Cleaned Date *</Label>
        <Input
          id="lastCleanedDate"
          type="date"
          {...register('lastCleanedDate', { required: 'Last cleaned date is required' })}
        />
        {errors.lastCleanedDate && (
          <p className="text-sm text-destructive">{errors.lastCleanedDate.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Equipment' : 'Create Equipment'}
        </Button>
      </div>
    </form>
  );
}
