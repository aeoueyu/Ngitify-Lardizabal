import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from '../../styles/view-user/ViewPatientPage.module.css';
import { regions, provinces, cities, barangays } from '../../utils/addressData';

export default function ViewPatientPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation(); // To check current path if needed
    const [patient, setPatient] = useState(null);

    // Determine current path prefix (e.g., 'owner', 'dentist')
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

    const status = patient.status || 'active';
    const isEditDisabled = !patient.isVerified || status === 'inactive';
    
    // Check Guardian
    const hasGuardian = patient.guardian && patient.guardian.name;
    
    // Check Medical History
    const medHistory = patient.medicalHistory || { allergies: '', conditions: [] };
    const conditionsList = medHistory.conditions && medHistory.conditions.length > 0 
        ? medHistory.conditions.join(', ') 
        : 'None';

    // --- HELPERS ---
    const getRegionName = (code) => regions.find(r => r.code === code)?.name || code || 'N/A';
    const getProvinceName = (code) => { for(const k in provinces){const f=provinces[k].find(p=>p.code===code);if(f)return f.name} return code; };
    const getCityName = (code) => { for(const k in cities){const f=cities[k].find(c=>c.code===code);if(f)return f.name} return code; };
    const getBarangayName = (code) => { for(const k in barangays){const f=barangays[k].find(b=>b.code===code);if(f)return f.name} return code; };

    const renderReadOnlyAddressFields = (address, title) => {
        if (!address) return null;
        return (
            <div className={styles.addressSection}>
                <h3 className={styles.sectionTitle}>{title}</h3>
                <div className={styles.row}>
                    <div className={styles.formGroup}><label>REGION</label><div className={styles.readOnlyField}>{getRegionName(address.region)}</div></div>
                    <div className={styles.formGroup}><label>PROVINCE</label><div className={styles.readOnlyField}>{getProvinceName(address.province)}</div></div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}><label>CITY / MUNICIPALITY</label><div className={styles.readOnlyField}>{getCityName(address.city)}</div></div>
                    <div className={styles.formGroup}><label>BARANGAY</label><div className={styles.readOnlyField}>{getBarangayName(address.barangay)}</div></div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}><label>STREET</label><div className={styles.readOnlyField}>{address.street||'N/A'}</div></div>
                    <div className={styles.formGroup}><label>HOUSE NO.</label><div className={styles.readOnlyField}>{address.houseNumber||'N/A'}</div></div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                
                {/* --- HEADER WITH BUTTONS (Top Right) --- */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <h2>Patient Profile</h2>
                        <p>View patient details and medical history.</p>
                    </div>
                    <div className={styles.headerButtons}>
                        <button className={`${styles.actionBtn} ${styles.backBtn}`} onClick={() => navigate(-1)}>
                            BACK
                        </button>
                        <button 
                            className={`${styles.actionBtn} ${styles.editBtn}`} 
                            onClick={() => navigate(`/${currentPath}/edit-patient/${id}`)}
                            disabled={isEditDisabled}
                            style={{ opacity: isEditDisabled ? 0.5 : 1, cursor: isEditDisabled ? 'not-allowed' : 'pointer' }}
                        >
                            EDIT PROFILE
                        </button>
                    </div>
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
                
                {/* Name Row */}
                <div className={styles.row}>
                    <div className={styles.formGroup}><label>FIRST NAME</label><div className={styles.readOnlyField}>{patient.name?.first}</div></div>
                    <div className={styles.formGroup}><label>MIDDLE NAME</label><div className={styles.readOnlyField}>{patient.name?.middle || ''}</div></div>
                    <div className={styles.formGroup}><label>LAST NAME</label><div className={styles.readOnlyField}>{patient.name?.last}</div></div>
                </div>

                {/* Birthdate & Phone Row */}
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>BIRTHDATE</label>
                        <div className={styles.readOnlyField}>
                            {patient.birthdate ? new Date(patient.birthdate).toLocaleDateString() : 'N/A'}
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>PHONE NUMBER</label>
                        <div className={styles.readOnlyPhoneGroup}>
                            <span className={styles.phonePrefix}>+63</span>
                            <div className={styles.phoneValue}>
                                {patient.contactNumber ? patient.contactNumber.replace('+63', '') : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Email Row */}
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>EMAIL ADDRESS</label>
                        <div className={styles.readOnlyField}>{patient.email}</div>
                    </div>
                </div>

                {/* --- GUARDIAN INFO (Conditional) --- */}
                {hasGuardian && (
                    <div style={{marginTop: '25px', padding: '20px', border: '1px solid #ffe082', borderRadius: '12px', backgroundColor: '#fff8e1'}}>
                        <h3 className={styles.sectionTitle} style={{color:'#f57f17', marginBottom: '15px'}}>GUARDIAN INFORMATION</h3>
                        <div className={styles.row}>
                            <div className={styles.formGroup}><label>NAME</label><div className={styles.readOnlyField} style={{backgroundColor: 'white'}}>{patient.guardian.name}</div></div>
                            <div className={styles.formGroup}><label>RELATIONSHIP</label><div className={styles.readOnlyField} style={{backgroundColor: 'white'}}>{patient.guardian.relationship}</div></div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>PHONE</label>
                                <div className={styles.readOnlyPhoneGroup} style={{backgroundColor: 'white'}}>
                                    <span className={styles.phonePrefix}>+63</span>
                                    <div className={styles.phoneValue}>
                                        {patient.guardian.contactNumber ? patient.guardian.contactNumber.replace('+63', '') : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.divider}></div>

                {/* --- MEDICAL HISTORY SECTION (View Only) --- */}
                <h3 className={styles.mainSectionTitle}>Medical History</h3>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>ALLERGIES</label>
                        <div className={styles.readOnlyField} style={{color: medHistory.allergies ? '#c62828' : '#444'}}>
                            {medHistory.allergies || 'None'}
                        </div>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>MEDICAL CONDITIONS</label>
                        <div className={styles.readOnlyField}>
                            {conditionsList}
                        </div>
                    </div>
                </div>

                <div className={styles.divider}></div>

                {/* ADDRESS SECTIONS */}
                {renderReadOnlyAddressFields(patient.currentAddress, 'Current Address')}
                
                <div className={styles.divider}></div>
                
                {renderReadOnlyAddressFields(patient.permanentAddress, 'Permanent Address')}

                <div className={styles.divider}></div>

                {/* STATUS ROW */}
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