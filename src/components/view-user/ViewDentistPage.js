import React, { useState, useEffect } from 'react';
import styles from '../../styles/view-user/ViewDentistPage.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { regions, provinces, cities } from '../../utils/addressData';

// Icons
import warningIcon from '../../assets/alert-icons/warning.svg'; // Siguraduhing may icon ka

export default function ViewDentistPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    
    const [isLoading, setIsLoading] = useState(true);
    const [profileImage, setProfileImage] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal State

    // Initial state
    const [formData, setFormData] = useState({
        firstName: '', middleName: '', lastName: '', birthdate: '',
        email: '', phone: '', licenseNumber: '', specialization: '',
        currentAddress: {},
        permanentAddress: {}
    });

    useEffect(() => {
        const fetchDentist = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/user/${id}`);
                if (!response.ok) throw new Error("Failed to fetch data");
                const data = await response.json();

                setFormData({
                    firstName: data.name?.first || '',
                    middleName: data.name?.middle || '',
                    lastName: data.name?.last || '',
                    birthdate: data.birthdate ? new Date(data.birthdate).toLocaleDateString() : '',
                    email: data.email || '',
                    phone: data.contactNumber ? data.contactNumber.replace('+63', '') : '',
                    licenseNumber: data.licenseNumber || '',
                    specialization: data.specialization || '',
                    currentAddress: data.currentAddress || {},
                    permanentAddress: data.permanentAddress || {}
                });

                if (data.profileImage) setProfileImage(data.profileImage);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDentist();
    }, [id]);

    // HANDLER: Confirm Delete (API Call)
    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/user/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setShowDeleteModal(false);
                navigate('/owner/manage-dentists');
            } else {
                alert("Failed to delete dentist.");
            }
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Server error.");
        }
    };

    // Helpers
    const getRegionName = (code) => regions.find(r => r.code === code)?.name || code;
    const getProvinceName = (regionCode, provCode) => provinces[regionCode]?.find(p => p.code === provCode)?.name || provCode;
    const getCityName = (provCode, cityCode) => cities[provCode]?.find(c => c.code === cityCode)?.name || cityCode;

    const renderAddressFields = (type, title) => {
        const address = formData[type];
        return (
            <div className={styles.addressSection}>
                <h3 className={styles.sectionTitle}>{title}</h3>
                <div className={styles.row}>
                    <div className={styles.formGroup}><label>COUNTRY</label><div className={styles.readOnlyField}>{address.country || 'Philippines'}</div></div>
                    <div className={styles.formGroup}><label>REGION</label><div className={styles.readOnlyField}>{getRegionName(address.region) || '-'}</div></div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}><label>PROVINCE</label><div className={styles.readOnlyField}>{getProvinceName(address.region, address.province) || '-'}</div></div>
                    <div className={styles.formGroup}><label>CITY / MUNICIPALITY</label><div className={styles.readOnlyField}>{getCityName(address.province, address.city) || '-'}</div></div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}><label>BARANGAY</label><div className={styles.readOnlyField}>{address.brgy || address.barangay || '-'}</div></div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}><label>STREET NAME</label><div className={styles.readOnlyField}>{address.street || '-'}</div></div>
                    <div className={styles.formGroup}><label>HOUSE NUMBER</label><div className={styles.readOnlyField}>{address.houseNumber || '-'}</div></div>
                </div>
            </div>
        );
    };

    if (isLoading) return <div className={styles.container}><p>Loading...</p></div>;

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <div className={styles.header}>
                    <h2>View <span className={styles.highlight}>Dentist</span></h2>
                    <p>Dentist profile information (Read Only).</p>
                </div>

                <div className={styles.uploadSection}>
                    <div className={styles.imageWrapper} style={{ cursor: 'default', border: 'none' }}>
                        {profileImage ? <img src={profileImage} alt="Profile" className={styles.previewImage} /> : <div className={styles.uploadPlaceholder}><span>No Image</span></div>}
                    </div>
                </div>

                <h3 className={styles.mainSectionTitle}>Personal Information</h3>
                <div className={styles.row}>
                    <div className={styles.formGroup}><label>FIRST NAME</label><div className={styles.readOnlyField}>{formData.firstName}</div></div>
                    <div className={styles.formGroup}><label>MIDDLE NAME</label><div className={styles.readOnlyField}>{formData.middleName || '-'}</div></div>
                    <div className={styles.formGroup}><label>LAST NAME</label><div className={styles.readOnlyField}>{formData.lastName}</div></div>
                </div>
                {/* ... (Other fields same as before) ... */}
                <div className={styles.row}>
                    <div className={styles.formGroup}><label>BIRTH DATE</label><div className={styles.readOnlyField}>{formData.birthdate}</div></div>
                    <div className={styles.formGroup}><label>SPECIALIZATION</label><div className={styles.readOnlyField}>{formData.specialization}</div></div>
                    <div className={styles.formGroup}><label>PRC LICENSE NO.</label><div className={styles.readOnlyField}>{formData.licenseNumber}</div></div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}><label>EMAIL ADDRESS</label><div className={styles.readOnlyField}>{formData.email}</div></div>
                    <div className={styles.formGroup}><label>PHONE NUMBER</label><div className={styles.readOnlyField}>+63 {formData.phone}</div></div>
                </div>

                <hr className={styles.divider} />
                {renderAddressFields('currentAddress', 'Current Address')}
                {renderAddressFields('permanentAddress', 'Permanent Address')}

                {/* --- BUTTONS (ARRANGEMENT: BACK, EDIT, DELETE) --- */}
                <div className={styles.buttonGroup}>
                    {/* 1. BACK */}
                    <button 
                        type="button" 
                        className={`${styles.actionBtn} ${styles.backBtn}`} 
                        onClick={() => navigate('/owner/manage-dentists')}
                    >
                        BACK
                    </button>

                    {/* 2. EDIT */}
                    <button 
                        type="button" 
                        className={`${styles.actionBtn} ${styles.editBtn}`} 
                        onClick={() => navigate(`/owner/edit-dentist/${id}`)}
                    >
                        EDIT
                    </button>

                     {/* 3. DELETE */}
                     <button 
                        type="button" 
                        className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                        onClick={() => setShowDeleteModal(true)} // Open Modal
                    >
                        DELETE
                    </button>
                </div>
            </div>

            {/* DELETE CONFIRMATION MODAL */}
            {showDeleteModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <img src={warningIcon} alt="Warning" className={styles.modalIcon} />
                        <h3 className={styles.modalTitle}>Delete Dentist?</h3>
                        <p className={styles.modalMessage}>
                            Are you sure you want to delete this dentist? <br/>
                            This action cannot be undone.
                        </p>
                        <div className={styles.modalActions}>
                            <button className={styles.modalCancelBtn} onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className={styles.modalDeleteBtn} onClick={handleConfirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}