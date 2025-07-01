import React, { useState } from 'react';
import { Database, Bell, Palette, Sheet, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useGoogleSheets } from '../hooks/useGoogleSheets';
import { ConfirmDialog } from '../components/ui/confirm-dialog';
import { LocalStorage } from '../services/storage';

export function Settings() {
  const { state, clearAllData, updateConnectionStatus, updateSyncStatus, loadData } = useApp();
  const { isConnected, isLoading, error, connect, disconnect, syncToSheets, syncFromSheets } = useGoogleSheets();
  const [notifications, setNotifications] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleConnect = async () => {
    const success = await connect();
    updateConnectionStatus(success);
  };

  const handleDisconnect = async () => {
    const success = await disconnect();
    updateConnectionStatus(!success);
  };

  const handleSync = async () => {
    updateSyncStatus(true);
    try {
      await syncToSheets(state);
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

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result as string;
            const success = LocalStorage.import(data);
            if (success) {
              const importedData = LocalStorage.load();
              loadData(importedData);
            }
          } catch (error) {
            console.error('Import failed:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearData = () => {
    clearAllData();
    setShowClearConfirm(false);
  };

  const handleResetApp = () => {
    clearAllData();
    updateConnectionStatus(false);
    setShowResetConfirm(false);
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
        <div className="p-4 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <p className="font-medium text-red-700">Configuration Google Cloud requise</p>
              </div>
              <div className="space-y-3 text-sm text-red-700">
                <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                  <p className="font-medium text-orange-800">Erreur d'authentification détectée</p>
                  <p className="text-orange-700 mt-1">L'ID client OAuth semble invalide ou mal configuré.</p>
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium">Configuration complète requise :</p>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">1. Créer un projet Google Cloud :</p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Allez sur <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google Cloud Console</a></li>
                        <li>Créez un nouveau projet ou sélectionnez un projet existant</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium">2. Activer l'API Google Sheets :</p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>"API et services" → "Bibliothèque"</li>
                        <li>Recherchez "Google Sheets API" et activez-la</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium">3. Créer les identifiants :</p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>"API et services" → "Identifiants"</li>
                        <li>Cliquez "Créer des identifiants" → "Clé API"</li>
                        <li>Cliquez "Créer des identifiants" → "ID client OAuth"</li>
                        <li>Type d'application : "Application Web"</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium">4. Configurer l'ID client OAuth :</p>
                      <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-2">
                        <p className="text-blue-800 font-medium mb-2">Configuration exacte pour votre OAuth client :</p>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="font-medium text-blue-700">Nom de l'application :</p>
                            <code className="bg-white px-2 py-1 rounded border">Dashboard Financier</code>
                          </div>
                          <div>
                            <p className="font-medium text-blue-700">Origines JavaScript autorisées :</p>
                            <code className="bg-white px-2 py-1 rounded border text-xs break-all block">
                              {window.location.origin}
                            </code>
                          </div>
                          <div>
                            <p className="font-medium text-blue-700">URI de redirection autorisés :</p>
                            <code className="bg-white px-2 py-1 rounded border text-xs break-all block">
                              {window.location.origin}
                            </code>
                          </div>
                        </div>
                      </div>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Copiez exactement les valeurs ci-dessus</li>
                        <li>Collez l'ID client généré dans les secrets Replit</li>
                        <li>Sauvegardez et testez la connexion</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium">5. Configurer l'écran de consentement OAuth :</p>
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-2">
                        <p className="font-medium text-yellow-800">⚠️ Étape critique pour résoudre l'erreur 403 :</p>
                        <p className="text-yellow-700 text-sm mt-1">Votre app est en mode test et vous devez vous ajouter comme utilisateur autorisé.</p>
                      </div>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>"API et services" → "Écran de consentement OAuth"</li>
                        <li>Type d'utilisateur : Externe (pour utilisation personnelle)</li>
                        <li>Remplissez le nom de l'application : "Dashboard Financier"</li>
                        <li>Ajoutez votre adresse email dans "Adresse email d'assistance utilisateur"</li>
                        <li><strong>Important :</strong> Dans "Utilisateurs de test", ajoutez votre adresse email Gmail</li>
                        <li>Sauvegardez et publiez en mode test</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className={`flex items-center justify-between p-3 border rounded-lg ${
            isConnected ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div>
              <div className={`font-medium ${isConnected ? 'text-green-800' : 'text-yellow-800'}`}>
                {isConnected ? 'Connecté' : 'Non connecté'}
              </div>
              <div className={`text-sm ${isConnected ? 'text-green-700' : 'text-yellow-700'}`}>
                {isConnected 
                  ? 'Synchronisation automatique disponible' 
                  : 'Connectez votre Google Sheets pour synchroniser vos données'
                }
              </div>
            </div>
            <button
              onClick={isConnected ? handleDisconnect : handleConnect}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                isConnected 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isLoading ? 'Chargement...' : isConnected ? 'Déconnecter' : 'Connecter'}
            </button>
          </div>

          {isConnected && (
            <div className="space-y-2">
              <button
                onClick={handleSync}
                disabled={state.syncInProgress}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
              >
                {state.syncInProgress ? 'Synchronisation en cours...' : 'Synchroniser maintenant'}
              </button>
              <button
                onClick={handleSync}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Exporter vers Sheets
              </button>
              <button
                onClick={handleSync}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Importer depuis Sheets
              </button>
            </div>
          )}
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
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Push notifications</div>
              <div className="text-sm text-gray-500">Recevoir des alertes sur les dépenses</div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Gestion des données</span>
          </h3>
        </div>
        <div className="p-4 space-y-2">
          {state.lastSync && (
            <div className="text-sm text-gray-600 mb-4">
              Dernière synchronisation: {new Date(state.lastSync).toLocaleString('fr-FR')}
            </div>
          )}
          <button
            onClick={handleExport}
            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Exporter les données locales
          </button>
          <button
            onClick={handleImport}
            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Importer des données
          </button>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Effacer toutes les données
          </button>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Réinitialiser l'application
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Statistiques</h3>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-900">{state.accounts.length}</div>
            <div className="text-gray-500">Comptes</div>
          </div>
          <div>
            <div className="font-medium text-gray-900">{state.transactions.length}</div>
            <div className="text-gray-500">Transactions</div>
          </div>
          <div>
            <div className="font-medium text-gray-900">{state.transfers.length}</div>
            <div className="text-gray-500">Virements</div>
          </div>
          <div>
            <div className="font-medium text-gray-900">{state.savings.length + state.credits.length}</div>
            <div className="text-gray-500">Objectifs</div>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 pt-4">
        Dashboard Financier v2.0.0
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        title="Effacer toutes les données"
        message="Êtes-vous sûr de vouloir effacer toutes les données ? Cette action est irréversible et supprimera tous vos comptes, transactions, virements, crédits et objectifs d'épargne."
        onConfirm={handleClearData}
        onCancel={() => setShowClearConfirm(false)}
        confirmText="Effacer tout"
        cancelText="Annuler"
        variant="danger"
      />

      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Réinitialiser l'application"
        message="Êtes-vous sûr de vouloir réinitialiser complètement l'application ? Cette action effacera toutes les données et déconnectera Google Sheets."
        onConfirm={handleResetApp}
        onCancel={() => setShowResetConfirm(false)}
        confirmText="Réinitialiser"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
}
