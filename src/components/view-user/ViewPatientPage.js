import React, { useState, useEffect } from 'react';
import styles from '../../styles/view-user/ViewPatientPage.module.css'; // Reuse CSS with added styles
import { useNavigate, useParams } from 'react-router-dom';

export default function ViewPatientPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/user/${id}`);
                const data = await response.json();
                if (response.ok) setPatient(data);
                else alert("Failed to load patient data.");
            } catch (error) { console.error("Error:", error); } finally { setLoading(false); }
        };
        fetchPatient();
    }, [id]);

    if (loading) return <div className={styles.container}>Loading...</div>;
    if (!patient) return <div className={styles.container}>Patient not found.</div>;

    const currentAddr = patient.currentAddress || {};
    const permAddr = patient.permanentAddress || {};
    const guardian = patient.guardian || {};
    const medical = patient.medicalHistory || { allergies: [], conditions: [] };

    // Age Calculation
    const today = new Date();
    const birthDate = new Date(patient.birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    if (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())) age--;
    const isMinor = age < 13;

    const formatAddress = (addr) => {
        return `${addr.street || ''} ${addr.houseNumber || ''}, ${addr.brgy || addr.barangay || ''}, ${addr.city || ''}, ${addr.province || ''}, ${addr.region || ''}`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.profileSection}>
                        <div className={styles.avatarLarge}>
                            {patient.profileImage ? <img src={patient.profileImage} alt="Profile" className={styles.profileImg} /> : patient.name.first[0]}
                        </div>
                        <div className={styles.nameSection}>
                            <h1 className={styles.fullName}>{patient.name.first} {patient.name.middle} {patient.name.last}</h1>
                            <p className={styles.roleLabel}>Patient ({age} yrs old)</p>
                            <span className={`${styles.statusBadge} ${patient.isVerified ? styles.active : styles.inactive}`}>
                                {patient.isVerified ? 'Active' : 'Pending'}
                            </span>
                        </div>
                    </div>
                    <button className={styles.editBtn} onClick={() => navigate(`/owner/edit-patient/${id}`)}>EDIT PROFILE</button>
                </div>

                <div className={styles.gridContainer}>
                    <div className={styles.infoGroup}>
                        <label>EMAIL ADDRESS</label>
                        <p>{patient.email}</p>
                    </div>
                    <div className={styles.infoGroup}>
                        <label>PHONE NUMBER</label>
                        <p>{patient.contactNumber}</p>
                    </div>
                    <div className={styles.infoGroup}>
                        <label>BIRTHDATE</label>
                        <p>{new Date(patient.birthdate).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* GUARDIAN INFO (Shown if present, regardless of current age, but highlighted for minors) */}
                {(guardian.name || isMinor) && (
                    <div className={styles.guardianSection}>
                        <h3 style={{color: '#f57f17', fontSize: '16px', marginBottom: '10px', fontWeight: 'bold'}}>Guardian Information</h3>
                        <div className={styles.gridContainer}>
                            <div className={styles.infoGroup}>
                                <label>NAME</label>
                                <p>{guardian.name || 'N/A'}</p>
                            </div>
                            <div className={styles.infoGroup}>
                                <label>RELATIONSHIP</label>
                                <p>{guardian.relationship || 'N/A'}</p>
                            </div>
                            <div className={styles.infoGroup}>
                                <label>CONTACT</label>
                                <p>{guardian.contactNumber || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                )}

                <h3 className={styles.sectionHeader}>Medical History</h3>
                <div className={styles.gridContainer}>
                    <div className={styles.infoGroup} style={{gridColumn: '1 / -1'}}>
                        <label>ALLERGIES</label>
                        <div className={styles.listContainer}>
                            {medical.allergies && medical.allergies.length > 0 ? (
                                medical.allergies.map((a, i) => <span key={i} className={styles.chip}>{a}</span>)
                            ) : <span className={styles.noDataText}>None</span>}
                        </div>
                    </div>
                    <div className={styles.infoGroup} style={{gridColumn: '1 / -1'}}>
                        <label>CONDITIONS</label>
                        <div className={styles.listContainer}>
                            {medical.conditions && medical.conditions.length > 0 ? (
                                medical.conditions.map((c, i) => <span key={i} className={styles.chip}>{c}</span>)
                            ) : <span className={styles.noDataText}>None</span>}
                        </div>
                    </div>
                    <div className={styles.infoGroup}>
                        <label>HOSPITALIZED?</label>
                        <p>{medical.hospitalized || 'No'}</p>
                    </div>
                    <div className={styles.infoGroup}>
                        <label>MEDICATIONS</label>
                        <p>{medical.medications || 'None'}</p>
                    </div>
                </div>

                <hr className={styles.divider} />

                <div className={styles.gridContainer}>
                    <div className={styles.infoGroup} style={{gridColumn: '1 / -1'}}>
                        <label>CURRENT ADDRESS</label>
                        <p>{formatAddress(currentAddr)}</p>
                    </div>
                    <div className={styles.infoGroup} style={{gridColumn: '1 / -1'}}>
                        <label>PERMANENT ADDRESS</label>
                        <p>{formatAddress(permAddr)}</p>
                    </div>
                </div>

                <button className={styles.backBtn} onClick={() => navigate('/owner/manage-patients')}>Back to List</button>
            </div>
        </div>
    );
}