import React , { useState , useRef , useEffect } from 'react';
import styles from '../styles/OTP.module.css';
import logo from '../assets/logo-greenpink.svg';
import bgElement from '../assets/bg-element.svg';
import { useLocation , useNavigate } from 'react-router-dom';

export default function OTP() {
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [errorMessage, setErrorMessage] = useState('');
    const inputRefs = useRef([]);

    const location = useLocation();
    const navigate = useNavigate();
    const userEmail = location.state?.email || 'your email';

    const [resendTimer, setResendTimer] = useState(30);

    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);
    
    const handleResend = async (e) => {
        e.preventDefault();
        if (resendTimer > 0) return;

        setErrorMessage('');
    
        try {
            const response = await fetch('http://localhost:5000/api/resend-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail }),
            });
    
            if (response.ok) {
                setSuccessMessage('A new OTP has been sent to your email.')
                setResendTimer(30);
                setOtp(new Array(6).fill(''));
                inputRefs.current[0].focus();
            } else {
                setSuccessMessage('');
                setErrorMessage("Failed to resend OTP. Please try again");
            }
        } catch (err) {
            setSuccessMessage('');
            setErrorMessage("Connection error.");
        }
    };

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value.substring(element.value.length - 1);
        setOtp(newOtp);

        if (element.value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleEnter = async ()=>{
        const fullOtp = otp.join('');
        if (fullOtp.length < 6) {
            setSuccessMessage('');
            setErrorMessage('Please enter all 6 digits.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/verify-login-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail, otp: fullOtp }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('user', JSON.stringify(data.fullname));
                navigate('/home', { replace: true });
            }
            else {
                setSuccessMessage('');
                setErrorMessage(data.message);
            }
        }
        catch (err) {
            setSuccessMessage('');
            setErrorMessage('Connection error.');
        }
    };

    return (
        <div className={styles['main-container']}>
            <img src={logo} alt='Lardizabal Dental Clinic' className={styles['logo']}/>
            <img src={bgElement} alt='background element' className={styles['bg-element']}/>
            <div className={styles['container']}>
                <div className={styles['page-title']}>
                    <p>Enter</p>
                    <p className={styles['otp-title']}>6-digit OTP</p>
                </div>
                <div className={styles['page-header']}>
                    <p>We've sent a 6-digit to <strong>{userEmail}</strong>.</p>
                </div>
                <div className={styles['otp-field']}>
                    {otp.map((data, index) => (
                        <input
                            key={index}
                            type='text'
                            inputMode='numeric'
                            maxLength='1'
                            className={styles['otp-input']}
                            value={data}
                            ref={el => inputRefs.current[index] = el}
                            onChange={e => handleChange(e.target, index)}
                            onKeyDown={e => handleKeyDown(e, index)}
                        />
                    ))}
                </div>
                <div className={styles['message']}>
                    <div className={styles['success']}>
                        {successMessage}
                    </div>
                    <div className={styles['error']}>
                        {errorMessage}
                    </div>
                </div>
                <button className={styles['enter-button']} onClick={handleEnter}>
                    ENTER
                </button>
                <div className={styles['resend-container']}>
                    <p className={styles['resend-label']}>
                        Didn't get an OTP?{' '}
                        {resendTimer > 0 ? (
                            <span>Wait {resendTimer}s to resend.</span>
                        ) : (
                            <a 
                                href='#!'
                                onClick={handleResend} 
                                className={styles['click-resend']}
                            >
                                Click here to resend
                            </a>
                        )}
                    </p>
                </div>
            </div>
        </div>
    )
}