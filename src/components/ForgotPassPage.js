import React , { useRef, useState } from 'react';
import styles from '../styles/ForgotPassPage.module.css';
import logo from '../assets/logo-greenpink.svg';
import googlelogo from '../assets/google-logo.png';
import bgElement from '../assets/bg-element.svg'
import { useNavigate } from 'react-router-dom';

export default function ForgotPassPage() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleForgotPass = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (response.ok) {
                navigate('/verification-code', { state: { email } });
            } else {
                setErrorMessage('Email not found.');
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div className={styles['main-container']}>
            <img src={logo} alt='Lardizabal Dental Clinic' className={styles['logo']}/>
            <img src={bgElement} alt='background element' className={styles['bg-element']}/>
            <div className={styles['container']}>
                <div className={styles['page-title']}>
                    <p className={styles['forgotpass-title']}>Forgot Password?</p>
                </div>
                <div className={styles['page-header']}>
                    <p>Please enter your email to receive a <strong>confirmation code</strong> to set a new password.</p>
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
                <div className={styles.error}>
                    {errorMessage}
                </div>
                <button className={styles['enter-button']} onClick={handleForgotPass}>
                    ENTER
                </button>
            </div>
        </div>
    )
}