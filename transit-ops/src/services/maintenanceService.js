const API_URL = '/api/maintenance/';

export const maintenanceService = {
  getAll: async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch maintenance');
    return response.json();
  },
  getById: async (id) => {
    const response = await fetch(`${API_URL}${id}/`);
    if (!response.ok) throw new Error('Failed to fetch maintenance item');
    return response.json();
  },
  create: async (item) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to create maintenance item');
    return response.json();
  },
  update: async (id, updates) => {
    const response = await fetch(`${API_URL}${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update maintenance item');
    return response.json();
  },
  delete: async (id) => {
    const response = await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete maintenance item');
    return true;
  }
};
