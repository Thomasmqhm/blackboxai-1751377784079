import React, { useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConfirmDialog } from '../components/ui/confirm-dialog';
import { formatCurrency } from '../utils/currency';
import { formatDate, getTodayString } from '../utils/date';

export function History() {
  const { state, addTransaction, deleteTransaction } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    transactionId: string;
    transactionName: string;
  }>({
    isOpen: false,
    transactionId: '',
    transactionName: ''
  });

  const filteredTransactions = state.transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAccount = selectedAccount === 'all' || transaction.account === selectedAccount;
    return matchesSearch && matchesAccount;
  });

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const amount = parseFloat(formData.get('amount') as string);
    addTransaction({
      date: formData.get('date') as string,
      amount: amount,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      account: formData.get('account') as string,
      type: amount >= 0 ? 'income' : 'expense'
    });

    setShowAddForm(false);
    (e.target as HTMLFormElement).reset();
  };

  const handleDeleteClick = (id: string, description: string) => {
    setDeleteConfirm({
      isOpen: true,
      transactionId: id,
      transactionName: description
    });
  };

  const handleDeleteConfirm = () => {
    deleteTransaction(deleteConfirm.transactionId);
    setDeleteConfirm({ isOpen: false, transactionId: '', transactionName: '' });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, transactionId: '', transactionName: '' });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Historique</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher une transaction..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tous les comptes</option>
          {state.accounts.map(account => (
            <option key={account.id} value={account.id}>{account.name}</option>
          ))}
        </select>
      </div>

      {/* Transactions List */}
      <div className="space-y-2">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm || selectedAccount !== 'all' ? 'Aucune transaction trouvée' : 'Aucune transaction'}
            </p>
            {!searchTerm && selectedAccount === 'all' && (
              <p className="text-sm text-gray-400 mt-2">
                Ajoutez votre première transaction ou synchronisez avec Google Sheets
              </p>
            )}
          </div>
        ) : (
          filteredTransactions.map((transaction) => {
            const account = state.accounts.find(acc => acc.id === transaction.account);
            return (
              <div key={transaction.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                      <div className="flex items-center space-x-2">
                        <div className={`font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                        </div>
                        <button
                          onClick={() => handleDeleteClick(transaction.id, transaction.description)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                          title="Supprimer cette transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                      <span>{transaction.category}</span>
                      <span>{account?.name || 'Compte inconnu'}</span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {formatDate(transaction.date)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Transaction Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Ajouter une transaction</h3>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  defaultValue={getTodayString()}
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
                  placeholder="Montant (négatif pour une dépense)"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <input
                  type="text"
                  name="category"
                  placeholder="Ex: Alimentation, Transport..."
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Description de la transaction"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compte</label>
                <select
                  name="account"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un compte</option>
                  {state.accounts.map(account => (
                    <option key={account.id} value={account.id}>{account.name}</option>
                  ))}
                </select>
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Supprimer la transaction"
        message={`Êtes-vous sûr de vouloir supprimer la transaction "${deleteConfirm.transactionName}" ? Cette action est irréversible.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
}
