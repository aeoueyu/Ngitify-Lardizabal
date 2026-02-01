import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../styles/view-user/ViewDentistPage.module.css';

export default function ViewDentistPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dentist, setDentist] = useState(null);

    useEffect(() => {
        const fetchDentist = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/user/${id}`);
                const data = await res.json();
                if (res.ok) setDentist(data);
            } catch (err) { console.error(err); }
        };
        fetchDentist();
    }, [id]);

    if (!dentist) return <div className={styles.container}>Loading...</div>;

    const fullName = dentist.name ? `${dentist.name.first} ${dentist.name.middle || ''} ${dentist.name.last}` : 'N/A';
    const status = dentist.status || 'active';
    
    // Logic: Disable Edit if Inactive OR Unverified
    const isUnverified = !dentist.isVerified;
    const isInactive = status === 'inactive';
    const isEditDisabled = isUnverified || isInactive;

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <div className={styles.header}>
                    <h2>Dentist Profile</h2>
                    <p>View dentist information.</p>
                </div>

                <div className={styles.uploadSection}>
                    <div className={styles.imageWrapper}>
                        {dentist.profileImage ? (
                            <img src={dentist.profileImage} alt="Profile" className={styles.previewImage} />
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
                        <label>License Number</label>
                        <div className={styles.readOnlyField}>{dentist.licenseNumber || 'N/A'}</div>
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Specialization</label>
                        <div className={styles.readOnlyField}>{dentist.specialization || 'General Dentistry'}</div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Birthdate</label>
                        <div className={styles.readOnlyField}>
                            {dentist.birthdate ? new Date(dentist.birthdate).toLocaleDateString() : 'N/A'}
                        </div>
                    </div>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.sectionTitle}>Contact Details</div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <div className={styles.readOnlyField}>{dentist.email}</div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Phone Number</label>
                        <div className={styles.readOnlyField}>{dentist.contactNumber || 'N/A'}</div>
                    </div>
                </div>

                <div className={styles.addressSection}>
                    <div className={styles.formGroup}>
                        <label>Current Address</label>
                        <div className={styles.readOnlyField}>
                            {dentist.currentAddress ? 
                                `${dentist.currentAddress.street}, ${dentist.currentAddress.barangay}, ${dentist.currentAddress.city}, ${dentist.currentAddress.province}` : 
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
                        onClick={() => navigate(`/owner/edit-dentist/${id}`)}
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