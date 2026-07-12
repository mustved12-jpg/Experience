export const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const getStorageData = (key, defaultData) => {
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  }
  localStorage.setItem(key, JSON.stringify(defaultData));
  return defaultData;
};

export const setStorageData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};
