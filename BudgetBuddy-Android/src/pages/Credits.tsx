import { Card } from '../components/ui/card'
import { Plus, CreditCard } from 'lucide-react'
import { formatCurrency } from '../lib/utils'

interface Credit {
  id: number;
  title: string;
  totalAmount: number;
  remainingAmount: number;
  monthlyPayment: number;
  nextPayment: Date;
  color: string;
}

const Credits = () => {
  const credits: Credit[] = [
    {
      id: 1,
      title: 'Prêt immobilier',
      totalAmount: 200000,
      remainingAmount: 150000,
      monthlyPayment: 850,
      nextPayment: new Date('2023-12-05'),
      color: 'blue'
    },
    {
      id: 2,
      title: 'Prêt voiture',
      totalAmount: 15000,
      remainingAmount: 8000,
      monthlyPayment: 250,
      nextPayment: new Date('2023-12-10'),
      color: 'green'
    }
  ]

  const totalMonthlyPayment = credits.reduce((sum, credit) => sum + credit.monthlyPayment, 0)

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Crédits</h1>
        <button className="p-2 rounded-full bg-primary text-white">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-2">Total mensuel</h2>
        <div className="text-3xl font-bold text-primary">
          {formatCurrency(totalMonthlyPayment)}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Prochaine échéance le {credits[0].nextPayment.toLocaleDateString('fr-FR')}
        </p>
      </Card>

      <div className="space-y-4">
        {credits.map((credit) => (
          <Card key={credit.id} className="p-4">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full bg-${credit.color}-100`}>
                <CreditCard className={`w-6 h-6 text-${credit.color}-500`} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{credit.title}</h3>
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Progression</span>
                    <span>
                      {Math.round((1 - credit.remainingAmount / credit.totalAmount) * 100)}%
                    </span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-100 rounded-full">
                    <div
                      className={`h-full rounded-full bg-${credit.color}-500`}
                      style={{
                        width: `${(1 - credit.remainingAmount / credit.totalAmount) * 100}%`
                      }}
                    />
                  </div>
                </div>
                <div className="mt-3 flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Mensualité</p>
                    <p className="font-semibold">
                      {formatCurrency(credit.monthlyPayment)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Restant</p>
                    <p className="font-semibold">
                      {formatCurrency(credit.remainingAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Credits
