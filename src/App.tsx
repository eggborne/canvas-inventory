import { useEffect, useState } from 'react'
import './App.css'
import { getInventory } from './fetch'
import DataDisplay from './DataDisplay'
import { InventoryItem } from './types';
import AddItemModal from './AddItemModal';
import ThemeToggle from './components/ThemeToggle';

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);


  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchInv = async () => {
      const startTime = Date.now();
      const items = await getInventory();
      setInventoryData(items);
      console.warn(items.length, 'items fetched in', (Date.now() - startTime), 'ms');
    }
    const darkMode = localStorage.getItem('darkMode');
    console.log('dark?', darkMode)
    if (darkMode !== null) {
      toggleDarkMode(JSON.parse(darkMode));
    } else {
      toggleDarkMode(isDarkMode);
    }
    fetchInv();
    requestAnimationFrame(() => {
      setLoaded(true);
    })
    console.log('loaded?', loaded)
  }, [])

  const toggleDarkMode = (newDarkState: boolean) => {
    setIsDarkMode(newDarkState);
    if (newDarkState) {
      document.documentElement.style.setProperty('--background-color', '#242424');
      document.documentElement.style.setProperty('--text-color', '#ffffffde');
      document.documentElement.style.setProperty('--accent-color', '#444');
    } else {
      document.documentElement.style.setProperty('--background-color', '#efefef');
      document.documentElement.style.setProperty('--text-color', '#18181b');
      document.documentElement.style.setProperty('--accent-color', '#ccc');
    }
    localStorage.setItem('darkMode', JSON.stringify(newDarkState));
  }

  return (
    <>
      <header>Blank canvases as of 12/09/2024
        {loaded && <ThemeToggle isDarkMode={isDarkMode} onToggle={() => toggleDarkMode(!isDarkMode)} />}
      </header>
      <main style={{ opacity: loaded ? 1 : 0 }}>

        <button type='button' className={'add-button'} onClick={openModal}>Add new canvas</button>
        <DataDisplay data={inventoryData} />
        <AddItemModal isOpen={isModalOpen} onClose={closeModal} />
      </main>
      <footer>made with ❤️ by mike@mikedonovan.dev</footer>
    </>
  )
}

export default App
