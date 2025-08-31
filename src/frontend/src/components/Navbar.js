import React, { useState } from 'react';
import './Navbar.css';

function Navbar({ isAuthenticated, userEmail, onLogout, onNavigate }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    onLogout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <button 
          className="brand-link" 
          onClick={() => onNavigate('home')}
        >
          MyApp
        </button>
      </div>
      
      <div className="navbar-nav">
        <button 
          className="nav-link" 
          onClick={() => onNavigate('home')}
        >
          Home
        </button>
        
        {isAuthenticated ? (
          <div className="user-menu">
            <button 
              className="user-email" 
              onClick={toggleDropdown}
            >
              {userEmail}
              <span className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}>▼</span>
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button 
                  className="dropdown-item" 
                  onClick={() => {
                    setDropdownOpen(false);
                    onNavigate('profile');
                  }}
                >
                  Profile
                </button>
                <button 
                  className="dropdown-item" 
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button 
              className="nav-link" 
              onClick={() => onNavigate('login')}
            >
              Login
            </button>
            <button 
              className="nav-link" 
              onClick={() => onNavigate('register')}
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
