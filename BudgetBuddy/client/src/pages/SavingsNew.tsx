import React, { useState } from 'react';
import { Plus, Trash2, Target, TrendingUp, Euro, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';
import { ConfirmDialog } from '../components/ui/confirm-dialog';

export function Savings() {
  const { state, addSavingsGoal, deleteSavingsGoal, addTransfer } = useApp();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributionAccount, setContributionAccount] = useState('');

  const handleAddGoal = () => {
    if (!selectedAccount || !name || !targetAmount || !targetDate) return;

    addSavingsGoal({
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      targetDate,
      account: selectedAccount
    });

    // Reset form
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setTargetDate('');
    setSelectedAccount('');
    setShowAddGoal(false);
  };

  const handleDeleteGoal = (id: string) => {
    setGoalToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (goalToDelete) {
      deleteSavingsGoal(goalToDelete);
      setGoalToDelete(null);
    }
    setShowDeleteConfirm(false);
  };

  const handleContribute = (goal: any) => {
    setSelectedGoal(goal);
    setShowContributeModal(true);
  };

  const confirmContribution = () => {
    if (!selectedGoal || !contributionAmount || !contributionAccount) return;

    // Créer un virement vers l'objectif d'épargne
    addTransfer({
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(contributionAmount),
      fromAccount: contributionAccount,
      toAccount: selectedGoal.account,
      description: `Contribution pour ${selectedGoal.name}`
    });

    // Reset modal
    setContributionAmount('');
    setContributionAccount('');
    setSelectedGoal(null);
    setShowContributeModal(false);
  };

  const calculateProgress = (goal: any) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getRemainingAmount = (goal: any) => {
    return Math.max(goal.targetAmount - goal.currentAmount, 0);
  };

  const getDaysRemaining = (targetDate: string) => {
    const target = new Date(targetDate);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getMonthlyTarget = (goal: any) => {
    const remaining = getRemainingAmount(goal);
    const daysRemaining = getDaysRemaining(goal.targetDate);
    const monthsRemaining = Math.max(daysRemaining / 30, 1);
    return remaining / monthsRemaining;
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Objectifs d'Épargne</h1>
        <button
          onClick={() => setShowAddGoal(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Objectif
        </button>
      </div>

      {/* Résumé global */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">Résumé de l'Épargne</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-green-100 text-sm">Objectifs Totaux</p>
            <p className="text-2xl font-bold">
              {formatCurrency(state.savings.reduce((sum, s) => sum + s.targetAmount, 0))}
            </p>
          </div>
          <div>
            <p className="text-green-100 text-sm">Épargné</p>
            <p className="text-2xl font-bold">
              {formatCurrency(state.savings.reduce((sum, s) => sum + s.currentAmount, 0))}
            </p>
          </div>
          <div>
            <p className="text-green-100 text-sm">Reste à Épargner</p>
            <p className="text-2xl font-bold">
              {formatCurrency(state.savings.reduce((sum, s) => sum + getRemainingAmount(s), 0))}
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire d'ajout */}
      {showAddGoal && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Créer un Objectif d'Épargne</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'Objectif</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Vacances, Voiture, Maison..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compte d'Épargne</label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant Objectif</label>
              <input
                type="number"
                step="0.01"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant Initial (optionnel)</label>
              <input
                type="number"
                step="0.01"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Objectif</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddGoal}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Créer l'Objectif
            </button>
            <button
              onClick={() => setShowAddGoal(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste des objectifs */}
      <div className="space-y-4">
        {state.savings.map((goal) => {
          const progress = calculateProgress(goal);
          const remaining = getRemainingAmount(goal);
          const daysRemaining = getDaysRemaining(goal.targetDate);
          const monthlyTarget = getMonthlyTarget(goal);
          const isCompleted = progress >= 100;
          
          return (
            <div key={goal.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Target className="w-6 h-6 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
                    <p className="text-sm text-gray-600">Compte: {goal.account}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!isCompleted && (
                    <button
                      onClick={() => handleContribute(goal)}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                    >
                      Contribuer
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Objectif</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(goal.targetAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Épargné</p>
                  <p className="font-semibold text-green-600">{formatCurrency(goal.currentAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reste</p>
                  <p className="font-semibold text-red-600">{formatCurrency(remaining)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date Limite</p>
                  <p className="font-semibold text-gray-900">{formatDate(goal.targetDate)}</p>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progression</span>
                  <span>{progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-green-500' : 'bg-green-600'
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Statistiques de suivi */}
              {!isCompleted && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Jours restants</p>
                      <p className="text-sm font-medium">
                        {daysRemaining > 0 ? `${daysRemaining} jours` : 'Échéance dépassée'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Épargne mensuelle recommandée</p>
                      <p className="text-sm font-medium text-blue-600">{formatCurrency(monthlyTarget)}</p>
                    </div>
                  </div>
                </div>
              )}

              {isCompleted && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">🎉 Objectif atteint ! Félicitations !</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {state.savings.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Aucun objectif d'épargne</p>
          <p className="text-gray-400 mt-2">Créez votre premier objectif pour commencer à épargner</p>
        </div>
      )}

      {/* Modal de contribution */}
      {showContributeModal && selectedGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contribuer à {selectedGoal.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
                <input
                  type="number"
                  step="0.01"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Depuis le compte</label>
                <select
                  value={contributionAccount}
                  onChange={(e) => setContributionAccount(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Sélectionner un compte</option>
                  {state.accounts.filter(a => a.name !== selectedGoal.account).map((account) => (
                    <option key={account.id} value={account.name}>
                      {account.name} ({formatCurrency(account.current)})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={confirmContribution}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Contribuer
              </button>
              <button
                onClick={() => setShowContributeModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Supprimer l'objectif"
        message="Êtes-vous sûr de vouloir supprimer cet objectif d'épargne ? Cette action est irréversible et remettra l'argent épargné dans le compte principal."
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
}