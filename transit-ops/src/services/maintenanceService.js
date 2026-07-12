import { mockData } from '../data/mockData';
import { delay, getStorageData, setStorageData } from '../utils/storage';

const KEY = 'transitOps_maintenance';

export const maintenanceService = {
  getAll: async () => {
    await delay();
    return getStorageData(KEY, mockData.maintenance);
  },
  getById: async (id) => {
    await delay();
    const items = getStorageData(KEY, mockData.maintenance);
    return items.find(i => i.id === id);
  },
  create: async (item) => {
    await delay();
    const items = getStorageData(KEY, mockData.maintenance);
    const newItem = { ...item, id: `m-${Date.now()}` };
    setStorageData(KEY, [...items, newItem]);
    return newItem;
  },
  update: async (id, updates) => {
    await delay();
    let items = getStorageData(KEY, mockData.maintenance);
    items = items.map(item => item.id === id ? { ...item, ...updates } : item);
    setStorageData(KEY, items);
    return items.find(i => i.id === id);
  },
  delete: async (id) => {
    await delay();
    let items = getStorageData(KEY, mockData.maintenance);
    items = items.filter(item => item.id !== id);
    setStorageData(KEY, items);
    return true;
  }
};
