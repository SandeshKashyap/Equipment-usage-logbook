import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { maintenanceApi } from '@/api/maintenance';
import type { MaintenanceLog } from '@/types';

interface MaintenanceHistoryProps {
  equipmentId: number;
  equipmentName: string;
}

export function MaintenanceHistory({ equipmentId, equipmentName }: MaintenanceHistoryProps) {
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [equipmentId]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await maintenanceApi.getHistory(equipmentId);
      setLogs(data);
    } catch (error) {
      console.error('Failed to load maintenance history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="p-4 text-center">Loading history...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="p-3 bg-muted rounded-md">
        <p className="text-sm font-medium">Equipment: {equipmentName}</p>
      </div>

      {logs.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          No maintenance history found for this equipment.
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-sm text-muted-foreground">
                    {formatDate(log.maintenanceDate)}
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Performed by:</span> {log.performedBy}
                  </p>
                </div>
              </div>
              {log.notes && (
                <div className="mt-2 text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Notes:</p>
                  <p className="whitespace-pre-wrap">{log.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
