import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import CalculatorPage from './pages/CalculatorPage.jsx';
import Dashboard from './pages/Dashboard.jsx';

function AppRoutes() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className={`flex-1 flex flex-col ${isHome ? '' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
