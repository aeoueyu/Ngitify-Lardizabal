import React, { useEffect, useState } from 'react';
import styles from '../styles/NewPasswordRedirectPage.module.css';
import logo from '../assets/logo-greenpink.svg';
import bgElement from '../assets/bg-element.svg';
import { useNavigate } from 'react-router-dom';

export default function NewPasswordRedirectPage() {
    const [seconds, setSeconds] = useState(3);
    const navigate = useNavigate();

    useEffect(()=>{
        if (seconds > 0) {
            const timer = setTimeout(()=>setSeconds(seconds - 1), 1000);
            return()=>clearTimeout(timer);
        }
        else {
            navigate('/login');
        }
    }, [seconds, navigate]);

    return (
        <div className={styles['main-container']}>
            <img src={logo} alt='Lardizabal Dental Clinic' className={styles['logo']}/>
            <img src={bgElement} alt='background element' className={styles['bg-element']}/>
            <div className={styles['container']}>
                <div className={styles['page-title']}>
                    <p>Password has been updated successfully.</p>
                </div>
                <div className={styles['page-header']}>
                    <p>Redirecting to Login Page in <strong>{seconds}</strong> {seconds === 1 ? 'second' : 'seconds'}...</p>
                </div>
            </div>
        </div>
    )
}