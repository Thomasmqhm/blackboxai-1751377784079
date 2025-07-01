import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, Settings, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';
import { ConfirmDialog } from '../components/ui/confirm-dialog';

export function Home() {
  const { state } = useApp();

  const totalCurrent = state.accounts.reduce((sum, acc) => sum + acc.current, 0);
  const totalProjected = state.accounts.reduce((sum, acc) => sum + acc.projected, 0);
  const difference = totalProjected - totalCurrent;

  const recentTransactions = state.transactions.slice(0, 5);

  return (
    <div className="p-4 space-y-6">
      {/* Global Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Patrimoine Total</h2>
          <Wallet className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold">{formatCurrency(totalCurrent)}</div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-100">Prévu fin de mois:</span>
            <span className="font-semibold">{formatCurrency(totalProjected)}</span>
            <div className={`flex items-center space-x-1 ${difference >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {difference >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {difference >= 0 ? '+' : ''}{formatCurrency(difference)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Accounts */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Mes Comptes</h3>
        {state.accounts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucun compte configuré</p>
            <p className="text-sm text-gray-400 mt-2">
              Ajoutez vos comptes via l'intégration Google Sheets
            </p>
          </div>
        ) : (
          state.accounts.map((account) => {
            const progress = account.projected > 0 ? (account.current / account.projected) * 100 : 0;
            return (
              <div key={account.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{account.name}</h4>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(account.current)}
                    </div>
                    <div className="text-sm text-gray-500">
                      / {formatCurrency(account.projected)}
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
          })
        )}
      </div>

      {/* Recent Transactions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Transactions Récentes</h3>
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucune transaction</p>
            <p className="text-sm text-gray-400 mt-2">
              Ajoutez des transactions via l'historique ou synchronisez avec Google Sheets
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentTransactions.map((transaction) => {
              const account = state.accounts.find(acc => acc.id === transaction.account);
              return (
                <div key={transaction.id} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{transaction.description}</div>
                      <div className="text-sm text-gray-500">
                        {transaction.category} • {formatDate(transaction.date)}
                      </div>
                    </div>
                    <div className={`font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
