import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Euro, Clock, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';
import { ConfirmDialog } from '../components/ui/confirm-dialog';

export function Credits() {
  const { state, addCredit, deleteCredit } = useApp();
  const [showAddCredit, setShowAddCredit] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [name, setName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [creditToDelete, setCreditToDelete] = useState<string | null>(null);

  const handleAddCredit = () => {
    if (!selectedAccount || !name || !totalAmount || !monthlyPayment || !interestRate) return;

    const total = parseFloat(totalAmount);
    const monthly = parseFloat(monthlyPayment);
    const remainingMonths = Math.ceil(total / monthly);
    
    // Calculer la date de fin
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + remainingMonths);

    addCredit({
      name,
      totalAmount: total,
      monthlyPayment: monthly,
      remainingMonths,
      interestRate: parseFloat(interestRate),
      account: selectedAccount,
      startDate,
      endDate: end.toISOString().split('T')[0],
      remainingAmount: total
    });

    // Reset form
    setName('');
    setTotalAmount('');
    setMonthlyPayment('');
    setInterestRate('');
    setSelectedAccount('');
    setShowAddCredit(false);
  };

  const handleDeleteCredit = (id: string) => {
    setCreditToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (creditToDelete) {
      deleteCredit(creditToDelete);
      setCreditToDelete(null);
    }
    setShowDeleteConfirm(false);
  };

  const calculateProgress = (credit: any) => {
    const paid = credit.totalAmount - credit.remainingAmount;
    return (paid / credit.totalAmount) * 100;
  };

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return diffMonths > 0 ? `${diffMonths} mois restants` : 'Terminé';
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Crédits</h1>
        <button
          onClick={() => setShowAddCredit(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Crédit
        </button>
      </div>

      {/* Résumé global */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">Résumé des Crédits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-purple-100 text-sm">Total Emprunté</p>
            <p className="text-2xl font-bold">
              {formatCurrency(state.credits.reduce((sum, c) => sum + c.totalAmount, 0))}
            </p>
          </div>
          <div>
            <p className="text-purple-100 text-sm">Encore Dû</p>
            <p className="text-2xl font-bold">
              {formatCurrency(state.credits.reduce((sum, c) => sum + c.remainingAmount, 0))}
            </p>
          </div>
          <div>
            <p className="text-purple-100 text-sm">Mensualités Totales</p>
            <p className="text-2xl font-bold">
              {formatCurrency(state.credits.reduce((sum, c) => sum + c.monthlyPayment, 0))}
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire d'ajout */}
      {showAddCredit && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ajouter un Crédit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Crédit</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Crédit auto, Prêt immobilier..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compte Associé</label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant Total</label>
              <input
                type="number"
                step="0.01"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensualité</label>
              <input
                type="number"
                step="0.01"
                value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(e.target.value)}
                placeholder="0.00"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Taux d'Intérêt (%)</label>
              <input
                type="number"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="0.00"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de Début</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddCredit}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Ajouter le Crédit
            </button>
            <button
              onClick={() => setShowAddCredit(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste des crédits */}
      <div className="space-y-4">
        {state.credits.map((credit) => {
          const progress = calculateProgress(credit);
          const timeRemaining = getTimeRemaining(credit.endDate);
          
          return (
            <div key={credit.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <CreditCard className="w-6 h-6 text-purple-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{credit.name}</h3>
                    <p className="text-sm text-gray-600">Compte: {credit.account}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteCredit(credit.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Montant Total</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(credit.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Encore Dû</p>
                  <p className="font-semibold text-red-600">{formatCurrency(credit.remainingAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mensualité</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(credit.monthlyPayment)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Taux</p>
                  <p className="font-semibold text-gray-900">{credit.interestRate}%</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Début</p>
                    <p className="text-sm font-medium">{formatDate(credit.startDate)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Fin Prévue</p>
                    <p className="text-sm font-medium">{formatDate(credit.endDate)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Temps Restant</p>
                    <p className="text-sm font-medium">{timeRemaining}</p>
                  </div>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progression</span>
                  <span>{progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                Payé: {formatCurrency(credit.totalAmount - credit.remainingAmount)} / {formatCurrency(credit.totalAmount)}
              </div>
            </div>
          );
        })}
      </div>

      {state.credits.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Aucun crédit enregistré</p>
          <p className="text-gray-400 mt-2">Ajoutez vos crédits pour suivre vos remboursements</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Supprimer le crédit"
        message="Êtes-vous sûr de vouloir supprimer ce crédit ? Cette action est irréversible et mettra à jour automatiquement le solde du compte associé."
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
}