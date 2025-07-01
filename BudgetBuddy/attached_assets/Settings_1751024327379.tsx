import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Database, LogOut } from 'lucide-react';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Paramètres</h2>

      {/* Profil */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
            <User size={20} />
            <span>Profil</span>
          </h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Thomas & Mélissa</div>
              <div className="text-sm text-gray-500">thomas.melissa@email.com</div>
            </div>
          </div>
          <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            Modifier le profil
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
            <Bell size={20} />
            <span>Notifications</span>
          </h3>
        </div>
        <div className="p-4 space-y-4">
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

      {/* Apparence */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
            <Palette size={20} />
            <span>Apparence</span>
          </h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Mode sombre</div>
              <div className="text-sm text-gray-500">Basculer vers le thème sombre</div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Gestion des comptes */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
            <Database size={20} />
            <span>Gestion des comptes</span>
          </h3>
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
            <span className="text-gray-700">Thomas</span>
            <span className="text-sm text-green-600">Actif</span>
          </div>
          <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
            <span className="text-gray-700">Mélissa</span>
            <span className="text-sm text-green-600">Actif</span>
          </div>
          <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
            <span className="text-gray-700">Compte Joint</span>
            <span className="text-sm text-green-600">Actif</span>
          </div>
        </div>
      </div>

      {/* Données */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
            <Database size={20} />
            <span>Données</span>
          </h3>
        </div>
        <div className="p-4 space-y-2">
          <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            Synchroniser avec Google Sheets
          </button>
          <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            Exporter les données
          </button>
          <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            Importer des données
          </button>
        </div>
      </div>

      {/* Sécurité */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
            <Shield size={20} />
            <span>Sécurité</span>
          </h3>
        </div>
        <div className="p-4 space-y-2">
          <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            Changer le mot de passe
          </button>
          <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            Authentification à deux facteurs
          </button>
        </div>
      </div>

      {/* Déconnexion */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <button className="w-full p-4 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2">
          <LogOut size={20} />
          <span>Se déconnecter</span>
        </button>
      </div>

      {/* Info version */}
      <div className="text-center text-sm text-gray-500 pt-4">
        Dashboard Financier v1.0.0
      </div>
    </div>
  );
};

export default Settings;