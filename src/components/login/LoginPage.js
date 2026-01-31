import React, { useState, useEffect } from 'react';
import styles from '../../styles/login/LoginPage.module.css';
import logo from '../../assets/logo-greenpink.svg';
// import bgElement from '../../assets/bg-element.svg'; 
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    // Kunin ang role galing sa Role Selection Page
    const userRole = location.state?.userRole;

    // Redirect pabalik kung walang role na napili
    useEffect(() => {
        if (!userRole) {
            navigate('/role-selection');
        }
    }, [userRole, navigate]);

    const handleLogin = async () => {
        // Simple validation
        if(!email || !password) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email, 
                    password, 
                    role: userRole 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setErrorMessage('');
                
                // --- DITO ANG PAGBABAGO ---
                // Wala nang OTP redirect. Diretso na sa Dashboard base sa role.
                // Siguraduhin na meron kang routes para sa mga paths na ito sa App.js
                
                switch(userRole) {
                    case 'Owner':
                        navigate('/owner/dashboard'); 
                        break;
                    case 'Dentist':
                        navigate('/dentist/dashboard');
                        break;
                    case 'Staff':
                        navigate('/staff/dashboard');
                        break;
                    case 'Patient':
                        navigate('/patient/dashboard');
                        break;
                    default:
                        navigate('/'); // Fallback
                }

            } else {
                // Kung sakaling "Account not activated" ang error mula sa backend,
                // pwede tayong maglagay ng logic dito para papuntahin sila sa Activation Page.
                setErrorMessage(data.message || 'Invalid credentials');
            }
        } catch (err) {
            setErrorMessage('Cannot connect to server.');
        }
    };

    // GRAMMAR FIX: 'an' Owner vs 'a' Dentist/Staff/Patient
    const article = userRole === 'Owner' ? 'an' : 'a';

    return (
        <div className={styles['main-container']}>
            
            <div className={styles['container']}>
                <img src={logo} alt='Lardizabal Dental Clinic' className={styles['logo']} />
                
                <div className={styles['header-text']}>
                    <h2>Login as <span className={styles['pink-text']}>{userRole || 'User'}</span></h2>
                </div>

                <div className={styles['form-group']}>
                    <label className={styles['label']}>EMAIL ADDRESS</label>
                    <input
                        type='email' 
                        placeholder='Enter your email' 
                        className={styles['input-field']}
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />
                </div>

                <div className={styles['form-group']}>
                    <label className={styles['label']}>PASSWORD</label>
                    <input
                        type='password'
                        placeholder='Enter your password'
                        className={styles['input-field']}
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    {/* Ito na lang ang gagamit ng OTP/Email verification */}
                    <a href='/forgot-password' className={styles['forgotpass-link']}>Forgot Password?</a>
                </div>

                <div className={styles.error}>
                    {errorMessage}
                </div>

                <button className={styles['login-button']} onClick={handleLogin}>
                    LOGIN
                </button>

                <div className={styles['change-role']}>
                    Not {article} {userRole}? <span onClick={() => navigate('/role-selection')}>Change Role</span>
                </div>
            </div>
        </div>
    );
}