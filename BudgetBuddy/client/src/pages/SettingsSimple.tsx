import React, { useState } from 'react';
import { Database, Bell, Palette, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConfirmDialog } from '../components/ui/confirm-dialog';
import { LocalStorage } from '../services/storage';

export function Settings() {
  const { state, clearAllData } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExport = () => {
    const data = LocalStorage.export();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        const success = LocalStorage.import(jsonData);
        if (success) {
          window.location.reload();
        } else {
          alert('Erreur lors de l\'importation des données');
        }
      } catch (error) {
        alert('Fichier invalide');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    clearAllData();
    setShowClearConfirm(false);
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Paramètres</h2>

      {/* Comptes configurés */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Comptes Configurés</span>
          </h3>
        </div>
        <div className="p-4">
          <div className="space-y-2 mb-4">
            {state.accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="font-medium">{account.name}</span>
                <span className="text-sm text-gray-600">{account.type}</span>
              </div>
            ))}
          </div>
          
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              Vos comptes sont configurés : Thomas, Mélissa et Compte Joint. 
              Le Livret A de Thomas est disponible dans la section Épargne.
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </h3>
        </div>
        <div className="p-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">Recevoir des notifications de rappel</span>
          </label>
        </div>
      </div>

      {/* Sauvegarde et données */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Gestion des données</span>
          </h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <button
              onClick={handleExport}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Exporter les données (JSON)
            </button>
            
            <label className="block">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <span className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer block">
                Importer des données
              </span>
            </label>
          </div>

          <div className="border-t pt-4">
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full px-4 py-2 text-left text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              Effacer toutes les données
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showClearConfirm}
        title="Effacer toutes les données"
        message="Êtes-vous sûr de vouloir effacer toutes les données ? Cette action est irréversible."
        onConfirm={handleClearData}
        onCancel={() => setShowClearConfirm(false)}
        confirmText="Effacer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
}