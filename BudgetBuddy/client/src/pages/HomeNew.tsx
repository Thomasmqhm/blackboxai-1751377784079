import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, Settings, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';
import { ConfirmDialog } from '../components/ui/confirm-dialog';

export function Home() {
  const { state, addAccount, addTransaction } = useApp();
  const [showSettings, setShowSettings] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountType, setNewAccountType] = useState('Compte courant');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);

  const totalCurrent = state.accounts.reduce((sum, acc) => sum + acc.current, 0);
  const totalProjected = state.accounts.reduce((sum, acc) => sum + acc.projected, 0);
  const difference = totalProjected - totalCurrent;

  const recentTransactions = state.transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const handleAddAccount = () => {
    if (newAccountName.trim()) {
      addAccount({
        name: newAccountName.trim(),
        current: 0,
        projected: 0,
        type: newAccountType
      });
      setNewAccountName('');
      setShowAddAccount(false);
    }
  };

  const testSynchronization = () => {
    // Test de synchronisation : ajouter une transaction et voir la mise à jour automatique
    addTransaction({
      date: new Date().toISOString().split('T')[0],
      amount: 500,
      category: 'Test',
      description: 'Test de synchronisation',
      account: 'Thomas',
      type: 'income'
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header avec bouton paramètres */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Financier</h1>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Section Paramètres (masquée par défaut) */}
      {showSettings && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Gestion des Comptes</h2>
          </div>
          <div className="p-4">
            <div className="space-y-3 mb-4">
              {state.accounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{account.name}</span>
                    <span className="text-sm text-gray-600 ml-2">({account.type})</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(account.current)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {showAddAccount ? (
              <div className="border-t pt-4 space-y-3">
                <input
                  type="text"
                  placeholder="Nom du compte"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <select
                  value={newAccountType}
                  onChange={(e) => setNewAccountType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Compte courant">Compte courant</option>
                  <option value="Compte épargne">Compte épargne</option>
                  <option value="Compte joint">Compte joint</option>
                  <option value="Livret A">Livret A</option>
                  <option value="PEL">PEL</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddAccount}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ajouter
                  </button>
                  <button
                    onClick={() => {
                      setShowAddAccount(false);
                      setNewAccountName('');
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddAccount(true)}
                className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 flex items-center justify-center transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un compte
              </button>
            )}
          </div>
        </div>
      )}

      {/* Test de synchronisation */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Test de Synchronisation</h3>
        <p className="text-green-700 text-sm mb-3">
          Cliquez pour ajouter +500€ au compte Thomas et voir la mise à jour en temps réel
        </p>
        <button
          onClick={testSynchronization}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Test: Ajouter 500€ (Revenus)
        </button>
      </div>

      {/* Récapitulatif global des comptes */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Récapitulatif Global</h2>
          <Wallet className="w-6 h-6" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-blue-100 text-sm">Total Actuel</p>
            <p className="text-2xl font-bold">{formatCurrency(totalCurrent)}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Total Projeté</p>
            <p className="text-2xl font-bold">{formatCurrency(totalProjected)}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Différence</p>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold">{formatCurrency(Math.abs(difference))}</p>
              {difference >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-300" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-300" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Détail des comptes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Détail des Comptes</h2>
        </div>
        <div className="p-4">
          {state.accounts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun compte configuré</p>
              <p className="text-sm text-gray-400 mt-2">
                Cliquez sur l'icône paramètres pour ajouter vos comptes
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {state.accounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{account.name}</h3>
                    <p className="text-sm text-gray-600">{account.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(account.current)}</p>
                    {account.projected !== account.current && (
                      <p className="text-sm text-gray-600">→ {formatCurrency(account.projected)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transactions récentes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Transactions Récentes</h2>
        </div>
        <div className="p-4">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune transaction récente</p>
              <p className="text-sm text-gray-400 mt-2">
                Ajoutez des transactions via l'historique ou les dépenses
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    {transaction.type === 'income' ? (
                      <TrendingUp className="w-4 h-4 text-green-600 mr-3" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600 mr-3" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-600">
                        {transaction.account} • {transaction.category} • {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}