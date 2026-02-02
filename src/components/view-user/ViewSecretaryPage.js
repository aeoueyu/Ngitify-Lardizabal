import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../styles/view-user/ViewSecretaryPage.module.css';
// Import address data para ma-convert ang codes to names
import { regions, provinces, cities, barangays } from '../../utils/addressData';

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

    const status = secretary.status || 'active';
    
    // Logic: Disable Edit if Inactive OR Unverified
    const isUnverified = !secretary.isVerified;
    const isInactive = status === 'inactive';
    const isEditDisabled = isUnverified || isInactive;

    // --- HELPER SA PAGKUHA NG PANGALAN NG LUGAR ---
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

    // --- RENDER ADDRESS FIELDS (READ ONLY) ---
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
                
                {/* --- HEADER WITH BUTTONS --- */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <h2>Secretary Profile</h2>
                        <p>View secretary's personal and professional details.</p>
                    </div>
                    <div className={styles.headerButtons}>
                        <button className={`${styles.actionBtn} ${styles.backBtn}`} onClick={() => navigate(-1)}>
                            BACK
                        </button>
                        <button 
                            className={`${styles.actionBtn} ${styles.editBtn}`} 
                            onClick={() => navigate(`/owner/edit-secretary/${id}`)}
                            disabled={isEditDisabled}
                            style={{ opacity: isEditDisabled ? 0.5 : 1, cursor: isEditDisabled ? 'not-allowed' : 'pointer' }}
                        >
                            EDIT PROFILE
                        </button>
                    </div>
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
                
                {/* ROW 1: Names (3 Columns) */}
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>FIRST NAME</label>
                        <div className={styles.readOnlyField}>{secretary.name?.first || 'N/A'}</div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>MIDDLE NAME</label>
                        <div className={styles.readOnlyField}>{secretary.name?.middle || ''}</div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>LAST NAME</label>
                        <div className={styles.readOnlyField}>{secretary.name?.last || 'N/A'}</div>
                    </div>
                </div>

                {/* ROW 2: Birthdate & Phone (Side by Side matching AddSecretary) */}
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>BIRTHDATE</label>
                        <div className={styles.readOnlyField}>
                            {secretary.birthdate ? new Date(secretary.birthdate).toLocaleDateString() : 'N/A'}
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>PHONE NUMBER</label>
                        <div className={styles.readOnlyPhoneGroup}>
                            <span className={styles.phonePrefix}>+63</span>
                            <div className={styles.phoneValue}>
                                {secretary.contactNumber ? secretary.contactNumber.replace('+63', '') : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ROW 3: Email (Full Width) */}
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>EMAIL ADDRESS</label>
                        <div className={styles.readOnlyField}>{secretary.email}</div>
                    </div>
                    {/* Empty placeholder to match AddSecretary alignment if you want 50% width, remove if full width is preferred. 
                        Based on "add secretary", let's make it full width or half depending on CSS flex. 
                        Usually Full Width looks better for single items. */}
                </div>

                <div className={styles.divider}></div>

                {/* ADDRESS SECTIONS */}
                {renderReadOnlyAddressFields(secretary.currentAddress, 'Current Address')}
                
                <div className={styles.divider}></div>
                
                {renderReadOnlyAddressFields(secretary.permanentAddress, 'Permanent Address')}

                <div className={styles.divider}></div>

                {/* STATUS */}
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