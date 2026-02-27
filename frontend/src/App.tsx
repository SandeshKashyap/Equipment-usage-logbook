import { Toaster } from 'sonner';
import { EquipmentList } from '@/components/equipment/EquipmentList';

function App() {
  return (
    <>
      <EquipmentList />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
