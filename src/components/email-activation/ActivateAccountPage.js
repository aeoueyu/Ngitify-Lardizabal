import React, { useEffect, useState, useRef } from 'react'; // <-- Import useRef
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../styles/login/LoginPage.module.css'; 
import logo from '../../assets/logo-greenpink.svg'; 
import successIcon from '../../assets/alert-icons/success.svg';
import errorIcon from '../../assets/alert-icons/warning.svg';

export default function ActivateAccountPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('Activating your account...');
    
    // FIX: Gamitin ito para ma-track kung natatawag na ang API
    const dataFetchedRef = useRef(false);

    useEffect(() => {
        // Kung natatawag na ang API dati, wag na ituloy (prevent double call)
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
                    // Check kung "Invalid" baka na-activate na sa unang attempt
                    // Pero sa logic na ito, safe na tayo dahil sa useRef blocker sa taas
                    setStatus('error');
                    setMessage(data.message || 'Activation failed.');
                }
            } catch (error) {
                setStatus('error');
                setMessage('Server connection error.');
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
        <div className={styles.container}>
            <div className={styles.loginCard} style={{ textAlign: 'center', padding: '40px' }}>
                <img src={logo} alt="NgitiFy Logo" className={styles.logo} style={{ margin: '0 auto 20px' }} />
                
                <h2 style={{ color: '#005466', marginBottom: '20px' }}>Account Activation</h2>

                {status === 'loading' && <p>Verifying your activation token...</p>}

                {status === 'success' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                        <img src={successIcon} alt="Success" style={{ width: '60px' }} />
                        <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>
                        <button 
                            onClick={() => navigate('/')} 
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#005466',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginTop: '10px'
                            }}
                        >
                            Go to Login
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                        <img src={errorIcon} alt="Error" style={{ width: '60px' }} />
                        <p style={{ color: 'red', fontWeight: 'bold' }}>{message}</p>
                        <button 
                            onClick={() => navigate('/')} 
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#ccc',
                                color: '#333',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginTop: '10px'
                            }}
                        >
                            Back to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}