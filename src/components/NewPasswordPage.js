import React , { useEffect, useState }from "react";
import styles from '../styles/NewPasswordPage.module.css';
import logo from '../assets/logo-greenpink.svg';
import googlelogo from '../assets/google-logo.png';
import bgElement from '../assets/bg-element.svg';
import { useNavigate, useLocation } from "react-router-dom";

export default function NewPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [passStrength, setPassStrength] = useState('');

    const userEmail = location.state?.email;

    const isButtonDisabled = !newPassword || 
                            newPassword !== confirmNewPassword || 
                            passStrength === 'WEAK' || 
                            newPassword.length === 0;

    useEffect(()=>{
        if (newPassword || confirmNewPassword) {
            if (newPassword !== confirmNewPassword) {
                setErrorMessage('Passwords do not match.');
            }
            else {
                setErrorMessage('');
            }

            if (newPassword.length === 0) {
                setPassStrength('');
            }
            else if (newPassword.length < 6) {
                setPassStrength('WEAK');
            }
            else if (newPassword.length >= 6 && /[0-9]/.test(newPassword) && /[A-Z]/.test(newPassword)) {
                setPassStrength('STRONG');
            }
            else {
                setPassStrength('MODERATE');
            }
        }
    }, [newPassword,confirmNewPassword]);

    const handleReset = async () => {
        const response = await fetch('http://localhost:5000/api/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: location.state.email, password: newPassword }),
        });
    
        if (response.ok) {
            navigate('/new-password-redirect');
        }
    };

    return (
        <div className={styles['main-container']}>
            <img src={logo} alt='Lardizabal Dental Clinic' className={styles.logo}/>
            <img src={bgElement} alt='background element' className={styles['bg-element']}/>
            <div className={styles['container']}>
                <div className={styles['page-title']}>
                    <p className={styles['newpass-title']}>New Password</p>
                </div>
                <div className={styles['page-header']}>
                    <p>Please enter your new password.</p>
                </div>
                <div className={styles['label-container']}>
                    <p className={styles.label}>PASSWORD</p>
                </div>
                <input
                    type='password'
                    placeholder='Enter your new password'
                    className={styles['input-field']}
                    value={newPassword}
                    onChange={(e)=>setNewPassword(e.target.value)}
                />
                <div className={styles['label-container']}>
                    <p className={styles.label}>CONFIRM PASSWORD</p>
                </div>
                <input
                    type='password'
                    placeholder='Enter your new password'
                    className={styles['input-field']}
                    value={confirmNewPassword}
                    onChange={(e)=>setConfirmNewPassword(e.target.value)}
                />
                {passStrength && (
                    <span className={`${styles.strength} ${styles[passStrength.toLowerCase()]}`}>
                        {passStrength}
                    </span>
                )}
                <div className={styles.error}>
                    {errorMessage}
                </div>
                <button
                    className={styles['enter-button']}
                    onClick={handleReset}
                    disabled={isButtonDisabled}
                >
                    ENTER
                </button>
            </div>
        </div>
    )
}