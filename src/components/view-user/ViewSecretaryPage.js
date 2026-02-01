import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../styles/view-user/ViewSecretaryPage.module.css';

export default function ViewSecretaryPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [secretary, setSecretary] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/user/${id}`);
                const data = await res.json();
                if (res.ok) setSecretary(data);
            } catch (err) { console.error(err); }
        };
        fetchUser();
    }, [id]);

    if (!secretary) return <div className={styles.container}>Loading...</div>;

    const fullName = secretary.name ? `${secretary.name.first} ${secretary.name.middle || ''} ${secretary.name.last}` : 'N/A';
    const status = secretary.status || 'active';
    
    // Logic: Disable Edit if Inactive OR Unverified
    const isUnverified = !secretary.isVerified;
    const isInactive = status === 'inactive';
    const isEditDisabled = isUnverified || isInactive;

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <div className={styles.header}>
                    <h2>Secretary Profile</h2>
                    <p>View secretary details.</p>
                </div>

                <div className={styles.uploadSection}>
                    <div className={styles.imageWrapper}>
                        {secretary.profileImage ? (
                            <img src={secretary.profileImage} alt="Profile" className={styles.previewImage} />
                        ) : (
                            <div className={styles.uploadPlaceholder}>No Image</div>
                        )}
                    </div>
                </div>

                <div className={styles.mainSectionTitle}>Personal Information</div>
                
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Full Name</label>
                        <div className={styles.readOnlyField}>{fullName}</div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Birthdate</label>
                        <div className={styles.readOnlyField}>
                            {secretary.birthdate ? new Date(secretary.birthdate).toLocaleDateString() : 'N/A'}
                        </div>
                    </div>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.sectionTitle}>Contact Details</div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <div className={styles.readOnlyField}>{secretary.email}</div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Phone Number</label>
                        <div className={styles.readOnlyField}>{secretary.contactNumber || 'N/A'}</div>
                    </div>
                </div>

                <div className={styles.addressSection}>
                    <div className={styles.formGroup}>
                        <label>Current Address</label>
                        <div className={styles.readOnlyField}>
                            {secretary.currentAddress ? 
                                `${secretary.currentAddress.street}, ${secretary.currentAddress.barangay}, ${secretary.currentAddress.city}, ${secretary.currentAddress.province}` : 
                                'N/A'}
                        </div>
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Account Status</label>
                        <div className={styles.readOnlyField} style={{ 
                            color: status === 'active' ? '#2e7d32' : '#c62828',
                            fontWeight: 'bold',
                            backgroundColor: status === 'active' ? '#e8f5e9' : '#ffebee'
                        }}>
                            {status.toUpperCase()}
                        </div>
                    </div>
                </div>

                <div className={styles.buttonGroup}>
                    <button className={`${styles.actionBtn} ${styles.backBtn}`} onClick={() => navigate(-1)}>
                        Back
                    </button>
                    <button 
                        className={`${styles.actionBtn} ${styles.editBtn}`} 
                        onClick={() => navigate(`/owner/edit-secretary/${id}`)}
                        disabled={isEditDisabled}
                        style={{ opacity: isEditDisabled ? 0.5 : 1, cursor: isEditDisabled ? 'not-allowed' : 'pointer' }}
                    >
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
}