import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from './services/authService';


import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import TicketManagementPage from './pages/TicketManagementPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleSignup = () => {
    setIsAuthenticated(true);
    navigate('/dashboard');
  }

  const AuthLinks = () => (
    <div className="auth-links">
      {isAuthenticated ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/tickets">Tickets</Link>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </>
      ) : (
        <>
          <Link to="/auth?mode=login">Login</Link>
          <Link to="/auth?mode=signup" className="btn btn-primary">Get Started</Link>
        </>
      )}
    </div>
  );

  return (
    <>
      {}
      <header className="main-header">
        <div className="app-container">
          <Link to="/" className="logo">TicketApp</Link>
          <nav className="main-nav">
            <AuthLinks />
          </nav>
        </div>
      </header>

      {}
      <main>
        <Routes>
          {}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage onLogin={handleLogin} onSignup={handleSignup} />} />

          {}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tickets" 
            element={
              <ProtectedRoute>
                <TicketManagementPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>

      {}
      {location.pathname !== '/auth' && (
         <footer className="main-footer">
          <div className="app-container">
            &copy; {new Date().getFullYear()} TicketApp. All rights reserved.
          </div>
        </footer>
      )}
    </>
  );
}
export default App;