// A simple API utility to interact with the backend

const API_BASE_URL = '/api';

export const pingBackend = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ping/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error connecting to backend:", error);
    throw error;
  }
};
