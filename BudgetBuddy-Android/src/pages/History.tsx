import { Card } from '../components/ui/card'
import { Filter, ArrowUpRight, ArrowDownRight, ArrowRightLeft } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { formatCurrency } from '../lib/utils'

interface Transaction {
  id: number;
  type: 'expense' | 'income' | 'transfer';
  title: string;
  amount: number;
  date: Date;
  category: string;
  icon: LucideIcon;
  color: string;
}

const History = () => {
  const transactions: Transaction[] = [
    {
      id: 1,
      type: 'expense',
      title: 'Courses Carrefour',
      amount: -85.50,
      date: new Date('2023-11-20'),
      category: 'Alimentation',
      icon: ArrowDownRight,
      color: 'text-red-500 bg-red-50'
    },
    {
      id: 2,
      type: 'income',
      title: 'Salaire',
      amount: 2800.00,
      date: new Date('2023-11-19'),
      category: 'Revenus',
      icon: ArrowUpRight,
      color: 'text-green-500 bg-green-50'
    },
    {
      id: 3,
      type: 'transfer',
      title: 'Virement épargne',
      amount: -500.00,
      date: new Date('2023-11-18'),
      category: 'Virements',
      icon: ArrowRightLeft,
      color: 'text-blue-500 bg-blue-50'
    }
  ]

  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = transaction.date.toLocaleDateString('fr-FR', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    if (!groups[date]) {
      groups[date] = []
    }
    
    groups[date].push(transaction)
    return groups
  }, {} as Record<string, Transaction[]>)

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Historique</h1>
        <button className="p-2 rounded-full bg-gray-100">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
        <div key={date}>
          <h2 className="text-sm font-medium text-gray-500 mb-2">{date}</h2>
          <div className="space-y-2">
            {dayTransactions.map((transaction) => {
              const Icon = transaction.icon
              return (
                <Card key={transaction.id} className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${transaction.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{transaction.title}</h3>
                          <p className="text-sm text-gray-500">
                            {transaction.category}
                          </p>
                        </div>
                        <span className={`font-semibold ${
                          transaction.amount > 0 
                            ? 'text-green-500' 
                            : transaction.type === 'transfer' 
                              ? 'text-blue-500' 
                              : 'text-red-500'
                        }`}>
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      ))}

      <div className="flex justify-center">
        <button className="text-primary font-medium">
          Voir plus de transactions
        </button>
      </div>
    </div>
  )
}

export default History
