import { apiClient } from './client';
import { INITIAL_INVENTORY } from '../data/mockData';

const STORAGE_KEY = 'labtrack_inventory_v4';

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

  updateStockStatus: async (itemId, status, custodyHolder = null, historyLog = null) => {
    return apiClient.simulatedFetch('UPDATE_STOCK_STATUS', () => {
      const items = getStoredInventory();
      const idx = items.findIndex((i) => i.id === itemId || i.assetTag === itemId);
      if (idx !== -1) {
        const item = items[idx];
        item.stockStatus = status;
        if (custodyHolder !== undefined) {
          item.custodyHolder = custodyHolder;
        }

        const currentAvail = typeof item.availableStock === 'number' ? item.availableStock : 0;
        const total = typeof item.totalStock === 'number' ? item.totalStock : 1;

        if (status === 'Available') {
          // Hardware returned and reset by Lab Assistant: increment available stock up to totalStock
          item.availableStock = Math.min(total, currentAvail + 1);
        } else if (status === 'Allocated') {
          item.availableStock = Math.max(0, currentAvail - 1);
        } else if (status === 'Maintenance') {
          // Damaged or quarantined hardware: decrement available stock
          item.availableStock = Math.max(0, currentAvail - 1);
        }

        // Record custody provenance if historyLog is provided
        if (historyLog) {
          if (!Array.isArray(item.custodyHistory)) {
            item.custodyHistory = [];
          }
          item.custodyHistory.unshift({
            id: `LOG-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            event: historyLog.event || (status === 'Available' ? 'Restocked to Inventory' : 'Status Modified'),
            actor: historyLog.actor || 'Ramesh Patil (Lab Assistant)',
            prn: historyLog.prn || 'Counter Intake',
            condition: historyLog.condition || 'Operational',
            notes: historyLog.notes || `Hardware reset & restocked to ${item.coordinates || 'Storage Bay'}`,
          });
        }

        saveStoredInventory(items);
        return item;
      }
      return null;
    });
  },

  resetDefault: () => {
    localStorage.removeItem(STORAGE_KEY);
    return INITIAL_INVENTORY;
  }
};
