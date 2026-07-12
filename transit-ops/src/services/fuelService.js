import { mockData } from '../data/mockData';
import { delay, getStorageData, setStorageData } from '../utils/storage';

const KEY = 'transitOps_fuel';

export const fuelService = {
  getAll: async () => {
    await delay();
    return getStorageData(KEY, mockData.fuel);
  },
  getById: async (id) => {
    await delay();
    const items = getStorageData(KEY, mockData.fuel);
    return items.find(i => i.id === id);
  },
  create: async (item) => {
    await delay();
    const items = getStorageData(KEY, mockData.fuel);
    const newItem = { ...item, id: `f-${Date.now()}` };
    setStorageData(KEY, [...items, newItem]);
    return newItem;
  },
  update: async (id, updates) => {
    await delay();
    let items = getStorageData(KEY, mockData.fuel);
    items = items.map(item => item.id === id ? { ...item, ...updates } : item);
    setStorageData(KEY, items);
    return items.find(i => i.id === id);
  },
  delete: async (id) => {
    await delay();
    let items = getStorageData(KEY, mockData.fuel);
    items = items.filter(item => item.id !== id);
    setStorageData(KEY, items);
    return true;
  }
};
