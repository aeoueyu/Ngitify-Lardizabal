import React, { useState } from 'react';
import styles from '../../styles/settings/AccountSettingsPage.module.css';

export default function AccountSettingsPage() {
    const [formData, setFormData] = useState({
        firstName: 'Juan',
        middleName: 'Dela',
        lastName: 'Cruz',
        email: 'juan.delacruz@example.com',
        phone: '9123456789',
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Updated data:', formData);
        setIsEditing(false);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Account Settings</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.profileHeader}>
                    <img src="/path/to/default-profile.png" alt="Profile" className={styles.profileImage} />
                    <div className={styles.profileInfo}>
                        <h2>{`${formData.firstName} ${formData.lastName}`}</h2>
                        <p>{formData.email}</p>
                    </div>
                </div>

                <div className={styles.formSection}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} disabled={!isEditing} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="middleName">Middle Name</label>
                        <input type="text" id="middleName" name="middleName" value={formData.middleName} onChange={handleInputChange} disabled={!isEditing} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} disabled={!isEditing} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="phone">Phone Number</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} disabled={!isEditing} />
                    </div>
                </div>

                <div className={styles.buttonGroup}>
                    {isEditing ? (
                        <>
                            <button type="submit" className={styles.saveButton}>Save Changes</button>
                            <button type="button" className={styles.cancelButton} onClick={handleEditToggle}>Cancel</button>
                        </>
                    ) : (
                        <button type="button" className={styles.editButton} onClick={handleEditToggle}>Edit Profile</button>
                    )}
                </div>
            </form>
        </div>
    );
}
