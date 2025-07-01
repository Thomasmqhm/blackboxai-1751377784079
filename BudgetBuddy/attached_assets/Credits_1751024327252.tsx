import React from 'react';
import { CreditCard, Clock, Percent } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Credits: React.FC = () => {
  const { state } = useApp();

  const totalDebt = state.credits.reduce((sum, credit) => sum + (credit.monthlyPayment * credit.remainingMonths), 0);
  const totalMonthlyPayment = state.credits.reduce((sum, credit) => sum + credit.monthlyPayment, 0);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Crédits</h2>

      {/* Résumé */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-orange-700">Dette totale</span>
            <CreditCard className="text-orange-500" size={20} />
          </div>
          <div className="text-2xl font-bold text-orange-700">
            {totalDebt.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </div>
          <div className="text-sm text-orange-600">{state.credits.length} crédits actifs</div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">Mensualités</span>
            <Clock className="text-blue-500" size={20} />
          </div>
          <div className="text-2xl font-bold text-blue-700">
            {totalMonthlyPayment.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </div>
          <div className="text-sm text-blue-600">par mois</div>
        </div>
      </div>

      {/* Liste des crédits */}
      <div className="space-y-4">
        {state.credits.map((credit) => {
          const progress = ((credit.totalAmount - (credit.monthlyPayment * credit.remainingMonths)) / credit.totalAmount) * 100;
          const remainingAmount = credit.monthlyPayment * credit.remainingMonths;
          const account = state.accounts.find(acc => acc.id === credit.account);

          return (
            <div key={credit.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{credit.name}</h3>
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    {remainingAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </div>
                  <div className="text-sm text-gray-500">restant</div>
                </div>
              </div>

              <div className="space-y-3">
                {/* Barre de progression */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progression</span>
                    <span>{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Détails */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-gray-400" />
                    <div>
                      <div className="font-medium">{credit.remainingMonths} mois</div>
                      <div className="text-gray-500">restants</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Percent size={16} className="text-gray-400" />
                    <div>
                      <div className="font-medium">{credit.interestRate}%</div>
                      <div className="text-gray-500">taux</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Mensualité: <span className="font-medium">{credit.monthlyPayment.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
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

      {/* Conseils */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Conseil</h3>
        <p className="text-sm text-blue-800">
          Considérez rembourser en priorité les crédits avec les taux d'intérêt les plus élevés pour économiser sur le long terme.
        </p>
      </div>
    </div>
  );
};

export default Credits;