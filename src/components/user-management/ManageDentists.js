import React from 'react';
import styles from '../../styles/user-management/ManageDentists.module.css';
import addIcon from '../../assets/button-icons/add.svg'; // Siguraduhin na nandito na yung file
import { useNavigate } from 'react-router-dom';

export default function ManageDentists() {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            {/* Header Section */}
            <div className={styles.headerContainer}>
                <h1 className={styles.pageTitle}>Manage <span className={styles.highlight}>Dentists</span></h1>
                
                {/* Add Dentist Button */}
                <button 
                    className={styles.addButton} 
                    onClick={() => navigate('/owner/add-dentist')}
                >
                    <img src={addIcon} alt="Add" className={styles.addIcon} />
                    ADD DENTIST
                </button>
            </div>

            {/* Dito natin ilalagay ang Table sa susunod */}
            <div className={styles.contentPlaceholder}>
                <p>List of Dentists will appear here...</p>
            </div>
        </div>
    );
}