import { Card } from '../components/ui/card'
import { Plus, PiggyBank, TrendingUp, Target } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { formatCurrency } from '../lib/utils'

interface SavingsAccount {
  id: number;
  title: string;
  balance: number;
  goal: number | null;
  interest: number;
  icon: LucideIcon;
  color: string;
}

const Savings = () => {
  const savingsAccounts: SavingsAccount[] = [
    {
      id: 1,
      title: 'Épargne principale',
      balance: 12000,
      goal: 20000,
      interest: 2.5,
      icon: PiggyBank,
      color: 'blue'
    },
    {
      id: 2,
      title: 'Projet vacances',
      balance: 2500,
      goal: 3000,
      interest: 1.5,
      icon: Target,
      color: 'green'
    },
    {
      id: 3,
      title: 'Investissements',
      balance: 5000,
      goal: null,
      interest: 4.5,
      icon: TrendingUp,
      color: 'purple'
    }
  ]

  const totalSavings = savingsAccounts.reduce((sum, account) => sum + account.balance, 0)
  const monthlyIncrease = 350

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Épargne</h1>
        <button className="p-2 rounded-full bg-primary text-white">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-2">Total épargné</h2>
        <div className="text-3xl font-bold text-primary">
          {formatCurrency(totalSavings)}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          +{formatCurrency(monthlyIncrease)} ce mois-ci
        </p>
      </Card>

      <div className="space-y-4">
        {savingsAccounts.map((account) => {
          const Icon = account.icon
          const progress = account.goal 
            ? (account.balance / account.goal) * 100 
            : null

          return (
            <Card key={account.id} className="p-4">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full bg-${account.color}-100`}>
                  <Icon className={`w-6 h-6 text-${account.color}-500`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{account.title}</h3>
                      <p className="text-sm text-gray-500">
                        {account.interest}% d'intérêts
                      </p>
                    </div>
                    <span className="font-semibold">
                      {formatCurrency(account.balance)}
                    </span>
                  </div>
                  
                  {progress !== null && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Objectif</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="mt-1 h-2 bg-gray-100 rounded-full">
                        <div
                          className={`h-full rounded-full bg-${account.color}-500`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Reste {formatCurrency(account.goal! - account.balance)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default Savings
