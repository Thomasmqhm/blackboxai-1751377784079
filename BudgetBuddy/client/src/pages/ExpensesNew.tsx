import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Euro, Tag, Building } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';
import { ConfirmDialog } from '../components/ui/confirm-dialog';

export function Expenses() {
  const { state, addTransaction, deleteTransaction } = useApp();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isFixed, setIsFixed] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'fixed' | 'variable'>('all');

  // Filtrer les dépenses (transactions avec type='expense')
  const expenses = state.transactions.filter(t => t.type === 'expense');
  
  // Grouper par compte
  const expensesByAccount = state.accounts.reduce((acc, account) => {
    const accountExpenses = expenses.filter(e => e.account === account.name);
    const fixedExpenses = accountExpenses.filter(e => e.isFixed);
    const variableExpenses = accountExpenses.filter(e => !e.isFixed);
    
    acc[account.name] = {
      all: accountExpenses,
      fixed: fixedExpenses,
      variable: variableExpenses,
      totalFixed: fixedExpenses.reduce((sum, e) => sum + e.amount, 0),
      totalVariable: variableExpenses.reduce((sum, e) => sum + e.amount, 0)
    };
    return acc;
  }, {} as Record<string, any>);

  const handleAddExpense = () => {
    if (!selectedAccount || !amount || !category || !description) return;

    addTransaction({
      date,
      amount: parseFloat(amount),
      category,
      description,
      account: selectedAccount,
      type: 'expense',
      isFixed
    });

    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
    setSelectedAccount('');
    setIsFixed(false);
    setShowAddExpense(false);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenseToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (expenseToDelete) {
      deleteTransaction(expenseToDelete);
      setExpenseToDelete(null);
    }
    setShowDeleteConfirm(false);
  };

  const getFilteredExpenses = (accountExpenses: any) => {
    switch (activeTab) {
      case 'fixed':
        return accountExpenses.fixed;
      case 'variable':
        return accountExpenses.variable;
      default:
        return accountExpenses.all;
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Dépenses</h1>
        <button
          onClick={() => setShowAddExpense(true)}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Dépense
        </button>
      </div>

      {/* Onglets de filtrage */}
      <div className="flex space-x-4 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Toutes
        </button>
        <button
          onClick={() => setActiveTab('fixed')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'fixed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Fixes
        </button>
        <button
          onClick={() => setActiveTab('variable')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'variable' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Variables
        </button>
      </div>

      {/* Formulaire d'ajout */}
      {showAddExpense && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ajouter une Dépense</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compte</label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Sélectionner un compte</option>
                {state.accounts.map((account) => (
                  <option key={account.id} value={account.name}>
                    {account.name} ({formatCurrency(account.current)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Alimentation, Transport..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description de la dépense"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isFixed}
                  onChange={(e) => setIsFixed(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Dépense fixe (récurrente)</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddExpense}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Ajouter la Dépense
            </button>
            <button
              onClick={() => setShowAddExpense(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste des dépenses par compte */}
      {state.accounts.map((account) => {
        const accountExpenses = expensesByAccount[account.name];
        const filteredExpenses = getFilteredExpenses(accountExpenses);
        
        if (!accountExpenses || filteredExpenses.length === 0) return null;

        return (
          <div key={account.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building className="w-5 h-5 text-gray-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">{account.name}</h3>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Fixes: {formatCurrency(accountExpenses.totalFixed)} | 
                    Variables: {formatCurrency(accountExpenses.totalVariable)}
                  </p>
                  <p className="font-semibold text-red-600">
                    Total: {formatCurrency(accountExpenses.totalFixed + accountExpenses.totalVariable)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-3">
                {filteredExpenses.map((expense: any) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${expense.isFixed ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{expense.description}</p>
                        <div className="flex items-center text-sm text-gray-600 space-x-4">
                          <span className="flex items-center">
                            <Tag className="w-4 h-4 mr-1" />
                            {expense.category}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(expense.date)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            expense.isFixed ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {expense.isFixed ? 'Fixe' : 'Variable'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <p className="font-semibold text-red-600 flex items-center">
                        <Euro className="w-4 h-4 mr-1" />
                        {formatCurrency(expense.amount)}
                      </p>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {expenses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucune dépense enregistrée</p>
          <p className="text-gray-400 mt-2">Commencez par ajouter votre première dépense</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Supprimer la dépense"
        message="Êtes-vous sûr de vouloir supprimer cette dépense ? Cette action est irréversible et mettra à jour automatiquement le solde du compte."
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
}