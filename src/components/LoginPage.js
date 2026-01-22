import React from 'react';
import '../styles/LoginPage.css';
import logo from '../assets/logo.svg';

export default function LoginPage() {
    return (
        <div className="main-container">
        <div className="card">
            <img src={logo} alt="Logo" className="card-logo" />
            <div className="label-container">
                <p className="label">Email</p>
            </div>
            <input 
                type="email" 
                placeholder="Enter your email" 
                className="input" 
            />
            <div className="label-container">
                <p className="label">Password</p>
            </div>
            <input 
                type="password" 
                placeholder="Enter your password" 
                className="input" 
            />
            <button className="login-button">
                LOGIN
            </button>
            <div className="signup-container">
                <p className="signup-label">
                    Don't have an account yet? <a href="/signup" className="signup-link">Sign up</a>.
                </p>
            </div>
        </div>
        </div>
    );
}