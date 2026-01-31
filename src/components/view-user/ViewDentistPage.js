import React, { useState, useEffect } from 'react';
import styles from '../../styles/view-user/ViewDentistPage.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { regions, provinces, cities, barangays } from '../../utils/addressData';

export default function ViewDentistPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    
    const [isLoading, setIsLoading] = useState(true);
    const [profileImage, setProfileImage] = useState(null);

    // Initial state
    const [formData, setFormData] = useState({
        firstName: '', middleName: '', lastName: '', birthdate: '',
        email: '', phone: '', licenseNumber: '', specialization: '',
        currentAddress: {},
        permanentAddress: {}
    });

    // FETCH DATA
    useEffect(() => {
        const fetchDentist = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/dentist/${id}`);
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

                if (data.profileImage) {
                    setProfileImage(data.profileImage);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Error loading dentist data.");
                navigate('/owner/manage-dentists');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDentist();
    }, [id, navigate]);

    // Helpers
    const getRegionName = (code) => regions.find(r => r.code === code)?.name || code;
    const getProvinceName = (regionCode, provCode) => provinces[regionCode]?.find(p => p.code === provCode)?.name || provCode;
    const getCityName = (provCode, cityCode) => cities[provCode]?.find(c => c.code === cityCode)?.name || cityCode;

    // Reusable Address Display
    const renderAddressFields = (type, title) => {
        const address = formData[type];
        
        return (
            <div className={styles.addressSection}>
                <h3 className={styles.sectionTitle}>{title}</h3>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>COUNTRY</label>
                        <div className={styles.readOnlyField}>{address.country || 'Philippines'}</div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>REGION</label>
                        <div className={styles.readOnlyField}>{getRegionName(address.region) || '-'}</div>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>PROVINCE</label>
                        <div className={styles.readOnlyField}>{getProvinceName(address.region, address.province) || '-'}</div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>CITY / MUNICIPALITY</label>
                        <div className={styles.readOnlyField}>{getCityName(address.province, address.city) || '-'}</div>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>BARANGAY</label>
                        {/* UPDATE: Check for address.brgy OR address.barangay */}
                        <div className={styles.readOnlyField}>{address.brgy || address.barangay || '-'}</div>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>STREET NAME</label>
                        <div className={styles.readOnlyField}>{address.street || '-'}</div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>HOUSE NUMBER</label>
                        <div className={styles.readOnlyField}>{address.houseNumber || '-'}</div>
                    </div>
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

                {/* PROFILE IMAGE */}
                <div className={styles.uploadSection}>
                    <div className={styles.imageWrapper}>
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" className={styles.previewImage} />
                        ) : (
                            <div className={styles.uploadPlaceholder}><span>No Image</span></div>
                        )}
                    </div>
                </div>

                {/* PERSONAL INFO */}
                <h3 className={styles.mainSectionTitle}>Personal Information</h3>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>FIRST NAME</label>
                        <div className={styles.readOnlyField}>{formData.firstName}</div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>MIDDLE NAME</label>
                        <div className={styles.readOnlyField}>{formData.middleName || '-'}</div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>LAST NAME</label>
                        <div className={styles.readOnlyField}>{formData.lastName}</div>
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>BIRTH DATE</label>
                        <div className={styles.readOnlyField}>{formData.birthdate}</div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>SPECIALIZATION</label>
                        <div className={styles.readOnlyField}>{formData.specialization}</div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>PRC LICENSE NO.</label>
                        <div className={styles.readOnlyField}>{formData.licenseNumber}</div>
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>EMAIL ADDRESS</label>
                        <div className={styles.readOnlyField}>{formData.email}</div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>PHONE NUMBER</label>
                        <div className={styles.readOnlyField}>+63 {formData.phone}</div>
                    </div>
                </div>

                <hr className={styles.divider} />
                
                {/* ADDRESSES */}
                {renderAddressFields('currentAddress', 'Current Address')}
                {renderAddressFields('permanentAddress', 'Permanent Address')}

                {/* BACK BUTTON */}
                <div className={styles.buttonGroup}>
                    <button type="button" className={styles.backBtn} onClick={() => navigate('/owner/manage-dentists')}>
                        BACK TO LIST
                    </button>
                </div>
            </div>
        </div>
    );
}