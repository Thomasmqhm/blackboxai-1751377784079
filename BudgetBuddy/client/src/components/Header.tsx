import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useGoogleSheets } from '../hooks/useGoogleSheets';

export function Header() {
  const { state, updateSyncStatus, loadData } = useApp();
  const { isConnected, isLoading, syncToSheets, syncFromSheets } = useGoogleSheets();

  const handleSync = async () => {
    if (!isConnected) return;

    updateSyncStatus(true);
    try {
      // First sync local data to sheets
      await syncToSheets(state);
      
      // Then sync data from sheets
      const sheetsData = await syncFromSheets();
      if (sheetsData) {
        loadData(sheetsData);
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      updateSyncStatus(false);
    }
  };

  const getSyncStatusColor = () => {
    if (state.syncInProgress || isLoading) return 'bg-yellow-400 animate-pulse';
    if (isConnected) return 'bg-green-400';
    return 'bg-gray-400';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 fixed top-0 left-0 right-0 z-40">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Dashboard Financier</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSync}
            disabled={!isConnected || state.syncInProgress || isLoading}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Synchroniser avec Google Sheets"
          >
            <RefreshCw 
              className={`w-5 h-5 ${(state.syncInProgress || isLoading) ? 'animate-spin' : ''}`} 
            />
          </button>
          <div 
            className={`w-2 h-2 rounded-full ${getSyncStatusColor()}`}
            title={
              state.syncInProgress || isLoading ? 'Synchronisation en cours...' :
              isConnected ? 'Connecté à Google Sheets' : 'Non connecté'
            }
          />
        </div>
      </div>
    </header>
  );
}
