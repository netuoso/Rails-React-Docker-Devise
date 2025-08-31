
import React, { useState, useEffect } from 'react';
import Register from './Register';
import Login from './Login';
import './App.css';

function App() {
  const [page, setPage] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Called on successful login/register, saves JWT and sets auth state
  const handleAuth = (token) => {
    if (token) {
      localStorage.setItem('jwtToken', token);
      setIsAuthenticated(true);
    }
  };

  // Logout: remove token and reset auth state
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsAuthenticated(false);
    setPage('login');
  };

  if (isAuthenticated) {
    return (
      <div className="App">
        <h2>Welcome!</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="auth-nav">
        <button onClick={() => setPage('login')}>Login</button>
        <button onClick={() => setPage('register')}>Register</button>
      </div>
      {page === 'login' ? (
        <Login onAuth={handleAuth} />
      ) : (
        <Register onAuth={handleAuth} />
      )}
    </div>
  );
}

export default App;
