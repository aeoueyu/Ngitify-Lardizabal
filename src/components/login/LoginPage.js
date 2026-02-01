import React, { useState, useEffect } from 'react';
import styles from '../../styles/login/LoginPage.module.css';
import logo from '../../assets/logo-greenpink.svg';
// import bgElement from '../../assets/bg-element.svg'; 
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const selectedRole = location.state?.role || 'owner';

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

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email, 
                    password,
                    role: selectedRole // PASS THE ROLE TO BACKEND
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Login Success
                localStorage.setItem('token', data.token);
                // Redirect based on role
                if (data.role === 'owner') navigate('/owner/dashboard');
                else if (data.role === 'dentist') navigate('/dentist/dashboard');
                else if (data.role === 'secretary') navigate('/secretary/dashboard');
                else if (data.role === 'patient') navigate('/patient/dashboard');
            } else {
                // Show Error (e.g., "Access denied" or "Invalid email")
                alert(data.message);
            }
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    // Grammar fix for "a" vs "an"
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
                    {/* Disable muna forgot pass para kay Admin, pero active sa iba kung may backend logic ka na */}
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