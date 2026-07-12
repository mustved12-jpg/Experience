const API_URL = '/api/trips/';

export const tripService = {
  getAll: async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch trips');
    return response.json();
  },
  getById: async (id) => {
    const response = await fetch(`${API_URL}${id}/`);
    if (!response.ok) throw new Error('Failed to fetch trip');
    return response.json();
  },
  create: async (item) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to create trip');
    return response.json();
  },
  update: async (id, updates) => {
    const response = await fetch(`${API_URL}${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update trip');
    return response.json();
  },
  delete: async (id) => {
    const response = await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete trip');
    return true;
  }
};
