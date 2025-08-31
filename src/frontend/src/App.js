
import React, { useState } from 'react';
import Register from './Register';
import Login from './Login';
import './App.css';

function App() {
  const [page, setPage] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuth = () => {
    setIsAuthenticated(true);
  };

  if (isAuthenticated) {
    return (
      <div className="App">
        <h2>Welcome!</h2>
        <button onClick={() => setIsAuthenticated(false)}>Logout</button>
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
