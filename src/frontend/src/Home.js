import React from 'react';
import './Home.css';

function Home({ userEmail }) {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to MyApp</h1>
        {userEmail ? (
          <p className="welcome-message">
            Hello, <span className="user-highlight">{userEmail}</span>! 
            You are successfully logged in.
          </p>
        ) : (
          <p className="welcome-message">
            Please log in or register to get started.
          </p>
        )}
      </div>
      
      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🔐 Secure Authentication</h3>
            <p>JWT-based authentication with Devise for secure user sessions.</p>
          </div>
          <div className="feature-card">
            <h3>⚛️ React Frontend</h3>
            <p>Modern React frontend with responsive design and smooth interactions.</p>
          </div>
          <div className="feature-card">
            <h3>🚀 Rails Backend</h3>
            <p>Robust Ruby on Rails API backend with PostgreSQL database.</p>
          </div>
          <div className="feature-card">
            <h3>🐳 Docker Ready</h3>
            <p>Fully containerized application for easy development and deployment.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
