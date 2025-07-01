import { Card } from '../components/ui/card'
import { ArrowRightLeft, Plus, Calendar } from 'lucide-react'
import { formatCurrency, formatDate } from '../lib/utils'

interface BaseTransfer {
  id: number;
  title: string;
  amount: number;
  from: string;
  to: string;
}

interface RecurringTransfer extends BaseTransfer {
  type: 'recurring';
  date: Date;
  recurring: true;
  nextDate: Date;
}

interface ScheduledTransfer extends BaseTransfer {
  type: 'scheduled';
  scheduledDate: Date;
}

const Transfers = () => {
  const transfers: RecurringTransfer[] = [
    {
      id: 1,
      type: 'recurring',
      title: 'Virement vers épargne',
      amount: 500,
      from: 'Compte courant',
      to: 'Livret A',
      date: new Date('2023-11-20'),
      recurring: true,
      nextDate: new Date('2023-12-20')
    },
    {
      id: 2,
      type: 'recurring',
      title: 'Épargne vacances',
      amount: 200,
      from: 'Compte courant',
      to: 'Compte vacances',
      date: new Date('2023-11-15'),
      recurring: true,
      nextDate: new Date('2023-12-15')
    }
  ]

  const scheduledTransfers: ScheduledTransfer[] = [
    {
      id: 3,
      type: 'scheduled',
      title: 'Virement famille',
      amount: 150,
      from: 'Compte courant',
      to: 'Compte externe',
      scheduledDate: new Date('2023-12-01')
    }
  ]

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Virements</h1>
        <button className="p-2 rounded-full bg-primary text-white">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Virements programmés */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Virements programmés</h2>
        <div className="space-y-4">
          {scheduledTransfers.map((transfer) => (
            <Card key={transfer.id} className="p-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-orange-100">
                  <Calendar className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{transfer.title}</h3>
                      <p className="text-sm text-gray-500">
                        {transfer.from} → {transfer.to}
                      </p>
                      <p className="text-xs text-gray-400">
                        Prévu le {formatDate(transfer.scheduledDate)}
                      </p>
                    </div>
                    <span className="font-semibold text-orange-500">
                      {formatCurrency(transfer.amount)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Virements récurrents */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Virements récurrents</h2>
        <div className="space-y-4">
          {transfers.map((transfer) => (
            <Card key={transfer.id} className="p-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <ArrowRightLeft className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{transfer.title}</h3>
                      <p className="text-sm text-gray-500">
                        {transfer.from} → {transfer.to}
                      </p>
                      <p className="text-xs text-gray-400">
                        Prochain virement le {formatDate(transfer.nextDate)}
                      </p>
                    </div>
                    <span className="font-semibold text-blue-500">
                      {formatCurrency(transfer.amount)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Transfers
