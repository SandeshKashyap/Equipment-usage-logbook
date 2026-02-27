import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { EquipmentList } from '@/components/equipment/EquipmentList';
import { ThemeProvider } from '@/components/theme-provider';

function App() {
  // Force light mode on first load
  useEffect(() => {
    const stored = localStorage.getItem('equipment-logbook-theme');
    if (!stored) {
      localStorage.setItem('equipment-logbook-theme', 'light');
    }
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="equipment-logbook-theme">
      <EquipmentList />
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}

export default App;
