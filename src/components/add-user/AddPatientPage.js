import React, { useState, useRef } from 'react';
import styles from '../../styles/add-user/AddPatientPage.module.css'; // Reuse CSS (with new Patient styles appended)
import { useNavigate } from 'react-router-dom';
import { regions, provinces, cities, barangays } from '../../utils/addressData';
import successIcon from '../../assets/alert-icons/success.svg';

export default function AddPatientPage() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    // STATES
    const [isSameAddress, setIsSameAddress] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isMinor, setIsMinor] = useState(false); // Track if age < 13

    // Password States
    const [passwordCriteria, setPasswordCriteria] = useState({ length: false, uppercase: false, lowercase: false, number: false });
    const [showPasswordRules, setShowPasswordRules] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');

    const [formData, setFormData] = useState({
        firstName: '', middleName: '', lastName: '', birthdate: '',
        email: '', phone: '', password: '', confirmPassword: '',
        currentAddress: { country: 'Philippines', region: '', province: '', city: '', barangay: '', houseNumber: '', street: '' },
        permanentAddress: { country: 'Philippines', region: '', province: '', city: '', barangay: '', houseNumber: '', street: '' },
        
        // GUARDIAN (For minors)
        guardian: { name: '', relationship: '', contactNumber: '' },

        // MEDICAL HISTORY
        medicalHistory: {
            allergies: [],
            conditions: [],
            hospitalized: '',
            medications: '',
            surgeries: ''
        }
    });

    const [errors, setErrors] = useState({});

    // LISTS
    const allergyOptions = ['Local Anesthetic', 'Antibiotics', 'Sulfa Drugs', 'Aspirin', 'Latex', 'Dairy', 'Peanuts'];
    const conditionOptions = ['High Blood Pressure', 'Diabetes', 'Asthma', 'Heart Disease', 'Liver Disease', 'Epilepsy', 'Tuberculosis'];

    // UTILS
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const toTitleCase = (str) => str.toLowerCase().replace(/(?:^|\s|-|\.)\S/g, (char) => char.toUpperCase());
    const getStrengthColor = () => {
        if (passwordStrength === 'Weak') return '#d32f2f';
        if (passwordStrength === 'Moderate') return '#f57f17';
        if (passwordStrength === 'Strong') return '#388e3c';
        return '#ccc';
    };

    // HANDLERS
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfileImage(reader.result);
            reader.readAsDataURL(file);
        }
    };
    const triggerFileInput = () => fileInputRef.current.click();

    // Age Check Logic (Triggers isMinor)
    const handleBirthdateChange = (e) => {
        const val = e.target.value;
        const today = new Date();
        const birthDate = new Date(val);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

        setIsMinor(age < 13);
        
        // Clear birthdate error
        if (errors.birthdate) setErrors(prev => { const n = {...prev}; delete n.birthdate; return n; });
        setFormData(prev => ({ ...prev, birthdate: val }));
    };

    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        if (errors[name]) setErrors(prev => { const n = {...prev}; delete n[name]; return n; });

        if (['firstName', 'middleName', 'lastName'].includes(name)) {
            if (value === '' || /^[a-zA-Z\s.-]+$/.test(value)) setFormData({ ...formData, [name]: toTitleCase(value) });
            return;
        }
        setFormData({ ...formData, [name]: value });
    };

    // Guardian Input Handler
    const handleGuardianChange = (e) => {
        const { name, value } = e.target;
        // name example: guardian_name, guardian_relationship
        const field = name.split('_')[1];
        
        if (errors[name]) setErrors(prev => { const n = {...prev}; delete n[name]; return n; });

        setFormData(prev => ({ ...prev, guardian: { ...prev.guardian, [field]: value } }));
    };

    // Medical Checkbox Handler
    const handleCheckboxChange = (category, item) => {
        setFormData(prev => {
            const list = prev.medicalHistory[category];
            const newList = list.includes(item) 
                ? list.filter(i => i !== item) // Remove
                : [...list, item]; // Add
            
            return {
                ...prev,
                medicalHistory: { ...prev.medicalHistory, [category]: newList }
            };
        });
    };

    // Medical Text Handler
    const handleMedicalTextChange = (e) => {
        const { name, value } = e.target;
        // name example: med_hospitalized
        const field = name.split('_')[1];
        setFormData(prev => ({ ...prev, medicalHistory: { ...prev.medicalHistory, [field]: value } }));
    };

    const handlePasswordChange = (e) => {
        const val = e.target.value;
        setFormData({ ...formData, password: val });
        if (errors.password) setErrors(prev => ({...prev, password: ''}));

        if (formData.confirmPassword && val !== formData.confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
        } else {
            setErrors(prev => { const n = {...prev}; delete n.confirmPassword; return n; });
        }

        const criteria = { length: val.length >= 8, uppercase: /[A-Z]/.test(val), lowercase: /[a-z]/.test(val), number: /[0-9]/.test(val) };
        setPasswordCriteria(criteria);
        const metCount = Object.values(criteria).filter(Boolean).length;
        setPasswordStrength(val.length === 0 ? '' : metCount < 3 ? 'Weak' : metCount === 3 ? 'Moderate' : 'Strong');
    };

    const handleConfirmPasswordChange = (e) => {
        const val = e.target.value;
        setFormData({ ...formData, confirmPassword: val });
        if (val !== formData.password) setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
        else setErrors(prev => { const n = {...prev}; delete n.confirmPassword; return n; });
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length > 10) return;
        if (errors.phone) setErrors(prev => ({...prev, phone: ''}));
        setFormData({ ...formData, phone: value });
    };

    const handleAddressChange = (type, field, value) => {
        const errorKey = `${type === 'currentAddress' ? 'current' : 'permanent'}_${field}`;
        if (errors[errorKey]) setErrors(prev => { const n = {...prev}; delete n[errorKey]; return n; });

        setFormData(prev => {
            const updatedAddress = { ...prev[type], [field]: value };
            if (field === 'region') { updatedAddress.province = ''; updatedAddress.city = ''; updatedAddress.barangay = ''; }
            else if (field === 'province') { updatedAddress.city = ''; updatedAddress.barangay = ''; }
            else if (field === 'city') { updatedAddress.barangay = ''; }

            if (type === 'currentAddress' && isSameAddress) return { ...prev, currentAddress: updatedAddress, permanentAddress: updatedAddress };
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
                Object.keys(newErrors).forEach(key => { if(key.startsWith('permanent_')) delete newErrors[key]; });
                return newErrors;
            });
        } else {
            setFormData(prev => ({ ...prev, permanentAddress: { country: 'Philippines', region: '', province: '', city: '', barangay: '', houseNumber: '', street: '' } }));
        }
    };

    // VALIDATION
    const validateForm = () => {
        let newErrors = {};
        let isValid = true;
        const requiredFields = ['firstName', 'lastName', 'birthdate', 'email', 'confirmPassword'];
        requiredFields.forEach(field => { if (!formData[field]) { newErrors[field] = "This field is required"; isValid = false; } });

        // Minor Validation
        if (isMinor) {
            if (!formData.guardian.name) { newErrors.guardian_name = "Required for minors"; isValid = false; }
            if (!formData.guardian.relationship) { newErrors.guardian_relationship = "Required"; isValid = false; }
            if (!formData.guardian.contactNumber) { newErrors.guardian_contactNumber = "Required"; isValid = false; }
        }

        if (!formData.password) { newErrors.password = "This field is required"; isValid = false; }
        else if (passwordStrength !== 'Strong') { newErrors.password = "Password must be Strong"; isValid = false; }

        if (!formData.phone) { newErrors.phone = "This field is required"; isValid = false; }
        else if (formData.phone.length !== 10 || formData.phone[0] !== '9') { newErrors.phone = "Must start with 9 and be 10 digits"; isValid = false; }

        if (formData.email && !validateEmail(formData.email)) { newErrors.email = "Invalid email format"; isValid = false; }
        if (formData.password !== formData.confirmPassword) { newErrors.confirmPassword = "Passwords do not match"; isValid = false; }

        const validateAddr = (addr, prefix) => {
            ['region', 'province', 'city', 'barangay', 'street', 'houseNumber'].forEach(field => {
                if (!addr[field]) { newErrors[`${prefix}_${field}`] = "Required"; isValid = false; }
            });
        };
        validateAddr(formData.currentAddress, 'current');
        if (!isSameAddress) validateAddr(formData.permanentAddress, 'permanent');

        setErrors(newErrors);
        if (!isValid) {
            const firstErrorKey = Object.keys(newErrors)[0];
            setTimeout(() => {
                const errorElement = document.getElementsByName(firstErrorKey)[0];
                if (errorElement) { errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' }); errorElement.focus(); }
            }, 100);
        }
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const finalData = { ...formData, phone: `+63${formData.phone}`, profileImage };

        try {
            const response = await fetch('http://localhost:5000/api/add-patient', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            });

            const data = await response.json();

            if (response.ok) {
                setShowSuccessModal(true);
            } else {
                // HANDLE EMAIL EXISTS ERROR
                if (response.status === 409 && data.field === 'email') {
                    setErrors({ email: data.message });
                    // Auto-scroll to email field
                    const emailField = document.getElementsByName('email')[0];
                    if (emailField) {
                        emailField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        emailField.focus();
                    }
                } else {
                    alert(data.message || "Failed to add patient");
                }
            }
        } catch (error) { console.error("Error:", error); alert("Cannot connect to server."); }
    };

    // ... (Use same renderAddressFields as AddDentistPage) ...
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
                        <select name={`${prefix}_region`} className={`${styles.inputField} ${getErrorClass('region')}`} value={address.region} onChange={(e) => handleAddressChange(type, 'region', e.target.value)} disabled={isDisabled}>
                            <option value="" disabled hidden>Select Region</option>
                            {regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                        </select>
                        {getError('region') && <span className={styles.errorText}>{getError('region')}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>PROVINCE <span style={{color: 'red'}}>*</span></label>
                        <select name={`${prefix}_province`} className={`${styles.inputField} ${getErrorClass('province')}`} value={address.province} onChange={(e) => handleAddressChange(type, 'province', e.target.value)} disabled={isDisabled || !address.region}>
                            <option value="" disabled hidden>Select Province</option>
                            {availableProvinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                        </select>
                        {getError('province') && <span className={styles.errorText}>{getError('province')}</span>}
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>CITY / MUNICIPALITY <span style={{color: 'red'}}>*</span></label>
                        <select name={`${prefix}_city`} className={`${styles.inputField} ${getErrorClass('city')}`} value={address.city} onChange={(e) => handleAddressChange(type, 'city', e.target.value)} disabled={isDisabled || !address.province}>
                            <option value="" disabled hidden>Select City</option>
                            {availableCities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                        {getError('city') && <span className={styles.errorText}>{getError('city')}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>BARANGAY <span style={{color: 'red'}}>*</span></label>
                        <select name={`${prefix}_barangay`} className={`${styles.inputField} ${getErrorClass('barangay')}`} value={address.barangay} onChange={(e) => handleAddressChange(type, 'barangay', e.target.value)} disabled={isDisabled || !address.city}>
                            <option value="" disabled hidden>Select Barangay</option>
                            {availableBarangays.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        {getError('barangay') && <span className={styles.errorText}>{getError('barangay')}</span>}
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>STREET <span style={{color: 'red'}}>*</span></label>
                        <input name={`${prefix}_street`} className={`${styles.inputField} ${getErrorClass('street')}`} value={address.street} onChange={(e) => handleAddressChange(type, 'street', e.target.value)} disabled={isDisabled} placeholder="e.g. Mabini Street" maxLength={100}/>
                        {getError('street') && <span className={styles.errorText}>{getError('street')}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>HOUSE NO. <span style={{color: 'red'}}>*</span></label>
                        <input name={`${prefix}_houseNumber`} className={`${styles.inputField} ${getErrorClass('houseNumber')}`} value={address.houseNumber} onChange={(e) => handleAddressChange(type, 'houseNumber', e.target.value)} disabled={isDisabled} placeholder="e.g. Unit 123" maxLength={20}/>
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
                    <h2>Add New <span className={styles.highlight}>Patient</span></h2>
                    <p>Register a new patient record.</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className={styles.uploadSection}>
                        <div className={styles.imageWrapper} onClick={triggerFileInput}>
                            {profileImage ? <img src={profileImage} alt="Profile" className={styles.previewImage} /> : <div className={styles.uploadPlaceholder}><span>Upload Photo</span></div>}
                        </div>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                    </div>

                    <h3 className={styles.mainSectionTitle}>Personal Information</h3>
                    <div className={styles.row}>
                        <div className={styles.formGroup}><label>FIRST NAME <span style={{color: 'red'}}>*</span></label><input className={`${styles.inputField} ${errors.firstName ? styles.errorBorder : ''}`} name="firstName" value={formData.firstName} onChange={handlePersonalChange} placeholder="e.g. Juan" maxLength={50}/>{errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}</div>
                        <div className={styles.formGroup}><label>MIDDLE NAME</label><input className={styles.inputField} name="middleName" value={formData.middleName} onChange={handlePersonalChange} placeholder="e.g. Cruz" maxLength={50}/></div>
                        <div className={styles.formGroup}><label>LAST NAME <span style={{color: 'red'}}>*</span></label><input className={`${styles.inputField} ${errors.lastName ? styles.errorBorder : ''}`} name="lastName" value={formData.lastName} onChange={handlePersonalChange} placeholder="e.g. Dela Cruz" maxLength={50}/>{errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}</div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>BIRTHDATE <span style={{color: 'red'}}>*</span></label>
                            <input type="date" className={`${styles.inputField} ${errors.birthdate ? styles.errorBorder : ''}`} name="birthdate" onChange={handleBirthdateChange} />
                            {errors.birthdate && <span className={styles.errorText}>{errors.birthdate}</span>}
                            {isMinor && <span className={styles.minorAlertText}>Patient is under 13. Guardian required.</span>}
                        </div>
                        <div className={styles.formGroup}><label>EMAIL <span style={{color: 'red'}}>*</span></label><input type="email" className={`${styles.inputField} ${errors.email ? styles.errorBorder : ''}`} name="email" value={formData.email} onChange={handlePersonalChange} placeholder="e.g. juan@email.com" maxLength={100}/>{errors.email && <span className={styles.errorText}>{errors.email}</span>}</div>
                        <div className={styles.formGroup}><label>PHONE <span style={{color: 'red'}}>*</span></label><div className={styles.phoneInputGroup}><span className={styles.phonePrefix}>+63</span><input className={`${styles.phoneField} ${errors.phone ? styles.errorBorder : ''}`} name="phone" value={formData.phone} onChange={handlePhoneChange} placeholder="9123456789" maxLength={10}/></div>{errors.phone && <span className={styles.errorText}>{errors.phone}</span>}</div>
                    </div>

                    {/* GUARDIAN SECTION (CONDITIONAL) */}
                    {isMinor && (
                        <div className={styles.guardianAlert}>
                            <div className={styles.guardianTitle}>Guardian Information</div>
                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>GUARDIAN NAME <span style={{color: 'red'}}>*</span></label>
                                    <input className={`${styles.inputField} ${errors.guardian_name ? styles.errorBorder : ''}`} name="guardian_name" onChange={handleGuardianChange} maxLength={50}/>
                                    {errors.guardian_name && <span className={styles.errorText}>{errors.guardian_name}</span>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>RELATIONSHIP <span style={{color: 'red'}}>*</span></label>
                                    <input className={`${styles.inputField} ${errors.guardian_relationship ? styles.errorBorder : ''}`} name="guardian_relationship" onChange={handleGuardianChange} placeholder="e.g. Mother" maxLength={30}/>
                                    {errors.guardian_relationship && <span className={styles.errorText}>{errors.guardian_relationship}</span>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>CONTACT NO. <span style={{color: 'red'}}>*</span></label>
                                    <input className={`${styles.inputField} ${errors.guardian_contactNumber ? styles.errorBorder : ''}`} name="guardian_contactNumber" onChange={handleGuardianChange} maxLength={15}/>
                                    {errors.guardian_contactNumber && <span className={styles.errorText}>{errors.guardian_contactNumber}</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* MEDICAL HISTORY CHECKLIST */}
                    <hr className={styles.divider} />
                    <h3 className={styles.mainSectionTitle}>Medical History</h3>
                    
                    <div className={styles.row}>
                        <div className={styles.formGroup} style={{flex: 1}}>
                            <span className={styles.checkboxGroupLabel}>Allergies</span>
                            <div className={styles.checkboxGrid}>
                                {allergyOptions.map(item => (
                                    <label key={item} className={styles.checkboxItem}>
                                        <input type="checkbox" className={styles.checkboxInput} checked={formData.medicalHistory.allergies.includes(item)} onChange={() => handleCheckboxChange('allergies', item)} />
                                        {item}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className={styles.formGroup} style={{flex: 1}}>
                            <span className={styles.checkboxGroupLabel}>Conditions</span>
                            <div className={styles.checkboxGrid}>
                                {conditionOptions.map(item => (
                                    <label key={item} className={styles.checkboxItem}>
                                        <input type="checkbox" className={styles.checkboxInput} checked={formData.medicalHistory.conditions.includes(item)} onChange={() => handleCheckboxChange('conditions', item)} />
                                        {item}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.row} style={{marginTop: '20px'}}>
                        <div className={styles.formGroup}><label>HOSPITALIZED? (WHEN/WHY)</label><input className={styles.inputField} name="med_hospitalized" onChange={handleMedicalTextChange} placeholder="Type details or 'No'" maxLength={100}/></div>
                        <div className={styles.formGroup}><label>CURRENT MEDICATIONS</label><input className={styles.inputField} name="med_medications" onChange={handleMedicalTextChange} placeholder="List medications" maxLength={100}/></div>
                    </div>

                    <h3 className={styles.mainSectionTitle}>Account Security</h3>
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>PASSWORD <span style={{color: 'red'}}>*</span></label>
                            <input type="password" className={`${styles.inputField} ${errors.password ? styles.errorBorder : ''}`} name="password" value={formData.password} onChange={handlePasswordChange} onFocus={() => setShowPasswordRules(true)} onBlur={() => setShowPasswordRules(false)} placeholder="••••••••" maxLength={20}/>
                            {formData.password && (<div style={{fontSize: '12px', marginTop: '5px', fontWeight: 500}}>Strength: <span style={{color: getStrengthColor()}}>{passwordStrength}</span></div>)}
                            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <label>CONFIRM PASSWORD <span style={{color: 'red'}}>*</span></label>
                            <input type="password" className={`${styles.inputField} ${errors.confirmPassword ? styles.errorBorder : ''}`} name="confirmPassword" value={formData.confirmPassword} onChange={handleConfirmPasswordChange} placeholder="••••••••" maxLength={20}/>
                            {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
                        </div>
                    </div>
                    {/* Rules (Same as others) */}
                    {showPasswordRules && (
                        <div className={styles.passwordRulesContainer}>
                            <p className={styles.rulesLabel}>Password must contain:</p>
                            <ul className={styles.rulesList}>
                                <li className={passwordCriteria.length ? styles.validRule : styles.invalidRule}><span className={styles.ruleIcon}>{passwordCriteria.length ? '✓' : '○'}</span> 8-20 characters</li>
                                <li className={passwordCriteria.uppercase ? styles.validRule : styles.invalidRule}><span className={styles.ruleIcon}>{passwordCriteria.uppercase ? '✓' : '○'}</span> Uppercase letter</li>
                                <li className={passwordCriteria.lowercase ? styles.validRule : styles.invalidRule}><span className={styles.ruleIcon}>{passwordCriteria.lowercase ? '✓' : '○'}</span> Lowercase letter</li>
                                <li className={passwordCriteria.number ? styles.validRule : styles.invalidRule}><span className={styles.ruleIcon}>{passwordCriteria.number ? '✓' : '○'}</span> Number</li>
                            </ul>
                        </div>
                    )}

                    <hr className={styles.divider} />
                    {renderAddressFields('currentAddress', 'Current Address')}
                    <div className={styles.permanentHeader}>
                        <h3 className={styles.sectionTitle}>Permanent Address</h3>
                        <div className={styles.checkboxContainer}><input type="checkbox" id="sameAddress" checked={isSameAddress} onChange={handleSameAddressToggle} /><label htmlFor="sameAddress">Same as Current</label></div>
                    </div>
                    {isSameAddress ? <div className={styles.disabledOverlay}>{renderAddressFields('permanentAddress', '', true)}</div> : renderAddressFields('permanentAddress', '')}

                    <div className={styles.buttonGroup}>
                        <button type="button" className={styles.cancelBtn} onClick={() => navigate('/owner/manage-patients')}>CANCEL</button>
                        <button type="submit" className={styles.submitBtn}>ADD PATIENT</button>
                    </div>
                </form>
            </div>
            {showSuccessModal && (<div className={styles.modalOverlay}><div className={styles.modalCard}><img src={successIcon} alt="Success" className={styles.modalIcon} /><h3 className={styles.modalTitle}>Registration Successful!</h3><p className={styles.modalMessage}>Patient has been added. An activation email has been sent.</p><button className={styles.closeLink} onClick={() => navigate('/owner/manage-patients')}>Close</button></div></div>)}
        </div>
    );
}