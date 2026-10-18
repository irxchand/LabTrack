import { apiClient } from './client';
import { INITIAL_INVENTORY, INITIAL_ASSETS } from '../data/mockData';

const CURRENT_SCHEMA_VERSION = 'v9_canonical_components_2026';
const STORAGE_KEY = 'labtrack_inventory_v9';

function getStoredInventory() {
  try {
    const version = localStorage.getItem('labtrack_schema_version');
    if (version !== CURRENT_SCHEMA_VERSION) {
      localStorage.setItem('labtrack_schema_version', CURRENT_SCHEMA_VERSION);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INVENTORY));
      return INITIAL_INVENTORY;
    }

    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INVENTORY));
      return INITIAL_INVENTORY;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_INVENTORY;
  }
}

function saveStoredInventory(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save inventory to storage:', e);
  }
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
      let match = items.find((i) => i.id === itemId || i.assetTag === itemId);
      if (!match && INITIAL_ASSETS) {
        const assetMatch = INITIAL_ASSETS.find((a) => a.barcode === itemId || a.assetTag === itemId);
        if (assetMatch) {
          match = items.find((i) => i.id === assetMatch.itemId);
        }
      }
      return match || null;
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
      let idx = items.findIndex((i) => i.id === itemId || i.assetTag === itemId);
      if (idx === -1 && INITIAL_ASSETS) {
        const assetMatch = INITIAL_ASSETS.find((a) => a.barcode === itemId || a.assetTag === itemId);
        if (assetMatch) {
          idx = items.findIndex((i) => i.id === assetMatch.itemId);
        }
      }

      if (idx !== -1) {
        const item = items[idx];
        item.stockStatus = status;
        if (custodyHolder !== undefined) {
          item.custodyHolder = custodyHolder;
        }

        if (status === 'Maintenance') {
          // Decrement good available count, increment bad count, preserving total = good + bad
          item.availableStock = Math.max(0, (item.availableStock ?? 1) - 1);
          item.badStock = (item.badStock ?? 0) + 1;
          item.totalStock = (item.availableStock + item.badStock);

          if (item.labBreakdown && item.labBreakdown.length > 0) {
            const primary = item.labBreakdown[0];
            primary.good = Math.max(0, (primary.good ?? 1) - 1);
            primary.bad = (primary.bad ?? 0) + 1;
            primary.total = primary.good + primary.bad;
          }
        } else if (status === 'Available') {
          item.availableStock = (item.availableStock ?? 0) + 1;
          if (item.badStock && item.badStock > 0) {
            item.badStock = Math.max(0, item.badStock - 1);
          }
          item.totalStock = Math.max(item.totalStock ?? 1, item.availableStock + (item.badStock ?? 0));

          if (item.labBreakdown && item.labBreakdown.length > 0) {
            const primary = item.labBreakdown[0];
            primary.good = (primary.good ?? 0) + 1;
            primary.total = primary.good + (primary.bad ?? 0);
          }
        } else if (status === 'Allocated') {
          item.availableStock = Math.max(0, (item.availableStock ?? 1) - 1);
        }

        saveStoredInventory(items);
        return item;
      }
      return null;
    });
  },

  resetDefault: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INVENTORY));
    } catch (e) {
      console.error(e);
    }
    return INITIAL_INVENTORY;
  }
};
