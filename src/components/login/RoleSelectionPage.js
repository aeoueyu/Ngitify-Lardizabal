import React, { useState } from 'react';
import styles from '../../styles/login/RoleSelectionPage.module.css';
import logo from '../../assets/logo-greenpink.svg';
// import bgElement from '../../assets/bg-element.svg'; // Optional background
import { useNavigate } from 'react-router-dom';

// Import Icons
import ownerIcon from '../../assets/icons/owner.svg';
import ownerHover from '../../assets/icons/owner-hover.svg';
import dentistIcon from '../../assets/icons/dentist.svg';
import dentistHover from '../../assets/icons/dentist-hover.svg';
import staffIcon from '../../assets/icons/staff.svg';
import staffHover from '../../assets/icons/staff-hover.svg';
import patientIcon from '../../assets/icons/patient.svg';
import patientHover from '../../assets/icons/patient-hover.svg';

export default function RoleSelectionPage() {
    const navigate = useNavigate();
    const [hoveredRole, setHoveredRole] = useState(null); // Track natin kung alin ang hino-hover

    const handleRoleSelect = (role) => {
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
                    {/* OWNER BUTTON */}
                    <button 
                        className={styles['role-btn']} 
                        onClick={() => handleRoleSelect('Owner')}
                        onMouseEnter={() => setHoveredRole('Owner')}
                        onMouseLeave={() => setHoveredRole(null)}
                    >
                        <img 
                            src={hoveredRole === 'Owner' ? ownerHover : ownerIcon} 
                            alt="Owner" 
                            className={styles['role-icon']}
                        />
                        <span>OWNER</span>
                    </button>

                    {/* DENTIST BUTTON */}
                    <button 
                        className={styles['role-btn']} 
                        onClick={() => handleRoleSelect('Dentist')}
                        onMouseEnter={() => setHoveredRole('Dentist')}
                        onMouseLeave={() => setHoveredRole(null)}
                    >
                        <img 
                            src={hoveredRole === 'Dentist' ? dentistHover : dentistIcon} 
                            alt="Dentist" 
                            className={styles['role-icon']}
                        />
                        <span>DENTIST</span>
                    </button>

                    {/* STAFF BUTTON */}
                    <button 
                        className={styles['role-btn']} 
                        onClick={() => handleRoleSelect('Staff')}
                        onMouseEnter={() => setHoveredRole('Staff')}
                        onMouseLeave={() => setHoveredRole(null)}
                    >
                        <img 
                            src={hoveredRole === 'Staff' ? staffHover : staffIcon} 
                            alt="Staff" 
                            className={styles['role-icon']}
                        />
                        <span>STAFF</span>
                    </button>

                    {/* PATIENT BUTTON */}
                    <button 
                        className={styles['role-btn']} 
                        onClick={() => handleRoleSelect('Patient')}
                        onMouseEnter={() => setHoveredRole('Patient')}
                        onMouseLeave={() => setHoveredRole(null)}
                    >
                        <img 
                            src={hoveredRole === 'Patient' ? patientHover : patientIcon} 
                            alt="Patient" 
                            className={styles['role-icon']}
                        />
                        <span>PATIENT</span>
                    </button>
                </div>

                <div className={styles['back-link']}>
                    <p onClick={() => navigate('/')}>Back to Home</p>
                </div>
            </div>
        </div>
    );
}