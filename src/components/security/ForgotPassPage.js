import React, { useState , useEffect } from 'react';
import styles from '../../styles/security/ForgotPassPage.module.css'; 
import logo from '../../assets/logo-greenpink.svg';
import { useNavigate , useLocation } from 'react-router-dom';

export default function ForgotPassPage() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [errorMessage, setErrorMessage] = useState('');

    // Kunin ang role mula sa login page
    const userRole = location.state?.userRole;

    useEffect(() => {
        if (!userRole) {
            navigate('/role-selection');
        }
    }, [userRole, navigate]);

    const handleForgotPass = async () => {
        try {
            const cleanEmail = email.trim();
            const response = await fetch('http://localhost:5000/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: cleanEmail,
                    role: userRole.toLowerCase() // Ipadala ang role sa backend
                }),
            });
            if (response.ok) {
                navigate('/verification-code', { state: { email: cleanEmail } });
            } else {
                // Lalabas ito kung tama ang email pero mali ang role sa database
                setErrorMessage('User not found.'); 
            }
        } catch (err) { 
            console.error(err); 
            setErrorMessage("Server error."); 
        }
    };

    return (
        <div className={styles['main-container']}>
            <div className={styles['container']}>
                <img src={logo} alt='Lardizabal Dental Clinic' className={styles['logo']}/>
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