import React from 'react';
import styles from '../../styles/login/RoleSelectionPage.module.css'; // Siguraduhin na tama ang path
import logo from '../../assets/logo-greenpink.svg';
import bgElement from '../../assets/bg-element.svg'; // Optional: kung gusto mo may background element
import { useNavigate } from 'react-router-dom';

export default function RoleSelectionPage() {
    const navigate = useNavigate();

    // Function para pumunta sa Login Page bitbit ang role
    const handleRoleSelect = (role) => {
        // Ipapasa natin yung role sa state kung sakaling kailanganin mo sa backend mamaya
        navigate('/login', { state: { userRole: role } });
    };

    return (
        <div className={styles['main-container']}>
            <div className={styles['container']}>
            <img src={logo} alt='Lardizabal Dental Clinic' className={styles['logo']} />
                <div className={styles['header-text']}>
                    <h2>Please select your <span className={styles['pink-text']}>ROLE</span></h2>
                </div>
                <div className={styles['role-grid']}>
                    <button className={styles['role-btn']} onClick={() => handleRoleSelect('Owner')}>
                        OWNER
                    </button>
                    <button className={styles['role-btn']} onClick={() => handleRoleSelect('Dentist')}>
                        DENTIST
                    </button>
                    <button className={styles['role-btn']} onClick={() => handleRoleSelect('Staff')}>
                        STAFF
                    </button>
                    <button className={styles['role-btn']} onClick={() => handleRoleSelect('Patient')}>
                        PATIENT
                    </button>
                </div>

                <div className={styles['back-link']}>
                    <p onClick={() => navigate('/')}>Back to Home</p>
                </div>
            </div>
        </div>
    );
}