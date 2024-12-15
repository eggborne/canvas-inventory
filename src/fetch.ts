import axios from 'axios';
import { InventoryItem, InventoryResponse, UserDBData } from './types';

const API_BASE_URL = 'https://visionary.tools/api/inventory';

// const userAuthorizations = {
//   inventory: {
//     databases: {
//       'loren-inventory': {
//         databaseMetadata: {
//           databaseName: 'loren-inventory',
//           displayName: 'Blank canvases',
//         },
//         privileges: {
//           read: true,
//           write: true,
//           delete: true,
//         },
//         role: 'admin',
//       }
//     }
//   }
// }

async function validateUser(uid: string, idToken: string): Promise<boolean> {
  try {
    const response = await axios.post('https://visionary.tools/api/auth/verify-token', {
      uid,
      idToken
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.valid) {
      console.log('User validated successfully:', response.data.uid);
      return true;
    } else {
      console.error('Invalid token:', response.data.error);
      return false;
    }
  } catch (error) {
    console.error('Error validating user:', error);
    throw error;
  }
}

async function getUser(uid: string, accessToken: string): Promise<UserDBData | undefined> {
  const isValidUser = await validateUser(uid, accessToken);

  if (!isValidUser) {
    throw new Error('Unauthorized: Invalid user token');
  }

  try {
    const response = await fetch(`https://visionary.tools/api/getuser.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ uid }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const userData = await response.json();
    if (userData.success) {
      return userData.user;
    }

  } catch (error) {
    console.error('Detailed error:', error);
    throw error;
  }
}

const getInventory = async (inventoryName: string, accessToken: string): Promise<InventoryItem[]> => {
  try {
    const response = await axios<InventoryResponse>({
      method: 'post',
      url: `${API_BASE_URL}/getinventory.php`,
      data: {
        inventoryName,
        accessToken
      },
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.data.success) {
      throw new Error('Failed to fetch inventory data');
    }
    
    return response.data.data;

  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Server error:', error.response.data);
      throw new Error(`Server error: ${error.response.data.message || 'Unknown error'}`);
    }

    console.error('Error fetching inventory:', error);
    throw new Error(
      error instanceof Error
        ? `Failed to fetch inventory: ${error.message}`
        : 'Failed to fetch inventory'
    );
  }
};

const addNewItem = async (newItem: InventoryItem): Promise<void> => {
  console.log('sending', newItem);
  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/addnewitem.php`,
      data: newItem,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = response.data;

    console.log(response.data)

    if (result.error) {
      throw new Error(result.error + (result.details ? `: ${result.details}` : ''));
    }

  } catch (error) {
    console.error('Error adding new item:', error);
    throw error;
  }
};


export { addNewItem, getInventory, getUser };