import type { TOTPAccount, AppSettings } from '../types';
import { storage } from './browserApi';

const STORAGE_KEY = 'safepass_accounts';
const SETTINGS_KEY = 'safepass_settings';

export const saveAccounts = async (accounts: TOTPAccount[]): Promise<void> => {
  try {
    await storage.local.set({ [STORAGE_KEY]: accounts });
  } catch (error) {
    console.error('Error saving accounts:', error);
  }
};

export const loadAccounts = async (): Promise<TOTPAccount[]> => {
  try {
    const result = await storage.local.get([STORAGE_KEY]);
    return result[STORAGE_KEY] || [];
  } catch (error) {
    console.error('Error loading accounts:', error);
    return [];
  }
};

export const addAccount = async (account: Omit<TOTPAccount, 'id' | 'createdAt'>): Promise<void> => {
  try {
    const accounts = await loadAccounts();
    const newAccount: TOTPAccount = {
      ...account,
      id: generateId(),
      createdAt: Date.now()
    };
    accounts.push(newAccount);
    await saveAccounts(accounts);
  } catch (error) {
    console.error('Error adding account:', error);
  }
};

export const deleteAccount = async (id: string): Promise<void> => {
  try {
    const accounts = await loadAccounts();
    const filteredAccounts = accounts.filter(account => account.id !== id);
    await saveAccounts(filteredAccounts);
  } catch (error) {
    console.error('Error deleting account:', error);
  }
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await storage.local.set({ [SETTINGS_KEY]: settings });
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const loadSettings = async (): Promise<AppSettings> => {
  try {
    const result = await storage.local.get([SETTINGS_KEY]);
    return result[SETTINGS_KEY] || { showSeconds: true }; // 默认显示秒数
  } catch (error) {
    console.error('Error loading settings:', error);
    return { showSeconds: true };
  }
};

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
}; 