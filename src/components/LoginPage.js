import React from 'react';
import '../styles/LoginPage.css';
import logo from '../assets/lardizaballogo.svg';

export default function LoginPage() {
  return (
    <div className="main-container">
      <div className="card">
        <img src={logo} alt="Logo" className="card-logo" />
        <h2 className="card-title">Welcome to Lardizabal Dental Clinic. We missed you!</h2>
        
        <input 
          type="email" 
          placeholder="email" 
          className="input" 
        />
        <input 
          type="password" 
          placeholder="password" 
          className="input" 
        />
        
        <button className="login-button">
          LOGIN
        </button>
      </div>
    </div>
  );
}