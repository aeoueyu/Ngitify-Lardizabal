import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Siguraduhing tama ang path papunta sa bagong CSS file
import styles from '../../styles/email-activation/ActivateAccountPage.module.css'; 
import logo from '../../assets/logo-greenpink.svg'; 
import successIcon from '../../assets/alert-icons/success.svg';
import errorIcon from '../../assets/alert-icons/warning.svg';

export default function ActivateAccountPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('Verifying your activation token...');
    
    // Prevent double-fetch in React Strict Mode
    const dataFetchedRef = useRef(false);

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        const activateAccount = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/activate-account', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setMessage('Your account has been successfully activated!');
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Activation failed.');
                }
            } catch (error) {
                setStatus('error');
                setMessage('Server connection error. Please try again later.');
            }
        };

        if (token) {
            activateAccount();
        } else {
            setStatus('error');
            setMessage('Invalid activation link.');
        }
    }, [token]);

    return (
        <div className={styles['main-container']}>
            <div className={styles['container']}>
                <img src={logo} alt="NgitiFy Logo" className={styles.logo} />
                
                <h2 className={styles.title}>Account Activation</h2>

                <div className={styles.content}>
                    {status === 'loading' && (
                        <p className={styles.message}>{message}</p>
                    )}

                    {status === 'success' && (
                        <>
                            <img src={successIcon} alt="Success" className={styles.statusIcon} />
                            <p className={`${styles.message} ${styles.successMsg}`}>{message}</p>
                            <button 
                                onClick={() => navigate('/login')} 
                                className={styles.actionBtn}
                            >
                                GO TO LOGIN
                            </button>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <img src={errorIcon} alt="Error" className={styles.statusIcon} />
                            <p className={`${styles.message} ${styles.errorMsg}`}>{message}</p>
                            <button 
                                onClick={() => navigate('/login')} 
                                className={`${styles.actionBtn} ${styles.secondary}`}
                            >
                                BACK TO LOGIN
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}