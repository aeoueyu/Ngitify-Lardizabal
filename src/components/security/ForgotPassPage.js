import React, { useState } from 'react';
import styles from '../../styles/security/ForgotPassPage.module.css'; 
import logo from '../../assets/logo-greenpink.svg';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassPage() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleForgotPass = async () => {
        try {
            const cleanEmail = email.trim(); // FIX: Trim spaces
            const response = await fetch('http://localhost:5000/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: cleanEmail }),
            });
            if (response.ok) {
                navigate('/verification-code', { state: { email: cleanEmail } });
            } else {
                setErrorMessage('Email not found.');
            }
        } catch (err) { console.error(err); setErrorMessage("Server error."); }
    };

    return (
        <div className={styles['main-container']}>
            <img src={logo} alt='Lardizabal Dental Clinic' className={styles['logo']}/>
            <div className={styles['container']}>
                <div className={styles['page-title']}>
                    <p className={styles['forgotpass-title']}>Forgot Password?</p>
                </div>
                <div className={styles['page-header']}>
                    <p>Please enter your email to receive a <strong>confirmation code</strong>.</p>
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
                <div className={styles.error}>{errorMessage}</div>
                <button className={styles['enter-button']} onClick={handleForgotPass}>
                    ENTER
                </button>

                {/* ADDED: Back Link */}
                <div className={styles['back-container']}>
                    <span onClick={() => navigate('/login')}>Back to Login</span>
                </div>
            </div>
        </div>
    )
}