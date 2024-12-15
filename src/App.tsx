import { useEffect, useState } from 'react'
import './App.css'
import { FirebaseUserData, InventoryItem, UserDBData, VisionaryUser } from './types';
import { getInventory, getUser } from './fetch'
import DataDisplay from './DataDisplay'
import AddItemModal from './AddItemModal';
import ThemeToggle from './components/ThemeToggle';
import { auth } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [user, setUser] = useState<VisionaryUser | null>(null);

  const fetchInv = async (dbName: string, accessToken: string) => {
    const startTime = Date.now();
    const items = await getInventory(dbName, accessToken);
    setInventoryData(items);
    console.warn(items.length, 'items fetched in', (Date.now() - startTime), 'ms');
  }

  useEffect(() => {
    const getUserData = async (firebaseUser: User): Promise<UserDBData | null> => {
      const invUser: FirebaseUserData = {
        accessToken: await firebaseUser.getIdToken(),
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoUrl: firebaseUser.photoURL,
        uid: firebaseUser.uid,
      };
      const userDBData = await getUser(invUser.uid, invUser.accessToken);
      setUser({
        visionaryData: invUser,
        inventoryData: {
          databases: userDBData?.authorizations?.inventory?.databases || [],
        },
      });
      return userDBData || null;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        getUserData(firebaseUser);
      } else {
        window.location.href = 'https://visionary.tools/';
      }
      setLoaded(true);
    });

    const darkMode = localStorage.getItem('darkMode');
    console.log('dark?', darkMode)
    if (darkMode !== null) {
      toggleDarkMode(JSON.parse(darkMode));
    } else {
      toggleDarkMode(isDarkMode);
    }

    requestAnimationFrame(() => {
      setLoaded(true);
    })
    console.log('loaded?', loaded);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const dbNameList = Object.keys(user.inventoryData.databases);

      if (dbNameList.length > 0) {
        console.log('db names:', dbNameList);
        fetchInv(dbNameList[0], user.visionaryData.accessToken);
      }
    }
  }, [user])

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
      <header>
        {loaded &&
          <>
          {user &&
            <div className='user-info'>
              <img src={user.visionaryData.photoUrl || ''} alt={user.visionaryData.displayName || ''} />
              <div>{user.visionaryData.displayName}</div>
            </div>
          }
            <ThemeToggle isDarkMode={isDarkMode} onToggle={() => toggleDarkMode(!isDarkMode)} />
          </>
        }
      </header>
      <main style={{ opacity: loaded ? 1 : 0 }}>
        {(user && inventoryData.length > 0) ?
          <>            
            <DataDisplay currentInventory={user.inventoryData.databases['loren-inventory']} data={inventoryData} user={user} openModal={openModal} />
          </>
          :
          <div>loading...</div>
        }
        <AddItemModal isOpen={isModalOpen} onClose={closeModal} />
      </main>
      <footer>made with ❤️ by mike@mikedonovan.dev</footer>
    </>
  )
}

export default App
