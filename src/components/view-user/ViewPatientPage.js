import React, { useState, useEffect } from 'react';
import styles from '../../styles/view-user/ViewPatientPage.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { regions, provinces, cities } from '../../utils/addressData';
import warningIcon from '../../assets/alert-icons/warning.svg';

export default function ViewPatientPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    
    const [isLoading, setIsLoading] = useState(true);
    const [profileImage, setProfileImage] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isMinor, setIsMinor] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '', middleName: '', lastName: '', birthdate: '',
        email: '', phone: '', guardian: {}, currentAddress: {}, permanentAddress: {}
    });

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/user/${id}`);
                if (!response.ok) throw new Error("Failed to fetch");
                const data = await response.json();

                // Minor check
                const today = new Date();
                const birthDate = new Date(data.birthdate);
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
                setIsMinor(age < 18);

                setFormData({
                    firstName: data.name?.first || '', middleName: data.name?.middle || '', lastName: data.name?.last || '',
                    birthdate: data.birthdate ? new Date(data.birthdate).toLocaleDateString() : '',
                    email: data.email || '', phone: data.contactNumber ? data.contactNumber.replace('+63', '') : '',
                    guardian: data.guardian || {},
                    currentAddress: data.currentAddress || {}, permanentAddress: data.permanentAddress || {}
                });
                if (data.profileImage) setProfileImage(data.profileImage);
            } catch (error) { console.error("Error:", error); } finally { setIsLoading(false); }
        };
        fetchPatient();
    }, [id]);

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/user/${id}`, { method: 'DELETE' });
            if (response.ok) { setShowDeleteModal(false); navigate('/owner/manage-patients'); }
            else alert("Failed to delete.");
        } catch (error) { console.error("Error:", error); }
    };

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
                    <div className={styles.formGroup}><label>CITY</label><div className={styles.readOnlyField}>{getCityName(address.province, address.city) || '-'}</div></div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}><label>BARANGAY</label><div className={styles.readOnlyField}>{address.brgy || address.barangay || '-'}</div></div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}><label>STREET</label><div className={styles.readOnlyField}>{address.street || '-'}</div></div>
                    <div className={styles.formGroup}><label>HOUSE NO.</label><div className={styles.readOnlyField}>{address.houseNumber || '-'}</div></div>
                </div>
            </div>
        );
    };

    if (isLoading) return <div className={styles.container}><p>Loading...</p></div>;

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <div className={styles.header}>
                    <h2>View <span className={styles.highlight}>Patient</span></h2>
                    <p>Patient profile information (Read Only).</p>
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
                <div className={styles.row}>
                    <div className={styles.formGroup}><label>BIRTH DATE</label><div className={styles.readOnlyField}>{formData.birthdate}</div></div>
                    <div className={styles.formGroup}><label>EMAIL ADDRESS</label><div className={styles.readOnlyField}>{formData.email}</div></div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}><label>PHONE NUMBER</label><div className={styles.readOnlyField}>+63 {formData.phone}</div></div>
                </div>

                {isMinor && (
                    <div className={styles.guardianSection}>
                        <h4 className={styles.sectionHeader}>Guardian Information</h4>
                        <div className={styles.row}>
                            <div className={styles.formGroup}><label>GUARDIAN NAME</label><div className={styles.readOnlyField}>{formData.guardian.name || 'N/A'}</div></div>
                            <div className={styles.formGroup}><label>RELATIONSHIP</label><div className={styles.readOnlyField}>{formData.guardian.relationship || 'N/A'}</div></div>
                            <div className={styles.formGroup}><label>CONTACT NO.</label><div className={styles.readOnlyField}>{formData.guardian.contactNumber || 'N/A'}</div></div>
                        </div>
                    </div>
                )}

                <hr className={styles.divider} />
                {renderAddressFields('currentAddress', 'Current Address')}
                {renderAddressFields('permanentAddress', 'Permanent Address')}

                <div className={styles.buttonGroup}>
                    <button className={`${styles.actionBtn} ${styles.backBtn}`} onClick={() => navigate('/owner/manage-patients')}>BACK</button>
                    <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => navigate(`/owner/edit-patient/${id}`)}>EDIT</button>
                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => setShowDeleteModal(true)}>DELETE</button>
                </div>
            </div>

            {showDeleteModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <img src={warningIcon} alt="Warning" className={styles.modalIcon} />
                        <h3 className={styles.modalTitle}>Delete Patient?</h3>
                        <p className={styles.modalMessage}>Are you sure you want to delete this patient? This action cannot be undone.</p>
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