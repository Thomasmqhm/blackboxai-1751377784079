import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Home } from './pages/HomeNew';
import { History } from './pages/History';
import { Expenses } from './pages/ExpensesNew';
import { Transfers } from './pages/Transfers';
import { Credits } from './pages/CreditsNew';
import { Savings } from './pages/SavingsNew';
import { Settings } from './pages/SettingsSimple';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'history':
        return <History />;
      case 'expenses':
        return <Expenses />;
      case 'transfers':
        return <Transfers />;
      case 'credits':
        return <Credits />;
      case 'savings':
        return <Savings />;
      case 'settings':
        return <Settings />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-16 pb-20">
        {renderPage()}
      </main>
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
