import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import AuthModal from './AuthModal.jsx';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [showAuth, setShowAuth] = useState(false);

  const linkClass = (path) =>
    `text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'text-orange-600'
        : 'text-gray-600 hover:text-orange-600'
    }`;

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-gray-900">
            <span className="text-2xl">🪖</span>
            <span className="text-orange-600">Build</span>Calc
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/calculator" className={linkClass('/calculator')}>
              Calculator
            </Link>
            {user && (
              <Link to="/dashboard" className={linkClass('/dashboard')}>
                Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-500 hidden sm:block truncate max-w-[160px]">
                  {user.email}
                </span>
                <button
                  onClick={signOut}
                  className="text-sm text-gray-600 hover:text-red-600 font-medium transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
