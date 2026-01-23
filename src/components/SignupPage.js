import React, { useState } from 'react';
import '../styles/SignupPage.css';
import logo from '../assets/logo.svg';

export default function LoginPage() {
    // const [email,setEmail] = useState("");
    // const [password,setPassword] = useState("");

    // const [errorMessage,setErrorMessage] = useState("");

    // const sampleEmail = "aeiou@email.com";
    // const samplePassword = "aeiounicole";

    // const handleLogin = ()=>{
    //     if (email === sampleEmail && password === samplePassword) {
    //         setErrorMessage("");
    //         // alert("Login Successful");
    //     }
    //     else {
    //         setErrorMessage("Email and password do not match. Try again.");
    //     }
    // }

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [conPassword,setConPassword] = useState("");

    const handleNameChange = (e)=>{
        const val = e.target.value;
        const cleanValue = val.replace(/[^a-zA-Z\s.]/g,"");
        setName(cleanValue);
    }

    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [errorMessage,setErrorMessage] = useState("");

    const handleSignup = ()=>{
        if (name.trim()===" " || email.trim()===" " || password.trim()===" " || conPassword.trim()===" " ||
            !name || !email || !password || !conPassword) {
            setErrorMessage("All fields are required.");
        }
        else if (!emailFormat.test(email)) {
            setErrorMessage("Invalid email format. Please check again.");
        }
        else if (password!=conPassword) {
            setErrorMessage("Passwords do not match. Try again.");
        }
        else {
            setErrorMessage("");
        }
    }


    return (
        <div className="main-container">
        <div className="card">
            <img src={logo} alt="Logo" className="card-logo" />
            <div className="label-container">
                <p className="label">Full Name</p>
            </div>
            <input 
                type="text" 
                placeholder="Enter your full name" 
                className="input"
                value={name}
                onChange={handleNameChange}
            />
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
            <div className="label-container">
                <p className="label">Confirm Password</p>
            </div>
            <input 
                type="password" 
                placeholder="Re-enter your password" 
                className="input" 
                value={conPassword}
                onChange={(e)=>setConPassword(e.target.value)}
            />
            <div className="error">
                {errorMessage}
            </div>
            <button className="signup-button" onClick={handleSignup}>
                SIGNUP
            </button>
            <div className="login-container">
                <p className="login-label">
                    Already have an account? <a href="/login" className="login-link">Login</a>.
                </p>
            </div>
        </div>
        </div>
    );
}