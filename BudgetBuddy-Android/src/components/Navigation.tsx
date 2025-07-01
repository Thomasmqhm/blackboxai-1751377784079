import { Link, useLocation } from 'react-router-dom'
import { Home, CreditCard, PiggyBank, ArrowRightLeft, Clock, Settings, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

const Navigation = () => {
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path

  const navItems: NavItem[] = [
    { path: '/', label: 'Accueil', icon: Home },
    { path: '/expenses', label: 'Dépenses', icon: Wallet },
    { path: '/credits', label: 'Crédits', icon: CreditCard },
    { path: '/savings', label: 'Épargne', icon: PiggyBank },
    { path: '/transfers', label: 'Virements', icon: ArrowRightLeft },
    { path: '/history', label: 'Historique', icon: Clock },
    { path: '/settings', label: 'Paramètres', icon: Settings },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center p-2 ${
              isActive(path) ? 'text-primary' : 'text-gray-500'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs mt-1">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default Navigation
