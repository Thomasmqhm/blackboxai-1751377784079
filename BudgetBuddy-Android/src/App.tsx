import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Expenses from './pages/Expenses'
import Credits from './pages/Credits'
import Savings from './pages/Savings'
import Transfers from './pages/Transfers'
import History from './pages/History'
import Settings from './pages/Settings'
import Navigation from './components/Navigation'

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/transfers" element={<Transfers />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
