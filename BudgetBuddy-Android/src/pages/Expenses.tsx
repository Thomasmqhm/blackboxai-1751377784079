import { Card } from '../components/ui/card'
import { Plus, Filter } from 'lucide-react'
import { formatCurrency } from '../lib/utils'

interface Expense {
  id: number;
  title: string;
  amount: number;
  date: Date;
  category: string;
}

const Expenses = () => {
  const expenses: Expense[] = [
    {
      id: 1,
      title: 'Courses alimentaires',
      amount: 85.50,
      date: new Date('2023-11-20'),
      category: 'Alimentation'
    },
    {
      id: 2,
      title: 'Transport en commun',
      amount: 75.00,
      date: new Date('2023-11-19'),
      category: 'Transport'
    },
    {
      id: 3,
      title: 'Facture électricité',
      amount: 62.30,
      date: new Date('2023-11-18'),
      category: 'Logement'
    }
  ]

  const totalBudget = 2000
  const totalExpenses = 1250.80
  const progressPercentage = (totalExpenses / totalBudget) * 100

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dépenses</h1>
        <div className="flex gap-2">
          <button className="p-2 rounded-full bg-gray-100">
            <Filter className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full bg-primary text-white">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-2">Ce mois-ci</h2>
        <div className="text-3xl font-bold text-primary">
          {formatCurrency(totalExpenses)}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          sur {formatCurrency(totalBudget)} budgétés
        </p>
        <div className="mt-4 h-2 bg-gray-100 rounded-full">
          <div 
            className="h-full bg-primary rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </Card>

      <div className="space-y-4">
        {expenses.map((expense) => (
          <Card key={expense.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{expense.title}</h3>
                <p className="text-sm text-gray-500">{expense.category}</p>
                <p className="text-xs text-gray-400">
                  {expense.date.toLocaleDateString('fr-FR')}
                </p>
              </div>
              <span className="text-red-500 font-semibold">
                {formatCurrency(-expense.amount)}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Expenses
