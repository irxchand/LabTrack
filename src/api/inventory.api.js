import { apiClient } from './client';
import { INITIAL_INVENTORY } from '../data/mockData';

const STORAGE_KEY = 'labtrack_inventory_db';

function getStoredInventory() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INVENTORY));
    return INITIAL_INVENTORY;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_INVENTORY;
  }
}

function saveStoredInventory(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const inventoryApi = {
  getAll: async () => {
    return apiClient.simulatedFetch('GET_ALL_INVENTORY', () => {
      return getStoredInventory();
    });
  },

  getAssets: async () => {
    return apiClient.simulatedFetch('GET_ASSETS', () => {
      return getStoredInventory().filter((item) => item.classification === 'Asset');
    });
  },

  getComponents: async () => {
    return apiClient.simulatedFetch('GET_COMPONENTS', () => {
      return getStoredInventory().filter((item) => item.classification === 'Component');
    });
  },

  getConsumables: async () => {
    return apiClient.simulatedFetch('GET_CONSUMABLES', () => {
      return getStoredInventory().filter((item) => item.classification === 'Consumable');
    });
  },

  getById: async (itemId) => {
    return apiClient.simulatedFetch('GET_ITEM_DOSSIER', () => {
      const items = getStoredInventory();
      return items.find((i) => i.id === itemId || i.assetTag === itemId) || null;
    });
  },

  addItem: async (newItem) => {
    return apiClient.simulatedFetch('ADD_INVENTORY_ITEM', () => {
      const items = getStoredInventory();
      const updated = [newItem, ...items];
      saveStoredInventory(updated);
      return newItem;
    });
  },

  updateStockStatus: async (itemId, status, custodyHolder = null) => {
    return apiClient.simulatedFetch('UPDATE_STOCK_STATUS', () => {
      const items = getStoredInventory();
      const idx = items.findIndex((i) => i.id === itemId || i.assetTag === itemId);
      if (idx !== -1) {
        items[idx].stockStatus = status;
        if (custodyHolder !== undefined) {
          items[idx].custodyHolder = custodyHolder;
        }
        if (status === 'Available') {
          items[idx].availableStock = Math.max(1, items[idx].availableStock);
        } else if (status === 'Allocated') {
          items[idx].availableStock = Math.max(0, items[idx].availableStock - 1);
        }
        saveStoredInventory(items);
        return items[idx];
      }
      return null;
    });
  },

  resetDefault: () => {
    localStorage.removeItem(STORAGE_KEY);
    return INITIAL_INVENTORY;
  }
};
