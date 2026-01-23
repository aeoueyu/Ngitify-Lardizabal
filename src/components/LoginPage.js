import React, { useState } from 'react';
import '../styles/LoginPage.css';
import logo from '../assets/logo.svg';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const [errorMessage,setErrorMessage] = useState("");

    const sampleEmail = "aeiou@email.com";
    const samplePassword = "aeiounicole";

    const navigate = useNavigate();

    const handleLogin = ()=>{
        if (email === sampleEmail && password === samplePassword) {
            setErrorMessage("");
            navigate("/overview", {replace:true});
            // alert("Login Successful");
        }
        else {
            setErrorMessage("Email and password do not match. Try again.");
        }
    }

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
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
            />
            <div className="label-container">
                <p className="label">Password</p>
            </div>
            <input 
                type="password" 
                placeholder="Enter your password" 
                className="input" 
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
            />
            <div className="error">
                {errorMessage}
            </div>
            <button className="login-button" onClick={handleLogin}>
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