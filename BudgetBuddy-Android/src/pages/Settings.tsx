import { type LucideIcon, User, Bell, Shield, HelpCircle, ChevronRight, LogOut, Moon, Languages } from 'lucide-react'
import { Card } from '../components/ui/card'

interface SettingsItem {
  icon: LucideIcon;
  label: string;
  color: string;
  value?: string;
}

interface SettingsGroup {
  title: string;
  items: SettingsItem[];
}

const Settings = () => {
  const settingsGroups: SettingsGroup[] = [
    {
      title: 'Compte',
      items: [
        {
          icon: User,
          label: 'Informations personnelles',
          color: 'text-blue-500 bg-blue-50'
        },
        {
          icon: Bell,
          label: 'Notifications',
          color: 'text-purple-500 bg-purple-50'
        },
        {
          icon: Shield,
          label: 'Sécurité',
          color: 'text-green-500 bg-green-50'
        }
      ]
    },
    {
      title: 'Préférences',
      items: [
        {
          icon: Languages,
          label: 'Langue',
          value: 'Français',
          color: 'text-orange-500 bg-orange-50'
        },
        {
          icon: Moon,
          label: 'Thème',
          value: 'Clair',
          color: 'text-gray-500 bg-gray-50'
        }
      ]
    },
    {
      title: 'Aide',
      items: [
        {
          icon: HelpCircle,
          label: 'Centre d\'aide',
          color: 'text-blue-500 bg-blue-50'
        }
      ]
    }
  ]

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold">Paramètres</h1>

      {settingsGroups.map((group, index) => (
        <div key={index}>
          <h2 className="text-sm font-medium text-gray-500 mb-2">
            {group.title}
          </h2>
          <Card className="divide-y">
            {group.items.map((item, itemIndex) => {
              const Icon = item.icon
              return (
                <button
                  key={itemIndex}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.value && (
                      <span className="text-sm text-gray-500">
                        {item.value}
                      </span>
                    )}
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              )
            })}
          </Card>
        </div>
      ))}

      <div className="pt-4">
        <button className="w-full flex items-center space-x-3 text-red-500 p-4">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>Version 1.0.0</p>
      </div>
    </div>
  )
}

export default Settings
