const API_URL = '/api/drivers/';

export const driverService = {
  getAll: async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch drivers');
    return response.json();
  },
  getById: async (id) => {
    const response = await fetch(`${API_URL}${id}/`);
    if (!response.ok) throw new Error('Failed to fetch driver');
    return response.json();
  },
  create: async (item) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to create driver');
    return response.json();
  },
  update: async (id, updates) => {
    const response = await fetch(`${API_URL}${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update driver');
    return response.json();
  },
  delete: async (id) => {
    const response = await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete driver');
    return true;
  }
};
