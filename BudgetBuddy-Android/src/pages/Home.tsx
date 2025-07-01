import { Card } from '../components/ui/card'
import { ArrowUpIcon, ArrowDownIcon, PiggyBankIcon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { formatCurrency } from '../lib/utils'

interface StatItem {
  title: string;
  amount: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const Home = () => {
  const stats: StatItem[] = [
    {
      title: 'Dépenses',
      amount: formatCurrency(-1250.00),
      icon: ArrowDownIcon,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Revenus',
      amount: formatCurrency(2800.00),
      icon: ArrowUpIcon,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Épargne',
      amount: formatCurrency(15000.00),
      icon: PiggyBankIcon,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    }
  ]

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-4">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className={`text-xl font-semibold ${stat.color}`}>
                    {stat.amount}
                  </p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Dernières transactions</h2>
        <Card className="divide-y">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">Transaction {index + 1}</p>
                <p className="text-sm text-gray-500">Il y a {index + 1} heures</p>
              </div>
              <span className="text-red-500 font-medium">
                {formatCurrency(-(index + 1) * 25)}
              </span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}

export default Home
