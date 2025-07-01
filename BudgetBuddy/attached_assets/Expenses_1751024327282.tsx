import React, { useState } from 'react';
import { TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Expenses: React.FC = () => {
  const { state } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const expenses = state.transactions.filter(t => t.amount < 0);
  const income = state.transactions.filter(t => t.amount > 0);

  const totalExpenses = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);

  // Grouper par catégorie
  const expensesByCategory = expenses.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = {
        amount: 0,
        count: 0,
        transactions: []
      };
    }
    acc[category].amount += Math.abs(transaction.amount);
    acc[category].count += 1;
    acc[category].transactions.push(transaction);
    return acc;
  }, {} as Record<string, { amount: number; count: number; transactions: any[] }>);

  const sortedCategories = Object.entries(expensesByCategory)
    .sort(([,a], [,b]) => b.amount - a.amount)
    .slice(0, 5);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Dépenses</h2>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="year">Cette année</option>
        </select>
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-red-700">Dépenses</span>
            <TrendingDown className="text-red-500" size={20} />
          </div>
          <div className="text-2xl font-bold text-red-700">
            {totalExpenses.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </div>
          <div className="text-sm text-red-600">{expenses.length} transactions</div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-700">Revenus</span>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <div className="text-2xl font-bold text-green-700">
            {totalIncome.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </div>
          <div className="text-sm text-green-600">{income.length} transactions</div>
        </div>
      </div>

      {/* Solde net */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Solde net</span>
          <PieChart className="text-gray-400" size={20} />
        </div>
        <div className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {(totalIncome - totalExpenses).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </div>
      </div>

      {/* Top catégories */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Top Catégories</h3>
        <div className="space-y-3">
          {sortedCategories.map(([category, data]) => {
            const percentage = (data.amount / totalExpenses) * 100;
            return (
              <div key={category} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{category}</span>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {data.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </div>
                    <div className="text-sm text-gray-500">{data.count} transactions</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="mt-1 text-sm text-gray-600">{percentage.toFixed(1)}% du total</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transactions récentes par catégorie */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Détail par Catégorie</h3>
        {sortedCategories.map(([category, data]) => (
          <div key={category} className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-medium text-gray-900">{category}</h4>
            </div>
            <div className="divide-y divide-gray-200">
              {data.transactions.slice(0, 3).map(transaction => (
                <div key={transaction.id} className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{transaction.description}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <div className="font-semibold text-red-600">
                    {transaction.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Expenses;