import React, { useState, useRef, useEffect } from 'react';
import styles from '../../styles/edit-user/EditDentistPage.module.css'; // Make sure this matches your file structure
import { useNavigate, useParams } from 'react-router-dom';
import { regions, provinces, cities, barangays } from '../../utils/addressData';
import successIcon from '../../assets/alert-icons/success.svg';

export default function EditDentistPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const fileInputRef = useRef(null);
    
    // --- STATE MANAGEMENT ---
    const [isLoading, setIsLoading] = useState(true);
    const [isSameAddress, setIsSameAddress] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
    // Error State
    const [errors, setErrors] = useState({});

    const initialAddressState = {
        country: 'Philippines',
        region: '', province: '', city: '', barangay: '',
        houseNumber: '', street: ''
    };

    const [formData, setFormData] = useState({
        firstName: '', middleName: '', lastName: '', birthdate: '',
        email: '', phone: '', licenseNumber: '', specialization: '',
        currentAddress: { ...initialAddressState },
        permanentAddress: { ...initialAddressState }
    });

    // --- UTILS ---
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    const toTitleCase = (str) => {
        return str.toLowerCase().replace(/(?:^|\s|-|\.)\S/g, (char) => char.toUpperCase());
    };

    const getMaxDate = () => {
        const today = new Date();
        today.setFullYear(today.getFullYear() - 21);
        return today.toISOString().split('T')[0]; 
    };

    const clearError = (fieldName) => {
        if (errors[fieldName]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    };

    // --- FETCH DATA ---
    // FETCH DATA
    useEffect(() => {
        const fetchDentist = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/dentist/${id}`);
                const data = await response.json();
                
                if (response.ok) {
                    // FIX: Manual mapping para makuha ang 'brgy' at ilagay sa 'barangay'
                    const currentAddr = data.currentAddress || {};
                    const permAddr = data.permanentAddress || {};

                    setFormData({
                        firstName: data.name?.first || '',
                        middleName: data.name?.middle || '',
                        lastName: data.name?.last || '',
                        birthdate: data.birthdate ? new Date(data.birthdate).toISOString().split('T')[0] : '',
                        email: data.email || '',
                        phone: data.contactNumber ? data.contactNumber.replace('+63', '') : '',
                        licenseNumber: data.licenseNumber || '',
                        specialization: data.specialization || '',
                        
                        // --- DITO ANG FIX SA ADDRESS ---
                        currentAddress: {
                            country: currentAddr.country || 'Philippines',
                            region: currentAddr.region || '',
                            province: currentAddr.province || '',
                            city: currentAddr.city || '',
                            barangay: currentAddr.brgy || currentAddr.barangay || '', // Kukunin ang brgy kung yun ang meron
                            street: currentAddr.street || '',
                            houseNumber: currentAddr.houseNumber || ''
                        },
                        permanentAddress: {
                            country: permAddr.country || 'Philippines',
                            region: permAddr.region || '',
                            province: permAddr.province || '',
                            city: permAddr.city || '',
                            barangay: permAddr.brgy || permAddr.barangay || '', // Ganun din dito
                            street: permAddr.street || '',
                            houseNumber: permAddr.houseNumber || ''
                        }
                        // -------------------------------
                    });
                    setProfileImage(data.profileImage);
                } else {
                    alert("Failed to fetch dentist data. " + (data.message || ""));
                    navigate('/owner/manage-dentists');
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Server error. Check if backend is running.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDentist();
    }, [id, navigate]);

    // --- HANDLERS ---
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfileImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => fileInputRef.current.click();

    // 1. PERSONAL INPUT HANDLER
    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        clearError(name);

        // Name Validation
        if (['firstName', 'middleName', 'lastName'].includes(name)) {
            if (value === '' || /^[a-zA-Z\s.-]+$/.test(value)) {
                setFormData({ ...formData, [name]: toTitleCase(value) });
            }
            return;
        }

        // License Validation
        if (name === 'licenseNumber') {
            if ((value === '' || /^[0-9]+$/.test(value)) && value.length <= 7) {
                setFormData({ ...formData, [name]: value });
            }
            return;
        }

        // Email
        if (name === 'email') {
            setFormData({ ...formData, [name]: value });
            return;
        }

        setFormData({ ...formData, [name]: value });
    };
    
    // 2. PHONE HANDLER
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); 
        if (value.length > 10) return;
        
        clearError('phone');
        setFormData({ ...formData, phone: value });
    };

    // 3. ADDRESS HANDLER
    const handleAddressChange = (type, field, value) => {
        const errorKey = `${type === 'currentAddress' ? 'current' : 'permanent'}_${field}`;
        clearError(errorKey);

        setFormData(prev => {
            const updatedAddress = { ...prev[type], [field]: value };
            if (field === 'region') { updatedAddress.province = ''; updatedAddress.city = ''; updatedAddress.barangay = ''; }
            else if (field === 'province') { updatedAddress.city = ''; updatedAddress.barangay = ''; }
            else if (field === 'city') { updatedAddress.barangay = ''; }

            if (type === 'currentAddress' && isSameAddress) {
                return { ...prev, currentAddress: updatedAddress, permanentAddress: updatedAddress };
            }
            return { ...prev, [type]: updatedAddress };
        });
    };

    const handleSameAddressToggle = (e) => {
        const isChecked = e.target.checked;
        setIsSameAddress(isChecked);
        if (isChecked) {
            setFormData(prev => ({ ...prev, permanentAddress: { ...prev.currentAddress } }));
            // Clear permanent address errors
            setErrors(prev => {
                const newErrors = {...prev};
                Object.keys(newErrors).forEach(key => {
                    if(key.startsWith('permanent_')) delete newErrors[key];
                });
                return newErrors;
            });
        } else {
            setFormData(prev => ({ ...prev, permanentAddress: { ...initialAddressState } }));
        }
    };

    // --- VALIDATION ---
    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        const requiredFields = ['firstName', 'lastName', 'birthdate', 'licenseNumber', 'specialization', 'email'];
        requiredFields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = "This field is required";
                isValid = false;
            }
        });

        // Specific Validations
        if (formData.licenseNumber && formData.licenseNumber.length < 7) {
             newErrors.licenseNumber = "License number must be 7 digits";
             isValid = false;
        }

        if (!formData.phone) {
            newErrors.phone = "This field is required";
            isValid = false;
        } else if (formData.phone.length !== 10 || formData.phone[0] !== '9') {
            newErrors.phone = "Must start with 9 and be 10 digits";
            isValid = false;
        }

        if (formData.email && !validateEmail(formData.email)) {
            newErrors.email = "Invalid email format";
            isValid = false;
        }

        const validateAddr = (addr, prefix) => {
            ['region', 'province', 'city', 'barangay', 'street', 'houseNumber'].forEach(field => {
                if (!addr[field]) {
                    newErrors[`${prefix}_${field}`] = "Required";
                    isValid = false;
                }
            });
        };

        validateAddr(formData.currentAddress, 'current');
        if (!isSameAddress) {
            validateAddr(formData.permanentAddress, 'permanent');
        }

        setErrors(newErrors);

        // Auto Scroll to Error
        if (!isValid) {
            const firstErrorKey = Object.keys(newErrors)[0];
            setTimeout(() => {
                const errorElement = document.getElementsByName(firstErrorKey)[0];
                if (errorElement) {
                    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    errorElement.focus();
                }
            }, 100);
        }

        return isValid;
    };

    // --- SUBMIT (UPDATE) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        const finalData = {
            ...formData,
            phone: `+63${formData.phone}`,
            profileImage: profileImage
        };

        try {
            const response = await fetch(`http://localhost:5000/api/dentist/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            });

            if (response.ok) {
                setShowSuccessModal(true);
            } else {
                alert("Failed to update account.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Cannot connect to server.");
        }
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
        navigate('/owner/manage-dentists');
    };

    // --- RENDER HELPERS ---
    const renderAddressFields = (type, title, isDisabled = false) => {
        const address = formData[type];
        const prefix = type === 'currentAddress' ? 'current' : 'permanent';
        
        const availableProvinces = address.region ? provinces[address.region] || [] : [];
        const availableCities = address.province ? cities[address.province] || [] : [];
        const availableBarangays = address.city ? barangays[address.city] || [] : [];

        const getError = (field) => errors[`${prefix}_${field}`];
        const getErrorClass = (field) => getError(field) ? styles.errorBorder : '';

        return (
            <div className={styles.addressSection}>
                <h3 className={styles.sectionTitle}>{title}</h3>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>COUNTRY</label>
                        <select className={styles.inputField} value={address.country} disabled={true}>
                            <option value="Philippines">Philippines</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>REGION <span style={{color: 'red'}}>*</span></label>
                        <select 
                            name={`${prefix}_region`}
                            className={`${styles.inputField} ${getErrorClass('region')}`} 
                            value={address.region} 
                            onChange={(e) => handleAddressChange(type, 'region', e.target.value)} 
                            disabled={isDisabled}
                        >
                            <option value="" disabled hidden>Select Region</option>
                            {regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                        </select>
                        {getError('region') && <span className={styles.errorText}>{getError('region')}</span>}
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>PROVINCE <span style={{color: 'red'}}>*</span></label>
                        <select 
                            name={`${prefix}_province`}
                            className={`${styles.inputField} ${getErrorClass('province')}`} 
                            value={address.province} 
                            onChange={(e) => handleAddressChange(type, 'province', e.target.value)} 
                            disabled={isDisabled || !address.region}
                        >
                            <option value="" disabled hidden>Select Province</option>
                            {availableProvinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                        </select>
                        {getError('province') && <span className={styles.errorText}>{getError('province')}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>CITY / MUNICIPALITY <span style={{color: 'red'}}>*</span></label>
                        <select 
                            name={`${prefix}_city`}
                            className={`${styles.inputField} ${getErrorClass('city')}`} 
                            value={address.city} 
                            onChange={(e) => handleAddressChange(type, 'city', e.target.value)} 
                            disabled={isDisabled || !address.province}
                        >
                            <option value="" disabled hidden>Select City</option>
                            {availableCities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                        {getError('city') && <span className={styles.errorText}>{getError('city')}</span>}
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>BARANGAY <span style={{color: 'red'}}>*</span></label>
                        <select 
                            name={`${prefix}_barangay`}
                            className={`${styles.inputField} ${getErrorClass('barangay')}`} 
                            value={address.barangay} 
                            onChange={(e) => handleAddressChange(type, 'barangay', e.target.value)} 
                            disabled={isDisabled || !address.city}
                        >
                            <option value="" disabled hidden>Select Barangay</option>
                            {availableBarangays.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        {getError('barangay') && <span className={styles.errorText}>{getError('barangay')}</span>}
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>STREET NAME <span style={{color: 'red'}}>*</span></label>
                        <input 
                            name={`${prefix}_street`}
                            type="text" 
                            className={`${styles.inputField} ${getErrorClass('street')}`} 
                            value={address.street} 
                            onChange={(e) => handleAddressChange(type, 'street', e.target.value)} 
                            placeholder="Street Name" 
                            disabled={isDisabled} 
                            maxLength={100}
                        />
                        {getError('street') && <span className={styles.errorText}>{getError('street')}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>HOUSE NUMBER <span style={{color: 'red'}}>*</span></label>
                        <input 
                            name={`${prefix}_houseNumber`}
                            type="text" 
                            className={`${styles.inputField} ${getErrorClass('houseNumber')}`} 
                            value={address.houseNumber} 
                            onChange={(e) => handleAddressChange(type, 'houseNumber', e.target.value)} 
                            placeholder="House / Unit No." 
                            disabled={isDisabled} 
                            maxLength={20}
                        />
                        {getError('houseNumber') && <span className={styles.errorText}>{getError('houseNumber')}</span>}
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
                    <h2>Edit <span className={styles.highlight}>Dentist</span></h2>
                    <p>Update the dentist's professional and personal details.</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className={styles.uploadSection}>
                        <div className={styles.imageWrapper} onClick={triggerFileInput}>
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className={styles.previewImage} />
                            ) : (
                                <div className={styles.uploadPlaceholder}><span>No Image</span></div>
                            )}
                        </div>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                        <p className={styles.uploadHint}>Click to change photo.</p>
                    </div>

                    <h3 className={styles.mainSectionTitle}>Personal Information</h3>
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>FIRST NAME <span style={{color: 'red'}}>*</span></label>
                            <input 
                                type="text" 
                                name="firstName" 
                                className={`${styles.inputField} ${errors.firstName ? styles.errorBorder : ''}`} 
                                value={formData.firstName} 
                                onChange={handlePersonalChange} 
                                maxLength={50}
                            />
                            {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <label>MIDDLE NAME</label>
                            <input 
                                type="text" 
                                name="middleName" 
                                className={styles.inputField} 
                                value={formData.middleName} 
                                onChange={handlePersonalChange} 
                                maxLength={50}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>LAST NAME <span style={{color: 'red'}}>*</span></label>
                            <input 
                                type="text" 
                                name="lastName" 
                                className={`${styles.inputField} ${errors.lastName ? styles.errorBorder : ''}`} 
                                value={formData.lastName} 
                                onChange={handlePersonalChange} 
                                maxLength={50}
                            />
                            {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>BIRTH DATE <span style={{color: 'red'}}>*</span></label>
                            <input 
                                type="date" 
                                name="birthdate" 
                                className={`${styles.inputField} ${errors.birthdate ? styles.errorBorder : ''}`} 
                                value={formData.birthdate} 
                                max={getMaxDate()} 
                                onChange={handlePersonalChange} 
                            />
                            {errors.birthdate && <span className={styles.errorText}>{errors.birthdate}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <label>SPECIALIZATION <span style={{color: 'red'}}>*</span></label>
                            <select 
                                name="specialization" 
                                className={`${styles.inputField} ${errors.specialization ? styles.errorBorder : ''}`} 
                                value={formData.specialization} 
                                onChange={handlePersonalChange} 
                            >
                                <option value="" disabled hidden>Select Specialization</option>
                                <option value="General Dentistry">General Dentistry</option>
                                <option value="Orthodontics">Orthodontics</option>
                                <option value="Pediatric Dentistry">Pediatric Dentistry</option>
                            </select>
                            {errors.specialization && <span className={styles.errorText}>{errors.specialization}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <label>PRC LICENSE NO. <span style={{color: 'red'}}>*</span></label>
                            <input 
                                type="text" 
                                name="licenseNumber" 
                                className={`${styles.inputField} ${errors.licenseNumber ? styles.errorBorder : ''}`} 
                                value={formData.licenseNumber} 
                                onChange={handlePersonalChange} 
                                maxLength={7}
                            />
                            {errors.licenseNumber && <span className={styles.errorText}>{errors.licenseNumber}</span>}
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>EMAIL ADDRESS <span style={{color: 'red'}}>*</span></label>
                            <input 
                                type="email" 
                                name="email" 
                                className={`${styles.inputField} ${errors.email ? styles.errorBorder : ''}`} 
                                value={formData.email} 
                                onChange={handlePersonalChange} 
                                maxLength={100}
                            />
                            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <label>PHONE NUMBER <span style={{color: 'red'}}>*</span></label>
                            <div className={styles.phoneInputGroup}>
                                <span className={styles.phonePrefix}>+63</span>
                                <input 
                                    type="text" 
                                    name="phone" 
                                    className={`${styles.phoneField} ${errors.phone ? styles.errorBorder : ''}`} 
                                    value={formData.phone} 
                                    onChange={handlePhoneChange} 
                                    maxLength={10}
                                />
                            </div>
                            {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                        </div>
                    </div>

                    <hr className={styles.divider} />
                    {renderAddressFields('currentAddress', 'Current Address')}

                    <div className={styles.permanentHeader}>
                        <h3 className={styles.sectionTitle}>Permanent Address</h3>
                        <div className={styles.checkboxContainer}>
                            <input type="checkbox" id="sameAddress" checked={isSameAddress} onChange={handleSameAddressToggle} />
                            <label htmlFor="sameAddress">Same as Current Address</label>
                        </div>
                    </div>

                    {isSameAddress ? <div className={styles.disabledOverlay}>{renderAddressFields('permanentAddress', '', true)}</div> : renderAddressFields('permanentAddress', '')}

                    <div className={styles.buttonGroup}>
                        <button type="button" className={styles.cancelBtn} onClick={() => navigate('/owner/manage-dentists')}>CANCEL</button>
                        <button type="submit" className={styles.submitBtn}>
                            SAVE CHANGES
                        </button>
                    </div>
                </form>
            </div>

            {showSuccessModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <img src={successIcon} alt="Success" className={styles.modalIcon} />
                        <h3 className={styles.modalTitle}>Update Successful!</h3>
                        <p className={styles.modalMessage}>Dentist information has been updated.</p>
                        <p className={styles.closeLink} onClick={handleCloseModal}>
                            Close
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}