import { delay, getStorageData, setStorageData } from '../utils/storage';

const KEY_USER = 'transitOps_auth_user';
const KEY_ACCOUNTS = 'transitOps_accounts';

export const authService = {
  register: async (name, email, password) => {
    await delay();
    const accounts = getStorageData(KEY_ACCOUNTS, []);
    
    if (accounts.find(acc => acc.email === email)) {
      throw new Error('An account with this email already exists.');
    }
    
    const newUser = { id: Date.now(), name, email, password, role: 'admin' };
    setStorageData(KEY_ACCOUNTS, [...accounts, newUser]);
    return true;
  },

  login: async (email, password) => {
    await delay();
    const accounts = getStorageData(KEY_ACCOUNTS, []);
    const account = accounts.find(acc => acc.email === email && acc.password === password);
    
    if (!account) {
      throw new Error('Invalid email or password.');
    }
    
    const userSession = { id: account.id, email: account.email, name: account.name, role: account.role };
    setStorageData(KEY_USER, userSession);
    return userSession;
  },

  logout: async () => {
    await delay();
    localStorage.removeItem(KEY_USER);
    return true;
  },

  getCurrentUser: async () => {
    await delay();
    const data = localStorage.getItem(KEY_USER);
    return data ? JSON.parse(data) : null;
  }
};
