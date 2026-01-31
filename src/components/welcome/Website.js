import React from 'react';
import styles from '../../styles/welcome/Website.module.css';
import logo from '../../assets/logo-greenpink.svg';
import backgroundImage from '../../assets/welcome/background1.svg';
import { useNavigate } from 'react-router-dom';

export default function Website() {
    const navigate = useNavigate();

    return (
        <div className={styles['main-container']}>
            <nav className={styles['top-bar']}>
                <div className={styles['logo-container']}>
                    <img src={logo} alt='NgitiFy Logo' className={styles['logo']} />
                </div>

                <div className={styles['nav-links']}>
                    <a href="#home" className={styles['nav-item']}>Home</a>
                    <a href="#about" className={styles['nav-item']}>About</a>
                    <a href="#services" className={styles['nav-item']}>Services</a>
                    <a href="#client" className={styles['nav-item']}>Client</a>
                    <a href="#locations" className={styles['nav-item']}>Locations</a>
                    <a href="#contact" className={styles['nav-item']}>Contact Us</a>
                </div>

                <div className={styles['auth-buttons']}>
                    <button className={styles['login-btn']} onClick={() => navigate('/role-selection')}>
                        LOGIN
                    </button>
                </div>
            </nav>

            <div className={styles['content-wrapper']}>
                {/* Background Image Layer */}
                <img src={backgroundImage} alt="Dental Care" className={styles['bg-image']} />
                
                {/* Content Layer */}
                <div className={styles['hero-container']}>
                    <div className={styles['intro-section']}>
                        <h2 className={styles['intro-subtitle']}>
                            AFFORDABLE <span className={styles['pink-text']}>SMILES?</span> ALWAYS.
                        </h2>
                        <p className={styles['intro-description']}>
                            A healthy, confident smile should never come with a heavy price tag. 
                            At <strong>Lardizabal Dental Clinic</strong>, we believe in providing professional, 
                            quality, and affordable care for every patient.
                        </p>
                        <button className={styles['visit-btn']}>
                            VISIT NOW
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}