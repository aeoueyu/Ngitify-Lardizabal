import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styles/settings/SettingsPage.module.css';
import { regions, provinces, cities, barangays } from '../../utils/addressData';
import successIcon from '../../assets/alert-icons/success.svg';
import warningIcon from '../../assets/alert-icons/warning.svg';

export default function SettingsPage({ section }) {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('role'); 
    const fileInputRef = useRef(null);
    
    // UI States
    const activeTab = section || 'personal'; 
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    // Modals
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    
    // Password UI
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    // Data States
    const [initialData, setInitialData] = useState({});
    const [profileImage, setProfileImage] = useState(null);
    const [initialImage, setInitialImage] = useState(null);
    
    const initialAddressState = { country: 'Philippines', region: '', province: '', city: '', barangay: '', houseNumber: '', street: '' };

    const [formData, setFormData] = useState({
        firstName: '', middleName: '', lastName: '', email: '', phone: '', birthdate: '',
        licenseNumber: '', specialization: '', 
        currentAddress: { ...initialAddressState },
        permanentAddress: { ...initialAddressState }
    });

    const [isSameAddress, setIsSameAddress] = useState(false);
    
    // Password Data States
    const [isTempPassword, setIsTempPassword] = useState(false);
    const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });
    
    // VALIDATION STATES
    const [currentPassVerified, setCurrentPassVerified] = useState(false); 
    const [currentPassError, setCurrentPassError] = useState(false); 
    const [matchError, setMatchError] = useState(false); 
    const [serverError, setServerError] = useState('');
    const [errors, setErrors] = useState({}); // Field-specific errors

    const [validations, setValidations] = useState({
        length: false, upper: false, lower: false, number: false, special: false
    });

    // OPTIONS (Same as AddDentist)
    const specializationOptions = [
        "General Dentist", "Orthodontist", "Pediatric Dentist (Pedodontist)", 
        "Periodontist", "Endodontist", "Oral & Maxillofacial Surgeon", 
        "Prosthodontist", "Cosmetic Dentist"
    ];

    // --- HELPERS (MATCHING ADD DENTIST) ---
    const toTitleCase = (str) => str.toLowerCase().replace(/(?:^|\s|-|\.)\S/g, (char) => char.toUpperCase());
    
    const validateEmail = (email) => {
        const formatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formatRegex.test(email)) return false;
        const allowedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'live.com'];
        const domain = email.split('@')[1].toLowerCase();
        return allowedDomains.includes(domain);
    };

    const getMaxDate = () => { 
        // Logic: 18+ for general users (Secretary/Patient), 21+ for Dentist
        const minAge = userRole === 'dentist' ? 21 : 18;
        const t = new Date(); 
        t.setFullYear(t.getFullYear() - minAge); 
        return t.toISOString().split('T')[0]; 
    };

    const getAge = (d) => { 
        const today = new Date(); 
        const birth = new Date(d); 
        let age = today.getFullYear() - birth.getFullYear(); 
        const m = today.getMonth() - birth.getMonth(); 
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--; 
        return age; 
    };

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/user/${userId}`);
                const data = await res.json();
                if (res.ok) {
                    const currentAddr = data.currentAddress || initialAddressState;
                    const permanentAddr = data.permanentAddress || initialAddressState;
                    
                    const isSame = JSON.stringify(currentAddr) === JSON.stringify(permanentAddr);

                    const loadedData = {
                        firstName: data.name?.first || '',
                        middleName: data.name?.middle || '',
                        lastName: data.name?.last || '',
                        email: data.email || '',
                        phone: data.contactNumber?.replace('+63', '') || '',
                        birthdate: data.birthdate ? new Date(data.birthdate).toISOString().split('T')[0] : '',
                        licenseNumber: data.licenseNumber || '',
                        specialization: data.specialization || '',
                        currentAddress: currentAddr,
                        permanentAddress: permanentAddr
                    };
                    
                    setFormData(loadedData);
                    setInitialData(loadedData);
                    setProfileImage(data.profileImage);
                    setInitialImage(data.profileImage);
                    setIsSameAddress(isSame);
                    setIsTempPassword(!data.isPasswordChanged);
                }
            } catch (err) { console.error(err); } 
            finally { setIsLoading(false); }
        };
        if(userId) fetchUser();
    }, [userId]);

    // --- PERSONAL INFO HELPERS ---
    const handleEditToggle = () => {
        if (isEditing) {
            setFormData(initialData); // Revert
            setProfileImage(initialImage);
            setErrors({}); // Clear errors
            const isSame = JSON.stringify(initialData.currentAddress) === JSON.stringify(initialData.permanentAddress);
            setIsSameAddress(isSame);
        }
        setIsEditing(!isEditing);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfileImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Clear error on type
        if (errors[name]) setErrors(prev => { const n={...prev}; delete n[name]; return n; });

        // Name Validation (Title Case)
        if (['firstName', 'middleName', 'lastName'].includes(name)) {
            if (value === '' || /^[a-zA-Z\s.-]+$/.test(value)) {
                setFormData(prev => ({ ...prev, [name]: toTitleCase(value) }));
            }
            return;
        }
        
        // Phone Validation (Numbers Only)
        if (name === 'phone') {
            const numericValue = value.replace(/[^0-9]/g, '');
            if (numericValue.length <= 10) setFormData(prev => ({ ...prev, [name]: numericValue }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const hasChanges = () => {
        return JSON.stringify(formData) !== JSON.stringify(initialData) || profileImage !== initialImage;
    };

    // --- REAL-TIME VALIDATION (ON BLUR) ---
    const handleBlur = (e) => {
        const { name, value } = e.target;
        let newError = "";

        if (activeTab === 'personal') {
            switch (name) {
                case 'email': 
                    // Email is read-only but keep logic for consistency
                    if (!value) newError = "Required";
                    else if (!validateEmail(value)) newError = "Invalid email domain"; 
                    break;
                case 'phone': 
                    if (!value) newError = "Required";
                    else if (value.length !== 10 || value[0] !== '9') newError = "Invalid format"; 
                    break;
                case 'firstName': 
                case 'lastName': 
                case 'birthdate': 
                    if (!value) newError = "Required"; 
                    break;
                default: break;
            }
        }
        
        if (newError) setErrors(prev => ({ ...prev, [name]: newError }));
    };

    // --- ADDRESS HANDLERS ---
    const handleAddressChange = (type, field, value) => {
        const prefix = type === 'currentAddress' ? 'current' : 'permanent';
        const errorKey = `${prefix}_${field}`;
        if(errors[errorKey]) setErrors(prev=>{const n={...prev};delete n[errorKey];return n;});

        setFormData(prev => {
            const updatedAddr = { ...prev[type], [field]: value };
            
            if (field === 'region') { updatedAddr.province = ''; updatedAddr.city = ''; updatedAddr.barangay = ''; }
            else if (field === 'province') { updatedAddr.city = ''; updatedAddr.barangay = ''; }
            else if (field === 'city') { updatedAddr.barangay = ''; }
            
            const newState = { ...prev, [type]: updatedAddr };

            if (isSameAddress && type === 'currentAddress') {
                newState.permanentAddress = updatedAddr;
            }
            return newState;
        });
    };

    const handleSameAddressToggle = () => {
        if (!isEditing) return;
        const newStatus = !isSameAddress;
        setIsSameAddress(newStatus);
        if (newStatus) {
            setFormData(prev => ({ ...prev, permanentAddress: prev.currentAddress }));
            // Clear permanent address errors
            setErrors(prev=>{const n={...prev}; Object.keys(n).forEach(k=>{if(k.startsWith('permanent_'))delete n[k];}); return n;});
        } else {
            setFormData(prev => ({ ...prev, permanentAddress: { ...initialAddressState } })); 
        }
    };

    // --- FULL VALIDATION ---
    const validatePersonalForm = () => {
        let newErrors = {};
        let isValid = true;
        const required = ['firstName', 'lastName', 'birthdate', 'email'];
        required.forEach(f => { if(!formData[f]) { newErrors[f] = "Required"; isValid = false; }});

        if (!formData.phone) { newErrors.phone = "Required"; isValid = false; }
        else if (formData.phone.length !== 10 || formData.phone[0] !== '9') { newErrors.phone = "Invalid format"; isValid = false; }

        // Specialization Required for Dentists
        if (userRole === 'dentist' && !formData.specialization) {
            newErrors.specialization = "Required";
            isValid = false;
        }

        // Age Check based on Role
        const minAge = userRole === 'dentist' ? 21 : 18;
        if(formData.birthdate && getAge(formData.birthdate) < minAge) { 
            newErrors.birthdate = `Min age ${minAge}`; 
            isValid = false; 
        }

        const validateAddr = (addr, prefix) => {
            ['region', 'province', 'city', 'barangay', 'street', 'houseNumber'].forEach(f => {
                if(!addr[f]) { newErrors[`${prefix}_${f}`]="Required"; isValid=false; }
            });
        };
        validateAddr(formData.currentAddress, 'current');
        if(!isSameAddress) validateAddr(formData.permanentAddress, 'permanent');

        setErrors(newErrors);
        
        // Auto-Scroll to First Error
        if (!isValid) {
            const firstKey = Object.keys(newErrors)[0];
            const el = document.getElementsByName(firstKey)[0];
            if(el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
        }
        return isValid;
    };

    const handleSaveInfo = async () => {
        if (activeTab === 'personal') {
            if (!validatePersonalForm()) return;
            
            // Server Email Check (Should not happen if disabled, but good practice)
            if (formData.email && formData.email !== initialData.email) {
                try {
                    const res = await fetch('http://localhost:5000/api/check-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: formData.email, excludeId: userId }) 
                    });
                    if (res.status === 409) {
                        setErrors(prev => ({ ...prev, email: "Email already exists" }));
                        return;
                    }
                } catch (e) { console.error(e); }
            }
            setShowConfirmModal(true);
        } else {
            // ... Security validation logic
            setShowConfirmModal(true);
        }
    };

    const confirmUpdate = async () => {
        setShowConfirmModal(false);
        try {
            if (activeTab === 'personal') {
                const updatePayload = {
                    name: { first: formData.firstName, middle: formData.middleName, last: formData.lastName },
                    contactNumber: `+63${formData.phone}`, 
                    birthdate: formData.birthdate,
                    // licenseNumber not updated as it's read-only
                    specialization: formData.specialization,
                    currentAddress: formData.currentAddress,
                    permanentAddress: isSameAddress ? formData.currentAddress : formData.permanentAddress,
                    profileImage
                };

                const res = await fetch(`http://localhost:5000/api/user/${userId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatePayload)
                });

                if (res.ok) {
                    setModalMessage("Profile updated successfully!");
                    setShowSuccessModal(true);
                    setInitialData(formData); 
                    setInitialImage(profileImage);
                    setIsEditing(false); // EXIT EDIT MODE
                } else {
                    const d = await res.json();
                    alert(d.message || "Failed to update.");
                }

            } else {
                // Password Update
                const res = await fetch('http://localhost:5000/api/change-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, currentPassword: passData.current, newPassword: passData.new })
                });
                const d = await res.json();
                if (res.ok) {
                    setModalMessage("Password changed successfully.");
                    setShowSuccessModal(true);
                    setPassData({ current: '', new: '', confirm: '' });
                    setCurrentPassVerified(false);
                    setIsTempPassword(false);
                    setValidations({ length: false, upper: false, lower: false, number: false, special: false });
                } else {
                    setServerError(d.message || "Failed.");
                }
            }
        } catch (error) { console.error(error); }
    };

    // --- PASSWORD LOGIC (UNCHANGED) ---
    const handleVerifyCurrent = async () => {
        if (!passData.current) return;
        try {
            const res = await fetch('http://localhost:5000/api/verify-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, password: passData.current })
            });
            const data = await res.json();
            if (data.success) { setCurrentPassVerified(true); setCurrentPassError(false); } 
            else { setCurrentPassVerified(false); setCurrentPassError(true); }
        } catch (err) { console.error(err); }
    };

    const handlePassChange = (e) => {
        const { name, value } = e.target;
        setPassData(prev => ({ ...prev, [name]: value }));
        setServerError('');

        if (name === 'current') { setCurrentPassVerified(false); setCurrentPassError(false); }
        if (name === 'new') {
            setValidations({
                length: value.length >= 8,
                upper: /[A-Z]/.test(value),
                lower: /[a-z]/.test(value),
                number: /[0-9]/.test(value),
                special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
            });
            if (passData.confirm && value !== passData.confirm) setMatchError(true);
            else setMatchError(false);
        }
        if (name === 'confirm') {
            if (value !== passData.new) setMatchError(true);
            else setMatchError(false);
        }
    };

    const isFormValid = () => {
        const rulesMet = Object.values(validations).every(Boolean);
        const match = passData.new === passData.confirm && passData.new !== '';
        return currentPassVerified && rulesMet && match;
    };

    const handleSavePassword = async (e) => {
        e.preventDefault();
        if (!isFormValid()) return;
        setShowConfirmModal(true); // Re-use confirm modal for password too
    };

    // --- RENDER ADDRESS HELPERS ---
    const renderAddressFields = (type, title, disabledOverride = false) => {
        const addr = formData[type];
        const prefix = type === 'currentAddress' ? 'current' : 'permanent';
        const isDisabled = !isEditing || disabledOverride;
        
        const availProvinces = addr.region ? provinces[addr.region] || [] : [];
        const availCities = addr.province ? cities[addr.province] || [] : [];
        const availBarangays = addr.city ? barangays[addr.city] || [] : [];
        
        const getError = (field) => errors[`${prefix}_${field}`];
        const getErrorClass = (field) => getError(field) ? styles.errorBorder : '';

        return (
            <div className={styles.addressBlock}>
                <h3 className={styles.sectionTitle}>{title}</h3>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Region <span style={{color:'red'}}>*</span></label>
                        <select name={`${prefix}_region`} className={`${styles.inputField} ${getErrorClass('region')}`} value={addr.region} onChange={(e) => handleAddressChange(type, 'region', e.target.value)} disabled={isDisabled}>
                            <option value="" hidden>Select Region</option>
                            {regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                        </select>
                        {getError('region') && <span className={styles.errorText}>{getError('region')}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Province <span style={{color:'red'}}>*</span></label>
                        <select name={`${prefix}_province`} className={`${styles.inputField} ${getErrorClass('province')}`} value={addr.province} onChange={(e) => handleAddressChange(type, 'province', e.target.value)} disabled={isDisabled || !addr.region}>
                            <option value="" hidden>Select Province</option>
                            {availProvinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                        </select>
                        {getError('province') && <span className={styles.errorText}>{getError('province')}</span>}
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>City / Municipality <span style={{color:'red'}}>*</span></label>
                        <select name={`${prefix}_city`} className={`${styles.inputField} ${getErrorClass('city')}`} value={addr.city} onChange={(e) => handleAddressChange(type, 'city', e.target.value)} disabled={isDisabled || !addr.province}>
                            <option value="" hidden>Select City</option>
                            {availCities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                        {getError('city') && <span className={styles.errorText}>{getError('city')}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Barangay <span style={{color:'red'}}>*</span></label>
                        <select name={`${prefix}_barangay`} className={`${styles.inputField} ${getErrorClass('barangay')}`} value={addr.barangay} onChange={(e) => handleAddressChange(type, 'barangay', e.target.value)} disabled={isDisabled || !addr.city}>
                            <option value="" hidden>Select Barangay</option>
                            {availBarangays.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        {getError('barangay') && <span className={styles.errorText}>{getError('barangay')}</span>}
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Street <span style={{color:'red'}}>*</span></label>
                        <input name={`${prefix}_street`} className={`${styles.inputField} ${getErrorClass('street')}`} value={addr.street} onChange={(e) => handleAddressChange(type, 'street', e.target.value)} disabled={isDisabled} />
                        {getError('street') && <span className={styles.errorText}>{getError('street')}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>House No. <span style={{color:'red'}}>*</span></label>
                        <input name={`${prefix}_houseNumber`} className={`${styles.inputField} ${getErrorClass('houseNumber')}`} value={addr.houseNumber} onChange={(e) => handleAddressChange(type, 'houseNumber', e.target.value)} disabled={isDisabled} />
                        {getError('houseNumber') && <span className={styles.errorText}>{getError('houseNumber')}</span>}
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading) return <div>Loading...</div>;

    const { title, subtitle } = activeTab === 'security' 
        ? { title: <>Password & <span className={styles.highlight}>Security</span></>, subtitle: "Update your password and secure your account." }
        : { title: <>Personal <span className={styles.highlight}>Information</span></>, subtitle: "View and update your personal details." };

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>{title}</h1>
                    <p className={styles.subTitle}>{subtitle}</p>
                </div>
            </div>

            <div className={styles.formCard}>
                {activeTab === 'personal' && (
                    <>
                        <div className={styles.tabHeader}>
                            <h3 className={styles.sectionTitle}>Personal Details</h3>
                            {!isEditing && (
                                <button className={styles.editToggleBtn} onClick={() => setIsEditing(true)}>EDIT INFORMATION</button>
                            )}
                        </div>

                        <div className={styles.uploadSection}>
                            <div className={styles.imageWrapper} onClick={() => isEditing && fileInputRef.current.click()} style={{ cursor: isEditing ? 'pointer' : 'default', opacity: isEditing ? 1 : 0.9 }}>
                                {profileImage ? <img src={profileImage} alt="Profile" className={styles.previewImage} /> : <div className={styles.uploadPlaceholder}>No Image</div>}
                            </div>
                            <input type="file" ref={fileInputRef} style={{display:'none'}} onChange={handleImageChange} accept="image/*" disabled={!isEditing} />
                            {isEditing && <p className={styles.uploadHint}>Click image to change</p>}
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>First Name (Max 50) <span style={{color:'red'}}>*</span></label>
                                <input 
                                    className={`${styles.inputField} ${errors.firstName ? styles.errorBorder : ''}`} 
                                    name="firstName" 
                                    value={formData.firstName} 
                                    onChange={handleChange} 
                                    onBlur={handleBlur} 
                                    maxLength={50} 
                                    disabled={!isEditing}
                                />
                                {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
                            </div>
                            <div className={styles.formGroup}>
                                <label>Middle Name (Max 20)</label>
                                <input 
                                    className={styles.inputField} 
                                    name="middleName" 
                                    value={formData.middleName} 
                                    onChange={handleChange} 
                                    maxLength={20} 
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Last Name (Max 20) <span style={{color:'red'}}>*</span></label>
                                <input 
                                    className={`${styles.inputField} ${errors.lastName ? styles.errorBorder : ''}`} 
                                    name="lastName" 
                                    value={formData.lastName} 
                                    onChange={handleChange} 
                                    onBlur={handleBlur} 
                                    maxLength={20} 
                                    disabled={!isEditing}
                                />
                                {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>Birthdate <span style={{color:'red'}}>*</span></label>
                                <input 
                                    type="date" 
                                    className={`${styles.inputField} ${errors.birthdate ? styles.errorBorder : ''}`} 
                                    name="birthdate" 
                                    value={formData.birthdate} 
                                    onChange={handleChange} 
                                    onBlur={handleBlur}
                                    max={getMaxDate()} 
                                    disabled={!isEditing} 
                                />
                                {errors.birthdate && <span className={styles.errorText}>{errors.birthdate}</span>}
                            </div>
                            <div className={styles.formGroup}>
                                <label>Phone (+63) <span style={{color:'red'}}>*</span></label>
                                <div className={`${styles.phoneInputGroup} ${errors.phone ? styles.errorBorder : ''} ${!isEditing ? styles.disabledGroup : ''}`}>
                                    <span className={styles.phonePrefix}>+63</span>
                                    <input 
                                        className={styles.phoneField} 
                                        name="phone" 
                                        value={formData.phone} 
                                        onChange={handleChange} 
                                        onBlur={handleBlur}
                                        maxLength={10} 
                                        placeholder="9xxxxxxxxx" 
                                        disabled={!isEditing} 
                                    />
                                </div>
                                {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>Email Address <span style={{color:'red'}}>*</span></label>
                                <input 
                                    className={`${styles.inputField} ${errors.email ? styles.errorBorder : ''}`} 
                                    name="email" 
                                    value={formData.email} 
                                    disabled 
                                    style={{backgroundColor: '#e9ecef', color:'#6c757d', cursor: 'not-allowed'}}
                                />
                            </div>
                            {userRole === 'dentist' && (
                                <>
                                    <div className={styles.formGroup}>
                                        <label>Specialization <span style={{color:'red'}}>*</span></label>
                                        {/* DROPDOWN SELECT FOR SPECIALIZATION */}
                                        <select 
                                            className={`${styles.inputField} ${errors.specialization ? styles.errorBorder : ''}`} 
                                            name="specialization" 
                                            value={formData.specialization} 
                                            onChange={handleChange} 
                                            disabled={!isEditing}
                                        >
                                            <option value="" hidden>Select Specialization</option>
                                            {specializationOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                        {errors.specialization && <span className={styles.errorText}>{errors.specialization}</span>}
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>License No.</label>
                                        <input 
                                            className={styles.inputField} 
                                            value={formData.licenseNumber} 
                                            disabled 
                                            style={{backgroundColor: '#e9ecef', color:'#6c757d', cursor: 'not-allowed'}}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <hr className={styles.divider} />
                        
                        {renderAddressFields('currentAddress', 'Current Address')}

                        <div className={styles.checkboxContainer}>
                            <input 
                                type="checkbox" 
                                id="sameAddress" 
                                checked={isSameAddress} 
                                onChange={handleSameAddressToggle}
                                disabled={!isEditing}
                                className={styles.checkboxInput}
                            />
                            <label htmlFor="sameAddress" className={styles.checkboxLabel}>Permanent address same as current address</label>
                        </div>

                        {renderAddressFields('permanentAddress', 'Permanent Address', isSameAddress)}

                        {isEditing && (
                            <div className={styles.buttonGroup}>
                                <button className={styles.cancelBtn} onClick={handleEditToggle} style={{marginRight: '15px'}}>CANCEL</button>
                                <button className={hasChanges() ? styles.saveBtn : styles.disabledBtn} disabled={!hasChanges()} onClick={handleSaveInfo}>SAVE CHANGES</button>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'security' && (
                    <div style={{maxWidth: '600px', margin: '0 auto'}}>
                        {isTempPassword && <div className={styles.warningBanner}><img src={warningIcon} alt="Alert" /><span>You are using a temporary password. Please change it immediately.</span></div>}
                        
                        <form onSubmit={handleSavePassword}>
                            <div className={styles.formGroup}>
                                <label>Current Password</label>
                                <input 
                                    type="password" 
                                    className={`${styles.inputField} ${currentPassError ? styles.inputError : ''}`}
                                    name="current" 
                                    value={passData.current} 
                                    onChange={handlePassChange} 
                                    onBlur={handleVerifyCurrent} 
                                />
                                {currentPassError && <p className={styles.errorText}>Incorrect current password.</p>}
                            </div>

                            <hr className={styles.divider} />

                            <div className={styles.formGroup} style={{position:'relative'}}>
                                <label>New Password</label>
                                <input 
                                    type="password" 
                                    className={styles.inputField} 
                                    name="new" 
                                    value={passData.new} 
                                    onChange={handlePassChange} 
                                    onFocus={()=>setIsPasswordFocused(true)} 
                                    onBlur={()=>setIsPasswordFocused(false)} 
                                    disabled={!currentPassVerified} 
                                />
                                {isPasswordFocused && (
                                    <div className={styles.checklistPop}>
                                        <p className={styles.checkTitle}>Password Strength:</p>
                                        <div className={styles.checkColumn}>
                                            <span className={validations.length?styles.valid:styles.invalid}>• 8+ Characters</span>
                                            <span className={validations.upper?styles.valid:styles.invalid}>• Uppercase</span>
                                            <span className={validations.lower?styles.valid:styles.invalid}>• Lowercase</span>
                                            <span className={validations.number?styles.valid:styles.invalid}>• Number</span>
                                            <span className={validations.special?styles.valid:styles.invalid}>• Special Character</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className={styles.formGroup}>
                                <label>Confirm Password</label>
                                <input 
                                    type="password" 
                                    className={`${styles.inputField} ${matchError ? styles.inputError : ''}`}
                                    name="confirm" 
                                    value={passData.confirm} 
                                    onChange={handlePassChange} 
                                    disabled={!currentPassVerified} 
                                />
                                {matchError && <p className={styles.errorText}>Passwords do not match.</p>}
                            </div>

                            {serverError && <p className={styles.errorText}>{serverError}</p>}

                            <div className={styles.buttonGroup}>
                                <button 
                                    type="submit" 
                                    className={isFormValid() ? styles.saveBtn : styles.disabledBtn} 
                                    disabled={!isFormValid()}
                                >
                                    UPDATE PASSWORD
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* MODALS */}
            {showConfirmModal && (<div className={styles.modalOverlay}><div className={styles.modalCard}><h3>Save Changes?</h3><p style={{color:'#666'}}>Are you sure you want to update your profile?</p><div className={styles.modalActions}><button className={styles.cancelBtn} onClick={() => setShowConfirmModal(false)}>Cancel</button><button className={styles.modalDeleteBtn} onClick={confirmUpdate} style={{backgroundColor: '#005466'}}>Yes, Save</button></div></div></div>)}
            {showSuccessModal && (<div className={styles.modalOverlay}><div className={styles.modalCard}><img src={successIcon} alt="Success" className={styles.modalIcon} /><h3>Success!</h3><p style={{color:'#666'}}>{modalMessage}</p><button className={styles.closeLink} onClick={() => setShowSuccessModal(false)}>Close</button></div></div>)}
        </div>
    );
}