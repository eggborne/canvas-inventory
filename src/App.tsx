import { useEffect, useState } from 'react'
import './App.css'
import { getInventory } from './fetch'
import DataDisplay from './DataDisplay'
import { InventoryItem } from './types';
import AddItemModal from './AddItemModal';

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchInv = async () => {
      const startTime = Date.now();
      const items = await getInventory();
      setInventoryData(items);
      console.log('items fetched in', (Date.now() - startTime), 'ms', items);
    }
    fetchInv();
    setLoaded(true);
    console.log('loaded?', loaded)    
  }, [])

  return (
    <>
      <header>Loren's canvases</header>
      <main>
        
        <button type='button' className={'add-button'} onClick={openModal}>Add new canvas</button>
        <DataDisplay data={inventoryData} />
        <AddItemModal isOpen={isModalOpen} onClose={closeModal} />
      </main>
      <footer>made with ❤️ by mike@mikedonovan.dev</footer>
    </>
  )
}

export default App
