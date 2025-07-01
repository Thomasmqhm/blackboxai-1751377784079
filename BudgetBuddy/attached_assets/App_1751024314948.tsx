import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import History from './pages/History';
import Expenses from './pages/Expenses';
import Transfers from './pages/Transfers';
import Credits from './pages/Credits';
import Savings from './pages/Savings';
import Settings from './pages/Settings';

const AppContent: React.FC = () => {
  const { state } = useApp();

  const renderPage = () => {
    switch (state.currentPage) {
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
      <main className="pb-24 pt-4">
        {renderPage()}
      </main>
      <Navigation />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;