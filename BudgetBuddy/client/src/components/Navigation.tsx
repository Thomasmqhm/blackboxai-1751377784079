import React from 'react';
import { 
  Home, 
  Clock, 
  TrendingDown, 
  ArrowLeftRight, 
  CreditCard, 
  PiggyBank, 
  Settings 
} from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navItems = [
  { id: 'home', label: 'Accueil', icon: Home },
  { id: 'history', label: 'Historique', icon: Clock },
  { id: 'expenses', label: 'Dépenses', icon: TrendingDown },
  { id: 'transfers', label: 'Virements', icon: ArrowLeftRight },
  { id: 'credits', label: 'Crédits', icon: CreditCard },
  { id: 'savings', label: 'Épargne', icon: PiggyBank }
];

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="grid grid-cols-6 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`nav-btn ${isActive ? 'active text-blue-600' : 'text-gray-500'}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
