import React from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Home: React.FC = () => {
  const { state } = useApp();

  const totalCurrent = state.accounts.reduce((sum, acc) => sum + acc.current, 0);
  const totalProjected = state.accounts.reduce((sum, acc) => sum + acc.projected, 0);
  const difference = totalProjected - totalCurrent;

  const recentTransactions = state.transactions.slice(0, 5);

  return (
    <div className="p-4 space-y-6">
      {/* Résumé global */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Patrimoine Total</h2>
          <Wallet size={24} />
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold">{totalCurrent.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-100">Prévu fin de mois:</span>
            <span className="font-semibold">{totalProjected.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
            <div className={`flex items-center space-x-1 ${difference >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {difference >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="text-sm font-medium">
                {difference >= 0 ? '+' : ''}{difference.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Comptes */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Mes Comptes</h3>
        {state.accounts.map((account) => {
          const progress = (account.current / account.projected) * 100;
          return (
            <div key={account.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{account.name}</h4>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {account.current.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </div>
                  <div className="text-sm text-gray-500">
                    / {account.projected.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    progress >= 100 ? 'bg-green-500' : progress >= 75 ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {progress.toFixed(1)}% de l'objectif
              </div>
            </div>
          );
        })}
      </div>

      {/* Transactions récentes */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Transactions Récentes</h3>
        <div className="space-y-2">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{transaction.description}</div>
                  <div className="text-sm text-gray-500">{transaction.category} • {new Date(transaction.date).toLocaleDateString('fr-FR')}</div>
                </div>
                <div className={`font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;