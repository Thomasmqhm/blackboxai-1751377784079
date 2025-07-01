import React, { useState } from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Transfers: React.FC = () => {
  const { state, addTransfer } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const newTransfer = {
      date: formData.get('date') as string,
      amount: parseFloat(formData.get('amount') as string),
      fromAccount: formData.get('fromAccount') as string,
      toAccount: formData.get('toAccount') as string,
      description: formData.get('description') as string
    };

    addTransfer(newTransfer);
    setShowAddForm(false);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Virements</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-3">
        {state.transfers.map((transfer) => {
          const fromAccount = state.accounts.find(acc => acc.id === transfer.fromAccount);
          const toAccount = state.accounts.find(acc => acc.id === transfer.toAccount);
          
          return (
            <div key={transfer.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-600">{fromAccount?.name}</div>
                  <ArrowRight size={16} className="text-gray-400" />
                  <div className="text-sm text-gray-600">{toAccount?.name}</div>
                </div>
                <div className="font-semibold text-blue-600">
                  {transfer.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-gray-900">{transfer.description}</div>
                <div className="text-sm text-gray-500">
                  {new Date(transfer.date).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Nouveau virement</h3>
            <form onSubmit={handleAddTransfer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  placeholder="Montant du virement"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compte source</label>
                <select
                  name="fromAccount"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {state.accounts.map(account => (
                    <option key={account.id} value={account.id}>{account.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compte destination</label>
                <select
                  name="toAccount"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {state.accounts.map(account => (
                    <option key={account.id} value={account.id}>{account.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Description du virement"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transfers;