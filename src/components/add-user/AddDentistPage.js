import React, { useState, useRef } from 'react';
import styles from '../../styles/add-user/AddDentistPage.module.css';
import { useNavigate } from 'react-router-dom';
import { regions, provinces, cities, barangays } from '../../utils/addressData';
import successIcon from '../../assets/alert-icons/success.svg';

export default function AddDentistPage() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    // STATES
    const [isSameAddress, setIsSameAddress] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Password States
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false, uppercase: false, lowercase: false, number: false
    });
    const [showPasswordRules, setShowPasswordRules] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(''); // 'Weak', 'Moderate', 'Strong'

    // Form Data
    const [formData, setFormData] = useState({
        firstName: '', middleName: '', lastName: '', birthdate: '',
        email: '', phone: '', licenseNumber: '', specialization: '',
        password: '', confirmPassword: '',
        currentAddress: { 
            country: 'Philippines', region: '', province: '', city: '', barangay: '', houseNumber: '', street: '' 
        },
        permanentAddress: { 
            country: 'Philippines', region: '', province: '', city: '', barangay: '', houseNumber: '', street: '' 
        }
    });

    // Error State
    const [errors, setErrors] = useState({});

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

    // 1. INPUT HANDLER
    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        clearError(name);

        if (['firstName', 'middleName', 'lastName'].includes(name)) {
            if (value === '' || /^[a-zA-Z\s.-]+$/.test(value)) {
                setFormData({ ...formData, [name]: toTitleCase(value) });
            }
            return;
        }

        if (name === 'licenseNumber') {
            if ((value === '' || /^[0-9]+$/.test(value)) && value.length <= 7) {
                setFormData({ ...formData, [name]: value });
            }
            return;
        }

        if (name === 'email') {
            setFormData({ ...formData, [name]: value });
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    // 2. PASSWORD HANDLER (Real-time Strength)
    const handlePasswordChange = (e) => {
        const val = e.target.value;
        setFormData({ ...formData, password: val });
        clearError('password');

        if (formData.confirmPassword && val !== formData.confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
        } else {
            clearError('confirmPassword');
        }

        // Calculate Criteria
        const criteria = {
            length: val.length >= 8, // Min length check logic
            uppercase: /[A-Z]/.test(val),
            lowercase: /[a-z]/.test(val),
            number: /[0-9]/.test(val)
        };
        setPasswordCriteria(criteria);

        // Calculate Strength Text
        const metCount = Object.values(criteria).filter(Boolean).length;
        
        if (val.length === 0) {
            setPasswordStrength('');
        } else if (metCount < 3) {
            setPasswordStrength('Weak');
        } else if (metCount === 3) {
            setPasswordStrength('Moderate');
        } else if (metCount === 4) {
            setPasswordStrength('Strong');
        }
    };

    // 3. CONFIRM PASSWORD
    const handleConfirmPasswordChange = (e) => {
        const val = e.target.value;
        setFormData({ ...formData, confirmPassword: val });
        
        if (val !== formData.password) {
            setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
        } else {
            clearError('confirmPassword');
        }
    };

    // 4. PHONE HANDLER
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); 
        if (value.length > 10) return; 
        clearError('phone');
        setFormData({ ...formData, phone: value });
    };

    // 5. ADDRESS HANDLER
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
            setErrors(prev => {
                const newErrors = {...prev};
                Object.keys(newErrors).forEach(key => {
                    if(key.startsWith('permanent_')) delete newErrors[key];
                });
                return newErrors;
            });
        } else {
            setFormData(prev => ({ ...prev, permanentAddress: { 
                country: 'Philippines', region: '', province: '', city: '', barangay: '', houseNumber: '', street: '' 
            } }));
        }
    };

    // --- VALIDATION ---
    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        const requiredFields = ['firstName', 'lastName', 'birthdate', 'licenseNumber', 'specialization', 'email', 'confirmPassword'];
        
        requiredFields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = "This field is required";
                isValid = false;
            }
        });

        // Password Validation
        if (!formData.password) {
            newErrors.password = "This field is required";
            isValid = false;
        } else {
            // Check Strength
            if (passwordStrength !== 'Strong') {
                newErrors.password = "Password must be Strong"; // Simple message on submit
                isValid = false;
            }
        }

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

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
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

    // --- SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        const finalData = {
            ...formData,
            phone: `+63${formData.phone}`,
            profileImage: profileImage
        };

        try {
            const response = await fetch('http://localhost:5000/api/add-dentist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            });

            if (response.ok) {
                setShowSuccessModal(true);
            } else {
                const data = await response.json();
                alert(data.message || "Failed to add dentist");
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

    // Helper for strength color
    const getStrengthColor = () => {
        if (passwordStrength === 'Weak') return '#d32f2f'; // Red
        if (passwordStrength === 'Moderate') return '#f57f17'; // Dark Yellow/Orange
        if (passwordStrength === 'Strong') return '#388e3c'; // Green
        return '#ccc';
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
                </div>
                 <div className={styles.row}>
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
                        <label>STREET <span style={{color: 'red'}}>*</span></label>
                        <input 
                            name={`${prefix}_street`}
                            className={`${styles.inputField} ${getErrorClass('street')}`} 
                            value={address.street} 
                            onChange={(e) => handleAddressChange(type, 'street', e.target.value)} 
                            disabled={isDisabled} 
                            placeholder="e.g. Mabini Street" 
                            maxLength={100}
                        />
                        {getError('street') && <span className={styles.errorText}>{getError('street')}</span>}
                    </div>
                     <div className={styles.formGroup}>
                        <label>HOUSE NO. <span style={{color: 'red'}}>*</span></label>
                        <input 
                            name={`${prefix}_houseNumber`}
                            className={`${styles.inputField} ${getErrorClass('houseNumber')}`} 
                            value={address.houseNumber} 
                            onChange={(e) => handleAddressChange(type, 'houseNumber', e.target.value)} 
                            disabled={isDisabled} 
                            placeholder="e.g. Unit 123" 
                            maxLength={20}
                        />
                        {getError('houseNumber') && <span className={styles.errorText}>{getError('houseNumber')}</span>}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <div className={styles.header}>
                    <h2>Add New <span className={styles.highlight}>Dentist</span></h2>
                    <p>Create a new dentist account.</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    {/* --- IMAGE UPLOAD --- */}
                    <div className={styles.uploadSection}>
                        <div className={styles.imageWrapper} onClick={triggerFileInput}>
                            {profileImage ? <img src={profileImage} alt="Profile" className={styles.previewImage} /> : <div className={styles.uploadPlaceholder}><span>Upload Photo</span></div>}
                        </div>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                    </div>

                    {/* --- PERSONAL INFO --- */}
                    <h3 className={styles.mainSectionTitle}>Personal Information</h3>
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>FIRST NAME <span style={{color: 'red'}}>*</span></label>
                            <input 
                                className={`${styles.inputField} ${errors.firstName ? styles.errorBorder : ''}`} 
                                name="firstName" 
                                value={formData.firstName} 
                                onChange={handlePersonalChange} 
                                placeholder="e.g. Juan" 
                                maxLength={50}
                            />
                            {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <label>MIDDLE NAME</label>
                            <input 
                                className={styles.inputField} 
                                name="middleName" 
                                value={formData.middleName} 
                                onChange={handlePersonalChange} 
                                placeholder="e.g. Cruz" 
                                maxLength={50}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>LAST NAME <span style={{color: 'red'}}>*</span></label>
                            <input 
                                className={`${styles.inputField} ${errors.lastName ? styles.errorBorder : ''}`} 
                                name="lastName" 
                                value={formData.lastName} 
                                onChange={handlePersonalChange} 
                                placeholder="e.g. Dela Cruz" 
                                maxLength={50}
                            />
                            {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
                        </div>
                    </div>
                     <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>BIRTHDATE <span style={{color: 'red'}}>*</span></label>
                            <input 
                                type="date" 
                                className={`${styles.inputField} ${errors.birthdate ? styles.errorBorder : ''}`} 
                                name="birthdate" 
                                onChange={handlePersonalChange} 
                                max={getMaxDate()} 
                            />
                            {errors.birthdate && <span className={styles.errorText}>{errors.birthdate}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <label>LICENSE NO. <span style={{color: 'red'}}>*</span></label>
                            <input 
                                className={`${styles.inputField} ${errors.licenseNumber ? styles.errorBorder : ''}`} 
                                name="licenseNumber" 
                                value={formData.licenseNumber} 
                                onChange={handlePersonalChange} 
                                placeholder="e.g. 1234567" 
                                maxLength={7}
                            />
                            {errors.licenseNumber && <span className={styles.errorText}>{errors.licenseNumber}</span>}
                        </div>
                         <div className={styles.formGroup}>
                            <label>SPECIALIZATION <span style={{color: 'red'}}>*</span></label>
                            <select 
                                className={`${styles.inputField} ${errors.specialization ? styles.errorBorder : ''}`} 
                                name="specialization" 
                                onChange={handlePersonalChange} 
                                defaultValue=""
                            >
                                <option value="" disabled hidden>Select</option>
                                <option>General Dentistry</option>
                                <option>Orthodontics</option>
                                <option>Pediatric Dentistry</option>
                            </select>
                            {errors.specialization && <span className={styles.errorText}>{errors.specialization}</span>}
                        </div>
                    </div>
                    
                    <div className={styles.row}>
                         <div className={styles.formGroup}>
                            <label>EMAIL <span style={{color: 'red'}}>*</span></label>
                            <input 
                                type="email" 
                                className={`${styles.inputField} ${errors.email ? styles.errorBorder : ''}`} 
                                name="email" 
                                value={formData.email} 
                                onChange={handlePersonalChange} 
                                placeholder="e.g. juan@email.com" 
                                maxLength={100}
                            />
                            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                        </div>
                         <div className={styles.formGroup}>
                            <label>PHONE <span style={{color: 'red'}}>*</span></label>
                            <div className={styles.phoneInputGroup}>
                                <span className={styles.phonePrefix}>+63</span>
                                <input 
                                    className={`${styles.phoneField} ${errors.phone ? styles.errorBorder : ''}`} 
                                    name="phone" 
                                    value={formData.phone} 
                                    onChange={handlePhoneChange} 
                                    placeholder="9123456789" 
                                    maxLength={10}
                                />
                            </div>
                            {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                        </div>
                    </div>

                    {/* --- ACCOUNT SECURITY --- */}
                    <h3 className={styles.mainSectionTitle}>Account Security</h3>
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>PASSWORD <span style={{color: 'red'}}>*</span></label>
                            <input 
                                type="password" 
                                className={`${styles.inputField} ${errors.password ? styles.errorBorder : ''}`} 
                                name="password" 
                                value={formData.password}
                                onChange={handlePasswordChange} 
                                onFocus={() => setShowPasswordRules(true)}
                                onBlur={() => setShowPasswordRules(false)}
                                placeholder="••••••••" 
                                maxLength={20}
                            />
                            
                            {/* REAL TIME STRENGTH INDICATOR */}
                            {formData.password && (
                                <div style={{fontSize: '12px', marginTop: '5px', fontWeight: 500}}>
                                    Strength: <span style={{color: getStrengthColor()}}>{passwordStrength}</span>
                                </div>
                            )}

                            {/* VALIDATION ERROR (On Submit) */}
                            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <label>CONFIRM PASSWORD <span style={{color: 'red'}}>*</span></label>
                            <input 
                                type="password" 
                                className={`${styles.inputField} ${errors.confirmPassword ? styles.errorBorder : ''}`}
                                name="confirmPassword" 
                                value={formData.confirmPassword}
                                onChange={handleConfirmPasswordChange} 
                                placeholder="••••••••" 
                                maxLength={20}
                            />
                            {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
                        </div>
                    </div>

                    {/* PASSWORD RULES CHECKLIST (Visual Only) */}
                    {showPasswordRules && (
                        <div className={styles.passwordRulesContainer}>
                            <p className={styles.rulesLabel}>Password must contain:</p>
                            <ul className={styles.rulesList}>
                                <li className={passwordCriteria.length ? styles.validRule : styles.invalidRule}>
                                    <span className={styles.ruleIcon}>{passwordCriteria.length ? '✓' : '○'}</span> 8-20 characters
                                </li>
                                <li className={passwordCriteria.uppercase ? styles.validRule : styles.invalidRule}>
                                    <span className={styles.ruleIcon}>{passwordCriteria.uppercase ? '✓' : '○'}</span> Uppercase letter
                                </li>
                                <li className={passwordCriteria.lowercase ? styles.validRule : styles.invalidRule}>
                                    <span className={styles.ruleIcon}>{passwordCriteria.lowercase ? '✓' : '○'}</span> Lowercase letter
                                </li>
                                <li className={passwordCriteria.number ? styles.validRule : styles.invalidRule}>
                                    <span className={styles.ruleIcon}>{passwordCriteria.number ? '✓' : '○'}</span> Number
                                </li>
                            </ul>
                        </div>
                    )}

                    <hr className={styles.divider} />

                    {/* ADDRESSES */}
                    {renderAddressFields('currentAddress', 'Current Address')}
                    
                    <div className={styles.permanentHeader}>
                        <h3 className={styles.sectionTitle}>Permanent Address</h3>
                        <div className={styles.checkboxContainer}>
                            <input type="checkbox" id="sameAddress" checked={isSameAddress} onChange={handleSameAddressToggle} />
                            <label htmlFor="sameAddress">Same as Current</label>
                        </div>
                    </div>
                    {isSameAddress ? <div className={styles.disabledOverlay}>{renderAddressFields('permanentAddress', '', true)}</div> : renderAddressFields('permanentAddress', '')}

                    {/* BUTTONS */}
                    <div className={styles.buttonGroup}>
                        <button type="button" className={styles.cancelBtn} onClick={() => navigate('/owner/manage-dentists')}>CANCEL</button>
                        <button type="submit" className={styles.submitBtn}>ADD DENTIST</button>
                    </div>
                </form>
            </div>

            {showSuccessModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <img src={successIcon} alt="Success" className={styles.modalIcon} />
                        <h3 className={styles.modalTitle}>Registration Successful!</h3>
                        <p className={styles.modalMessage}>Dentist has been added. An activation email has been sent.</p>
                        <button className={styles.closeLink} onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}