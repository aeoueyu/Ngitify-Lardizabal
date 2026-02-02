import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../styles/view-user/ViewDentistPage.module.css';
import { regions, provinces, cities, barangays } from '../../utils/addressData'; 

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

    const status = dentist.status || 'active';
    const isUnverified = !dentist.isVerified;
    const isInactive = status === 'inactive';
    const isEditDisabled = isUnverified || isInactive;

    // --- HELPERS ---
    const getRegionName = (code) => regions.find(r => r.code === code)?.name || code || 'N/A';
    const getProvinceName = (code) => {
        if (!code) return 'N/A';
        for (const key in provinces) {
            const found = provinces[key].find(p => p.code === code);
            if (found) return found.name;
        }
        return code; 
    };
    const getCityName = (code) => {
        if (!code) return 'N/A';
        for (const key in cities) {
            const found = cities[key].find(c => c.code === code);
            if (found) return found.name;
        }
        return code;
    };
    const getBarangayName = (code) => {
        if (!code) return 'N/A';
        for (const key in barangays) {
            const found = barangays[key].find(b => b.code === code);
            if (found) return found.name;
        }
        return code;
    };

    const renderReadOnlyAddressFields = (address, title) => {
        if (!address) return null;
        return (
            <div className={styles.addressSection}>
                <h3 className={styles.sectionTitle}>{title}</h3>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>REGION</label>
                        <div className={styles.readOnlyField}>{getRegionName(address.region)}</div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>PROVINCE</label>
                        <div className={styles.readOnlyField}>{getProvinceName(address.province)}</div>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>CITY / MUNICIPALITY</label>
                        <div className={styles.readOnlyField}>{getCityName(address.city)}</div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>BARANGAY</label>
                        <div className={styles.readOnlyField}>{getBarangayName(address.barangay)}</div>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>STREET</label>
                        <div className={styles.readOnlyField}>{address.street || 'N/A'}</div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>HOUSE NO.</label>
                        <div className={styles.readOnlyField}>{address.houseNumber || 'N/A'}</div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                
                {/* --- UPDATED HEADER (Text Left, Buttons Right) --- */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <h2>Dentist Profile</h2>
                        <p>View dentist's personal and professional details.</p>
                    </div>
                    
                    <div className={styles.headerButtons}>
                        <button className={`${styles.actionBtn} ${styles.backBtn}`} onClick={() => navigate(-1)}>
                            BACK
                        </button>
                        <button 
                            className={`${styles.actionBtn} ${styles.editBtn}`} 
                            onClick={() => navigate(`/owner/edit-dentist/${id}`)}
                            disabled={isEditDisabled}
                            style={{ opacity: isEditDisabled ? 0.5 : 1, cursor: isEditDisabled ? 'not-allowed' : 'pointer' }}
                        >
                            EDIT PROFILE
                        </button>
                    </div>
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
                        <label>FIRST NAME</label>
                        <div className={styles.readOnlyField}>{dentist.name?.first || 'N/A'}</div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>MIDDLE NAME</label>
                        <div className={styles.readOnlyField}>{dentist.name?.middle || ''}</div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>LAST NAME</label>
                        <div className={styles.readOnlyField}>{dentist.name?.last || 'N/A'}</div>
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>BIRTHDATE</label>
                        <div className={styles.readOnlyField}>
                            {dentist.birthdate ? new Date(dentist.birthdate).toLocaleDateString() : 'N/A'}
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>LICENSE NO.</label>
                        <div className={styles.readOnlyField}>{dentist.licenseNumber || 'N/A'}</div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>SPECIALIZATION</label>
                        <div className={styles.readOnlyField}>{dentist.specialization || 'N/A'}</div>
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>EMAIL ADDRESS</label>
                        <div className={styles.readOnlyField}>{dentist.email}</div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>PHONE NUMBER</label>
                        <div className={styles.readOnlyPhoneGroup}>
                            <span className={styles.phonePrefix}>+63</span>
                            <div className={styles.phoneValue}>
                                {dentist.contactNumber ? dentist.contactNumber.replace('+63', '') : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.divider}></div>

                {renderReadOnlyAddressFields(dentist.currentAddress, 'Current Address')}
                <div className={styles.divider}></div>
                {renderReadOnlyAddressFields(dentist.permanentAddress, 'Permanent Address')}

                <div className={styles.divider}></div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>ACCOUNT STATUS</label>
                        <div className={styles.readOnlyField} style={{ 
                            color: status === 'active' ? '#2e7d32' : '#c62828',
                            fontWeight: 'bold',
                            backgroundColor: status === 'active' ? '#e8f5e9' : '#ffebee',
                            textAlign: 'center',
                            width: 'fit-content',
                            padding: '10px 20px'
                        }}>
                            {status.toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}