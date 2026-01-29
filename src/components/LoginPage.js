import React , { useState } from 'react';
import styles from '../styles/LoginPage.module.css';
import logo from '../assets/logo-greenpink.svg';
import googlelogo from '../assets/google-logo.png';
import bgElement from '../assets/bg-element.svg'
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const [errorMessage,setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleLogin = async ()=>{
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setErrorMessage('');
                navigate('/otp', { state: { email: email } });
            }
            else {
                setErrorMessage(data.message);
            }
        }
        catch (err) {
            setErrorMessage('Cannot connect to server.');
        }
    };


    return (
        <div className={styles['main-container']}>
            <img src={logo} alt='Lardizabal Dental Clinic' className={styles.logo}/>
            <img src={bgElement} alt='background element' className={styles['bg-element']}/>
            <div className={styles.container}>
                <div className={styles['page-title']}>
                    <p>LOGIN TO</p>
                    <p className={styles['ngitify-title']}>NGITIFY</p>
                </div>
                <div className={styles['label-container']}>
                    <p className={styles.label}>EMAIL</p>
                </div>
                <input
                    type='email' 
                    placeholder='Enter your email' 
                    className={styles['input-field']}
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
                <div className={styles['label-container']}>
                    <p className={styles.label}>PASSWORD</p>
                </div>
                <input
                    type='password'
                    placeholder='Enter your password'
                    className={styles['input-field']}
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <div className={styles['forgotpass-container']}>
                    <p className={styles['forgotpass-label']}><a href='/forgot-password'>FORGOT PASSWORD</a></p>
                </div>
                <div className={styles.error}>
                    {errorMessage}
                </div>
                <button className={styles['login-button']} onClick={handleLogin}>
                    LOGIN
                </button>
                <button className={styles['googlelogin-button']} onClick={handleLogin}>
                    <div className={styles['googlelogin-container']}>
                        <img src={googlelogo} className={styles['google-logo']}/>
                        <p className={styles['googlelogin-label']}>LOGIN WITH YOUR GOOGLE ACCOUNT</p>
                    </div>
                </button>
                <div className={styles['signup-container']}>
                    <p className={styles['signup-label']}>
                        Don't have an account yet? <a href='/signup' className={styles['signup-link']}>Sign up</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}