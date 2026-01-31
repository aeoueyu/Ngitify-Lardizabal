import React, { useState, useRef, useEffect } from 'react';
import styles from '../../styles/add-user/AddDentistPage.module.css';
import { useNavigate } from 'react-router-dom';
import { regions, provinces, cities, barangays } from '../../utils/addressData';

export default function AddDentistPage() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    // --- STATE MANAGEMENT ---
    const [isSameAddress, setIsSameAddress] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    // Initial State para sa Address
    const initialAddressState = {
        country: 'Philippines',
        region: '', province: '', city: '', barangay: '',
        houseNumber: '', street: ''
    };

    const [formData, setFormData] = useState({
        firstName: '', middleName: '', lastName: '', birthdate: '',
        email: '', phone: '', licenseNumber: '', specialization: '',
        password: '', confirmPassword: '', 
        currentAddress: { ...initialAddressState },
        permanentAddress: { ...initialAddressState }
    });

    // --- PASSWORD VALIDATION STATE ---
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false, uppercase: false, lowercase: false, number: false
    });

    const [passwordsMatch, setPasswordsMatch] = useState(true); 
    const [isFormValid, setIsFormValid] = useState(false); 

    // BAGONG STATE: Para sa pagpapakita ng Rules
    const [showPasswordRules, setShowPasswordRules] = useState(false);

    // --- LOGIC: HANDLE PASSWORD CHANGE ---
    const handlePasswordChange = (e) => {
        const val = e.target.value;
        setFormData({ ...formData, password: val });

        setPasswordCriteria({
            length: val.length >= 8,
            uppercase: /[A-Z]/.test(val),
            lowercase: /[a-z]/.test(val),
            number: /[0-9]/.test(val)
        });

        if (formData.confirmPassword) {
            setPasswordsMatch(val === formData.confirmPassword);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const val = e.target.value;
        setFormData({ ...formData, confirmPassword: val });
        setPasswordsMatch(val === formData.password);
    };

    // --- LOGIC: CHECK OVERALL FORM VALIDITY ---
    useEffect(() => {
        const { firstName, lastName, birthdate, email, phone, licenseNumber, specialization, password, confirmPassword } = formData;
        
        const basicFieldsFilled = firstName && lastName && birthdate && email && phone && licenseNumber && specialization;
        const isPasswordStrong = Object.values(passwordCriteria).every(Boolean);
        const isMatching = password === confirmPassword && password !== '';
        
        const { region, province, city, barangay, street, houseNumber } = formData.currentAddress;
        const addressFilled = region && province && city && barangay && street && houseNumber;

        setIsFormValid(basicFieldsFilled && isPasswordStrong && isMatching && addressFilled);

    }, [formData, passwordCriteria]);


    // --- EXISTING HANDLERS (Image, Address, etc.) ---
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfileImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => fileInputRef.current.click();

    const getMaxDate = () => {
        const today = new Date();
        today.setFullYear(today.getFullYear() - 21);
        return today.toISOString().split('T')[0]; 
    };

    const handlePersonalChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); 
        if (value.length <= 10) { 
            setFormData({ ...formData, phone: value });
        }
    };

    const handleAddressChange = (type, field, value) => {
        setFormData(prev => {
            const updatedAddress = { ...prev[type], [field]: value };
            if (field === 'region') {
                updatedAddress.province = ''; updatedAddress.city = ''; updatedAddress.barangay = '';
            } else if (field === 'province') {
                updatedAddress.city = ''; updatedAddress.barangay = '';
            } else if (field === 'city') {
                updatedAddress.barangay = '';
            }

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
        } else {
            setFormData(prev => ({ ...prev, permanentAddress: { ...initialAddressState } }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid) return; 

        const finalData = {
            ...formData,
            phone: `+63${formData.phone}`,
            profileImage: profileImage
        };

        console.log("Submitting Data:", finalData);
        alert("Dentist Account Created Successfully!");
        navigate('/owner/manage-dentists');
    };

    // Helper for Address Rendering
    const renderAddressFields = (type, title, isDisabled = false) => {
        const address = formData[type];
        const availableProvinces = address.region ? provinces[address.region] || [] : [];
        const availableCities = address.province ? cities[address.province] || [] : [];
        const availableBarangays = address.city ? barangays[address.city] || [] : [];

        return (
            <div className={styles.addressSection}>
                <h3 className={styles.sectionTitle}>{title}</h3>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>COUNTRY</label>
                        <select className={styles.inputField} value={address.country} disabled={true}><option value="Philippines">Philippines</option></select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>REGION</label>
                        <select className={styles.inputField} value={address.region} onChange={(e) => handleAddressChange(type, 'region', e.target.value)} disabled={isDisabled} required>
                            <option value="" disabled hidden>Select Region</option>
                            {regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>PROVINCE</label>
                        <select className={styles.inputField} value={address.province} onChange={(e) => handleAddressChange(type, 'province', e.target.value)} disabled={isDisabled || !address.region} required>
                            <option value="" disabled hidden>Select Province</option>
                            {availableProvinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>CITY / MUNICIPALITY</label>
                        <select className={styles.inputField} value={address.city} onChange={(e) => handleAddressChange(type, 'city', e.target.value)} disabled={isDisabled || !address.province} required>
                            <option value="" disabled hidden>Select City</option>
                            {availableCities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>BARANGAY</label>
                        <select className={styles.inputField} value={address.barangay} onChange={(e) => handleAddressChange(type, 'barangay', e.target.value)} disabled={isDisabled || !address.city} required>
                            <option value="" disabled hidden>Select Barangay</option>
                            {availableBarangays.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>STREET NAME</label>
                        <input type="text" className={styles.inputField} value={address.street} onChange={(e) => handleAddressChange(type, 'street', e.target.value)} placeholder="Street Name" disabled={isDisabled} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>HOUSE NUMBER</label>
                        <input type="text" className={styles.inputField} value={address.houseNumber} onChange={(e) => handleAddressChange(type, 'houseNumber', e.target.value)} placeholder="House / Unit No." disabled={isDisabled} required />
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
                    <p>Enter the dentist's professional and personal details below.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* IMAGE UPLOAD */}
                    <div className={styles.uploadSection}>
                        <div className={styles.imageWrapper} onClick={triggerFileInput}>
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className={styles.previewImage} />
                            ) : (
                                <div className={styles.uploadPlaceholder}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                                    <span>Upload Photo</span>
                                </div>
                            )}
                        </div>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                        <p className={styles.uploadHint}>Optional. Click circle to upload.</p>
                    </div>

                    {/* PERSONAL INFO */}
                    <h3 className={styles.mainSectionTitle}>Personal Information</h3>
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>FIRST NAME</label>
                            <input type="text" name="firstName" className={styles.inputField} placeholder="e.g. Juan" onChange={handlePersonalChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>MIDDLE NAME</label>
                            <input type="text" name="middleName" className={styles.inputField} placeholder="Optional" onChange={handlePersonalChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>LAST NAME</label>
                            <input type="text" name="lastName" className={styles.inputField} placeholder="e.g. Santos" onChange={handlePersonalChange} required />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>BIRTH DATE (Must be 21+)</label>
                            <input type="date" name="birthdate" className={styles.inputField} max={getMaxDate()} onChange={handlePersonalChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>SPECIALIZATION</label>
                            <select name="specialization" className={styles.inputField} onChange={handlePersonalChange} required defaultValue="">
                                <option value="" disabled hidden>Select Specialization</option>
                                <option value="General Dentistry">General Dentistry</option>
                                <option value="Orthodontics">Orthodontics</option>
                                <option value="Pediatric Dentistry">Pediatric Dentistry</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>PRC LICENSE NO.</label>
                            <input type="text" name="licenseNumber" className={styles.inputField} onChange={handlePersonalChange} required />
                        </div>
                    </div>

                    {/* CONTACT INFO */}
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>EMAIL ADDRESS</label>
                            <input type="email" name="email" className={styles.inputField} placeholder="e.g. doc@gmail.com" onChange={handlePersonalChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>PHONE NUMBER</label>
                            <div className={styles.phoneInputGroup}>
                                <span className={styles.phonePrefix}>+63</span>
                                <input type="text" name="phone" className={styles.phoneField} placeholder="9123456789" value={formData.phone} onChange={handlePhoneChange} required />
                            </div>
                        </div>
                    </div>

                    <hr className={styles.divider} />

                    {/* --- ACCOUNT PASSWORD SECTION --- */}
                    <h3 className={styles.mainSectionTitle}>Account Security</h3>
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>PASSWORD</label>
                            <input 
                                type="password" 
                                name="password" 
                                className={styles.inputField} 
                                placeholder="Create Password" 
                                onChange={handlePasswordChange}
                                // ADDED HANDLERS HERE
                                onFocus={() => setShowPasswordRules(true)}
                                onBlur={() => setShowPasswordRules(false)}
                                value={formData.password}
                                required 
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>CONFIRM PASSWORD</label>
                            <input 
                                type="password" 
                                name="confirmPassword" 
                                className={`${styles.inputField} ${!passwordsMatch ? styles.errorBorder : ''}`} 
                                placeholder="Repeat Password" 
                                onChange={handleConfirmPasswordChange} 
                                value={formData.confirmPassword}
                                required 
                            />
                            {!passwordsMatch && <span className={styles.errorText}>Passwords do not match</span>}
                        </div>
                    </div>

                    {/* PASSWORD RULES CHECKLIST (CONDITIONAL RENDERING) */}
                    {/* Lalabas lang ito kapag 'showPasswordRules' ay true */}
                    {showPasswordRules && (
                        <div className={styles.passwordRulesContainer}>
                            <p className={styles.rulesLabel}>Password must contain:</p>
                            <ul className={styles.rulesList}>
                                <li className={passwordCriteria.length ? styles.validRule : styles.invalidRule}>
                                    <span className={styles.ruleIcon}>{passwordCriteria.length ? '✓' : '○'}</span>
                                    At least 8 characters
                                </li>
                                <li className={passwordCriteria.uppercase ? styles.validRule : styles.invalidRule}>
                                    <span className={styles.ruleIcon}>{passwordCriteria.uppercase ? '✓' : '○'}</span>
                                    At least one uppercase letter (A-Z)
                                </li>
                                <li className={passwordCriteria.lowercase ? styles.validRule : styles.invalidRule}>
                                    <span className={styles.ruleIcon}>{passwordCriteria.lowercase ? '✓' : '○'}</span>
                                    At least one lowercase letter (a-z)
                                </li>
                                <li className={passwordCriteria.number ? styles.validRule : styles.invalidRule}>
                                    <span className={styles.ruleIcon}>{passwordCriteria.number ? '✓' : '○'}</span>
                                    At least one number (0-9)
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
                            <label htmlFor="sameAddress">Same as Current Address</label>
                        </div>
                    </div>

                    {isSameAddress ? <div className={styles.disabledOverlay}>{renderAddressFields('permanentAddress', '', true)}</div> : renderAddressFields('permanentAddress', '')}

                    {/* BUTTONS */}
                    <div className={styles.buttonGroup}>
                        <button type="button" className={styles.cancelBtn} onClick={() => navigate('/owner/manage-dentists')}>CANCEL</button>
                        
                        <button 
                            type="submit" 
                            className={`${styles.submitBtn} ${!isFormValid ? styles.disabledBtn : ''}`}
                            disabled={!isFormValid}
                        >
                            CREATE ACCOUNT
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}