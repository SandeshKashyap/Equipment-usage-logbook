import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface GXPConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  actionType: 'delete' | 'status-change' | 'edit';
  onConfirm: (reason: string, performedBy: string) => void;
  onCancel: () => void;
}

export function GXPConfirmDialog({
  open,
  title,
  message,
  actionType,
  onConfirm,
  onCancel,
}: GXPConfirmDialogProps) {
  const [performedBy, setPerformedBy] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({ performedBy: '', reason: '' });

  const handleConfirm = () => {
    // Validate fields
    const newErrors = {
      performedBy: performedBy.trim().length < 2 ? 'Name is required (min 2 characters)' : '',
      reason: reason.trim().length < 10 ? 'Reason is required (min 10 characters)' : '',
    };

    setErrors(newErrors);

    if (!newErrors.performedBy && !newErrors.reason) {
      onConfirm(reason.trim(), performedBy.trim());
      // Reset form
      setPerformedBy('');
      setReason('');
      setErrors({ performedBy: '', reason: '' });
    }
  };

  const handleCancel = () => {
    setPerformedBy('');
    setReason('');
    setErrors({ performedBy: '', reason: '' });
    onCancel();
  };

  const getSeverityBorder = () => {
    switch (actionType) {
      case 'delete':
        return 'border-destructive';
      case 'status-change':
        return 'border-orange-500';
      case 'edit':
        return 'border-blue-500';
      default:
        return 'border-gray-500';
    }
  };

  const getSeverityBg = () => {
    switch (actionType) {
      case 'delete':
        return 'bg-red-50';
      case 'status-change':
        return 'bg-orange-50';
      case 'edit':
        return 'bg-blue-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* GXP Compliance Notice */}
          <div className={`p-4 rounded-md border-l-4 ${getSeverityBorder()} ${getSeverityBg()}`}>
            <p className="font-bold text-sm mb-1">GXP Compliance Required</p>
            <p className="text-sm">
              This action requires documentation per 21 CFR Part 11 and EU GMP Annex 11.
              All changes will be logged in the audit trail.
            </p>
          </div>

          {/* Action Message */}
          <p className="text-sm font-medium">{message}</p>

          {/* Performed By Field */}
          <div className="space-y-2">
            <Label htmlFor="performedBy">Performed By *</Label>
            <Input
              id="performedBy"
              value={performedBy}
              onChange={(e) => setPerformedBy(e.target.value)}
              placeholder="Enter your full name"
              autoFocus
            />
            {errors.performedBy && (
              <p className="text-sm text-destructive">{errors.performedBy}</p>
            )}
            {!errors.performedBy && (
              <p className="text-sm text-muted-foreground">Enter your full name</p>
            )}
          </div>

          {/* Reason for Change Field */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Change *</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter a detailed reason (minimum 10 characters)..."
              rows={4}
            />
            {errors.reason && (
              <p className="text-sm text-destructive">{errors.reason}</p>
            )}
            {!errors.reason && (
              <p className="text-sm text-muted-foreground">
                Provide a detailed justification for this {actionType === 'delete' ? 'deletion' : 'change'}
              </p>
            )}
            {/* Character Count */}
            <p className={`text-sm text-right ${reason.length >= 10 ? 'text-green-600' : 'text-muted-foreground'}`}>
              {reason.length} / 10 characters minimum
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant={actionType === 'delete' ? 'destructive' : 'default'}
            onClick={handleConfirm}
          >
            Confirm Action
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
