import axios, { AxiosResponse } from 'axios';
import { InventoryItem } from './types';

const API_BASE_URL = 'https://mikedonovan.dev/canvas-inventory/php';

const getInventory = async (): Promise<InventoryItem[]> => {
  try {
    const response: AxiosResponse<string[]> = await axios({
      method: 'get',
      url: `${API_BASE_URL}/getinventory.php`,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data.map(row => JSON.parse(row) as InventoryItem);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
};

const addNewItem = async (newItem: InventoryItem): Promise<void> => {
  console.log('sending', newItem);
  try {
    await axios({
      method: 'post',
      url: `${API_BASE_URL}/addnewitem.php`,
      data: newItem,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Error adding new item:', error);
    throw error;
  }
};


export { addNewItem, getInventory };