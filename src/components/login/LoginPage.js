import React, { useState, useEffect } from 'react';
import styles from '../../styles/login/LoginPage.module.css';
import logo from '../../assets/logo-greenpink.svg';
// import bgElement from '../../assets/bg-element.svg'; 
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation(); // 1. Initialize muna bago gamitin

    // 2. Kunin ang role nang ligtas. 
    // Default to 'Owner' kung walang laman para hindi mag-crash, 
    // pero ireredirect din naman ng useEffect sa baba kung invalid.
    const userRole = location.state?.userRole || location.state?.role;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // 3. Redirect pabalik sa Role Selection kung walang role na napili
    useEffect(() => {
        if (!userRole) {
            navigate('/role-selection');
        }
    }, [userRole, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage(""); // Clear previous errors
        
        try {
            // Convert display role (e.g., "Owner") to backend role (e.g., "owner")
            const backendRole = userRole ? userRole.toLowerCase() : 'owner';

            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email, 
                    password,
                    role: backendRole // PASS THE LOWERCASE ROLE TO BACKEND
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Login Success
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role); // Save role for future checks
                localStorage.setItem('userId', data.userId);

                // Redirect based on role returned by backend
                if (data.role === 'owner') navigate('/owner/dashboard');
                else if (data.role === 'dentist') navigate('/dentist/dashboard');
                else if (data.role === 'secretary') navigate('/secretary/dashboard');
                else if (data.role === 'patient') navigate('/patient/dashboard');
            } else {
                // Show Error
                setErrorMessage(data.message);
            }
        } catch (error) {
            console.error("Login failed", error);
            setErrorMessage("Cannot connect to server.");
        }
    };

    // Grammar fix for "a" vs "an"
    const displayRole = userRole || 'User';
    const article = displayRole === 'Owner' ? 'an' : 'a';

    return (
        <div className={styles['main-container']}>
            <div className={styles['container']}>
                <img src={logo} alt='Lardizabal Dental Clinic' className={styles['logo']} />
                
                <div className={styles['header-text']}>
                    <h2>Login as <span className={styles['pink-text']}>{displayRole}</span></h2>
                </div>

                <div className={styles['form-group']}>
                    <label className={styles['label']}>EMAIL ADDRESS</label>
                    <input
                        type='email' 
                        placeholder='Enter your email' 
                        className={styles['input-field']}
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        required
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
                        required
                    />
                    <span 
                        onClick={() => navigate('/forgot-password', { state: { userRole } })} 
                        className={styles['forgotpass-link']}
                        style={{cursor: 'pointer'}}
                    >
                        Forgot Password?
                    </span>
                </div>

                {/* Error Message Display */}
                {errorMessage && (
                    <div className={styles.error}>
                        {errorMessage}
                    </div>
                )}

                <button className={styles['login-button']} onClick={handleLogin}>
                    LOGIN
                </button>

                <div className={styles['change-role']}>
                    Not {article} {displayRole}? <span onClick={() => navigate('/role-selection')}>Change Role</span>
                </div>
            </div>
        </div>
    );
}