import React, { useState } from 'react';
import { Plus, Target, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Savings: React.FC = () => {
  const { state, addSavingsGoal } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);

  const totalSaved = state.savings.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = state.savings.reduce((sum, goal) => sum + goal.targetAmount, 0);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const newGoal = {
      name: formData.get('name') as string,
      targetAmount: parseFloat(formData.get('targetAmount') as string),
      currentAmount: parseFloat(formData.get('currentAmount') as string) || 0,
      targetDate: formData.get('targetDate') as string,
      account: formData.get('account') as string
    };

    addSavingsGoal(newGoal);
    setShowAddForm(false);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Épargnes</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-700">Épargné</span>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <div className="text-2xl font-bold text-green-700">
            {totalSaved.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </div>
          <div className="text-sm text-green-600">{state.savings.length} objectifs</div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">Objectif total</span>
            <Target className="text-blue-500" size={20} />
          </div>
          <div className="text-2xl font-bold text-blue-700">
            {totalTarget.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </div>
          <div className="text-sm text-blue-600">
            {((totalSaved / totalTarget) * 100).toFixed(1)}% atteint
          </div>
        </div>
      </div>

      {/* Liste des objectifs */}
      <div className="space-y-4">
        {state.savings.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.currentAmount;
          const daysRemaining = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          const account = state.accounts.find(acc => acc.id === goal.account);

          return (
            <div key={goal.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    {goal.currentAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </div>
                  <div className="text-sm text-gray-500">
                    / {goal.targetAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {/* Barre de progression */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progression</span>
                    <span>{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        progress >= 100 ? 'bg-green-500' : progress >= 75 ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Détails */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-900">
                      {remaining.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </div>
                    <div className="text-gray-500">restant à épargner</div>
                  </div>
                  <div>
                    <div className={`font-medium ${daysRemaining > 0 ? 'text-gray-900' : 'text-red-600'}`}>
                      {Math.abs(daysRemaining)} jours
                    </div>
                    <div className="text-gray-500">
                      {daysRemaining > 0 ? 'restants' : 'de retard'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Échéance: <span className="font-medium">{new Date(goal.targetDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Compte: <span className="font-medium">{account?.name}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal d'ajout */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Nouvel objectif d'épargne</h3>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'objectif</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ex: Vacances, Voiture..."
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant objectif</label>
                <input
                  type="number"
                  step="0.01"
                  name="targetAmount"
                  placeholder="Montant à épargner"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant actuel</label>
                <input
                  type="number"
                  step="0.01"
                  name="currentAmount"
                  placeholder="Montant déjà épargné (optionnel)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date objectif</label>
                <input
                  type="date"
                  name="targetDate"
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
    </div>
  );
};

export default Savings;