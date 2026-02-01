import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from '../../styles/view-user/ViewPatientPage.module.css';

export default function ViewPatientPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [patient, setPatient] = useState(null);

    const currentPath = location.pathname.split('/')[1];

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/user/${id}`);
                const data = await res.json();
                if (res.ok) setPatient(data);
            } catch (err) { console.error(err); }
        };
        fetchUser();
    }, [id]);

    if (!patient) return <div className={styles.container}>Loading...</div>;

    const fullName = patient.name ? `${patient.name.first} ${patient.name.middle || ''} ${patient.name.last}` : 'N/A';
    const status = patient.status || 'active';
    
    // Logic: Disable Edit if Inactive OR Unverified
    const isUnverified = !patient.isVerified;
    const isInactive = status === 'inactive';
    const isEditDisabled = isUnverified || isInactive;

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <div className={styles.header}>
                    <h2>Patient Profile</h2>
                    <p>View patient records and personal information.</p>
                </div>

                <div className={styles.uploadSection}>
                    <div className={styles.imageWrapper}>
                        {patient.profileImage ? (
                            <img src={patient.profileImage} alt="Profile" className={styles.previewImage} />
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
                            {patient.birthdate ? new Date(patient.birthdate).toLocaleDateString() : 'N/A'}
                        </div>
                    </div>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.sectionTitle}>Contact Details</div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <div className={styles.readOnlyField}>{patient.email}</div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Phone Number</label>
                        <div className={styles.readOnlyField}>{patient.contactNumber || 'N/A'}</div>
                    </div>
                </div>

                <div className={styles.addressSection}>
                    <div className={styles.formGroup}>
                        <label>Current Address</label>
                        <div className={styles.readOnlyField}>
                            {patient.currentAddress ? 
                                `${patient.currentAddress.street}, ${patient.currentAddress.barangay}, ${patient.currentAddress.city}, ${patient.currentAddress.province}` : 
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
                        onClick={() => navigate(`/${currentPath}/edit-patient/${id}`)}
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