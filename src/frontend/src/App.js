
import React, { useState, useEffect } from 'react';
import { Navbar } from './components';
import { Home, Register, Login } from './pages';
import './App.css';

function App() {
  const [page, setPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const email = localStorage.getItem('userEmail');
    if (token && email) {
      setIsAuthenticated(true);
      setUserEmail(email);
    }
  }, []);

  // Called on successful login/register, saves JWT and sets auth state
  const handleAuth = (token, email) => {
    if (token && email) {
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('userEmail', email);
      setIsAuthenticated(true);
      setUserEmail(email);
      setPage('home');
    }
  };

  // Logout: remove token and reset auth state
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserEmail('');
    setPage('home');
  };

  // Handle navigation
  const handleNavigate = (newPage) => {
    setPage(newPage);
  };

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <Home userEmail={isAuthenticated ? userEmail : null} />;
      case 'login':
        return <Login onAuth={handleAuth} />;
      case 'register':
        return <Register onAuth={handleAuth} />;
      default:
        return <Home userEmail={isAuthenticated ? userEmail : null} />;
    }
  };

  return (
    <div className="App">
      <Navbar 
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
