import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface MaintenanceFormProps {
  equipmentName: string;
  onSubmit: (data: MaintenanceFormData) => Promise<void>;
  onCancel: () => void;
}

export interface MaintenanceFormData {
  maintenanceDate: string;
  notes: string | null;
  performedBy: string;
}

export function MaintenanceForm({
  equipmentName,
  onSubmit,
  onCancel,
}: MaintenanceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MaintenanceFormData>({
    defaultValues: {
      maintenanceDate: new Date().toISOString().split('T')[0],
      notes: '',
      performedBy: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Equipment</Label>
        <div className="p-2 bg-muted rounded-md text-sm">{equipmentName}</div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="maintenanceDate">Maintenance Date *</Label>
        <Input
          id="maintenanceDate"
          type="date"
          {...register('maintenanceDate', { required: 'Date is required' })}
        />
        {errors.maintenanceDate && (
          <p className="text-sm text-destructive">{errors.maintenanceDate.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="performedBy">Performed By *</Label>
        <Input
          id="performedBy"
          {...register('performedBy', { required: 'This field is required' })}
          placeholder="Enter technician name"
        />
        {errors.performedBy && (
          <p className="text-sm text-destructive">{errors.performedBy.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Enter maintenance notes (optional)"
          rows={4}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-900">
        <p className="font-medium">Note:</p>
        <p>After logging this maintenance, the equipment status will automatically be set to "Active" and the Last Cleaned Date will be updated.</p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Log Maintenance'}
        </Button>
      </div>
    </form>
  );
}
