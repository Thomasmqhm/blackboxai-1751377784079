import { AppState } from '../types';

const STORAGE_KEY = 'financialDashboard';

export class LocalStorage {
  static save(data: Partial<AppState>): void {
    try {
      const existing = this.load();
      const updated = { ...existing, ...data, lastSync: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
    }
  }

  static load(): AppState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        return {
          accounts: data.accounts || [],
          transactions: data.transactions || [],
          transfers: data.transfers || [],
          credits: data.credits || [],
          savings: data.savings || [],
          isConnectedToSheets: data.isConnectedToSheets || false,
          syncInProgress: false,
          lastSync: data.lastSync
        };
      }
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
    }

    return {
      accounts: [],
      transactions: [],
      transfers: [],
      credits: [],
      savings: [],
      isConnectedToSheets: false,
      syncInProgress: false
    };
  }

  static clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  static export(): string {
    const data = this.load();
    return JSON.stringify(data, null, 2);
  }

  static import(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      this.save(data);
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}
