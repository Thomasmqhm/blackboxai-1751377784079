import { useState, useEffect } from 'react';
import { GoogleSheetsService } from '../services/googleSheets';
import { AppState } from '../types';

export function useGoogleSheets() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sheetsService = GoogleSheetsService.getInstance();

  useEffect(() => {
    initializeService();
  }, []);

  const initializeService = async () => {
    try {
      setIsLoading(true);
      await sheetsService.initialize();
      setIsConnected(sheetsService.isConnected());
    } catch (err) {
      setError('Failed to initialize Google Sheets service');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const connect = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const success = await sheetsService.authenticate();
      setIsConnected(success);
      return success;
    } catch (err) {
      setError('Failed to connect to Google Sheets');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const success = await sheetsService.disconnect();
      setIsConnected(!success);
      return success;
    } catch (err) {
      setError('Failed to disconnect from Google Sheets');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const syncToSheets = async (data: AppState): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const results = await Promise.allSettled([
        sheetsService.syncAccounts(data.accounts),
        sheetsService.syncTransactions(data.transactions),
        sheetsService.syncTransfers(data.transfers),
        sheetsService.syncCredits(data.credits),
        sheetsService.syncSavings(data.savings)
      ]);

      const allSuccessful = results.every(result => 
        result.status === 'fulfilled' && result.value === true
      );

      if (!allSuccessful) {
        setError('Some data failed to sync');
      }

      return allSuccessful;
    } catch (err) {
      setError('Failed to sync data to Google Sheets');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const syncFromSheets = async (): Promise<Partial<AppState> | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const [accounts, transactions] = await Promise.all([
        sheetsService.readAccounts(),
        sheetsService.readTransactions()
      ]);

      return {
        accounts,
        transactions
      };
    } catch (err) {
      setError('Failed to sync data from Google Sheets');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
    syncToSheets,
    syncFromSheets
  };
}
