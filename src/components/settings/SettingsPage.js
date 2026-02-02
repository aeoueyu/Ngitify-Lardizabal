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

    const [validations, setValidations] = useState({
        length: false, upper: false, lower: false, number: false, special: false
    });

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/user/${userId}`);
                const data = await res.json();
                if (res.ok) {
                    const currentAddr = data.currentAddress || initialAddressState;
                    const permanentAddr = data.permanentAddress || initialAddressState;
                    
                    // Check if addresses are effectively the same to set checkbox
                    // We compare key fields (region, province, city, barangay, street, houseNumber)
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
            setFormData(initialData); // Revert on cancel
            setProfileImage(initialImage);
            // Re-evaluate isSameAddress based on initialData
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const hasChanges = () => {
        return JSON.stringify(formData) !== JSON.stringify(initialData) || profileImage !== initialImage;
    };

    // --- ADDRESS HANDLERS ---
    const handleAddressChange = (type, field, value) => {
        setFormData(prev => {
            const updatedAddr = { ...prev[type], [field]: value };
            
            // Reset lower levels if higher level changes
            if (field === 'region') { updatedAddr.province = ''; updatedAddr.city = ''; updatedAddr.barangay = ''; }
            else if (field === 'province') { updatedAddr.city = ''; updatedAddr.barangay = ''; }
            else if (field === 'city') { updatedAddr.barangay = ''; }
            
            const newState = { ...prev, [type]: updatedAddr };

            // If same address is checked and we are modifying current, update permanent too
            if (isSameAddress && type === 'currentAddress') {
                newState.permanentAddress = updatedAddr;
            }
            return newState;
        });
    };

    const handleSameAddressToggle = () => {
        if (!isEditing) return; // Only allow toggle in edit mode
        
        const newStatus = !isSameAddress;
        setIsSameAddress(newStatus);
        
        if (newStatus) {
            // Copy current to permanent
            setFormData(prev => ({ ...prev, permanentAddress: prev.currentAddress }));
        }
    };

    const handleSaveInfo = async () => {
        setShowConfirmModal(false);
        try {
            const updatePayload = {
                name: { first: formData.firstName, middle: formData.middleName, last: formData.lastName },
                contactNumber: `+63${formData.phone}`,
                birthdate: formData.birthdate,
                specialization: formData.specialization,
                currentAddress: formData.currentAddress,
                permanentAddress: isSameAddress ? formData.currentAddress : formData.permanentAddress, 
                profileImage: profileImage
            };

            const res = await fetch(`http://localhost:5000/api/user/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload)
            });

            if (res.ok) {
                // Update initial data to reflect saved state
                const savedData = {
                    ...formData,
                    permanentAddress: isSameAddress ? formData.currentAddress : formData.permanentAddress
                };
                setInitialData(savedData);
                setInitialImage(profileImage);
                setIsEditing(false);
                setModalMessage("Profile updated successfully.");
                setShowSuccessModal(true);
            } else {
                alert("Failed to update.");
            }
        } catch (error) { console.error(error); }
    };

    // --- PASSWORD LOGIC ---
    const handleVerifyCurrent = async () => {
        if (!passData.current) return;
        try {
            const res = await fetch('http://localhost:5000/api/verify-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, password: passData.current })
            });
            const data = await res.json();

            if (data.success) {
                setCurrentPassVerified(true);
                setCurrentPassError(false);
            } else {
                setCurrentPassVerified(false);
                setCurrentPassError(true);
            }
        } catch (err) { console.error(err); }
    };

    const handlePassChange = (e) => {
        const { name, value } = e.target;
        setPassData(prev => ({ ...prev, [name]: value }));
        setServerError('');

        if (name === 'current') {
            setCurrentPassVerified(false);
            setCurrentPassError(false);
        }

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

        try {
            const res = await fetch('http://localhost:5000/api/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, currentPassword: passData.current, newPassword: passData.new })
            });
            const data = await res.json();
            if (res.ok) {
                setModalMessage("Password changed successfully.");
                setShowSuccessModal(true);
                setPassData({ current: '', new: '', confirm: '' });
                setCurrentPassVerified(false);
                setIsTempPassword(false);
                setValidations({ length: false, upper: false, lower: false, number: false, special: false });
            } else {
                setServerError(data.message || "Failed to change password.");
            }
        } catch (err) { setServerError("Server error."); }
    };

    // --- RENDER ADDRESS HELPERS (Reusable) ---
    const renderAddressFields = (type, title, disabledOverride = false) => {
        const addr = formData[type];
        const isDisabled = !isEditing || disabledOverride; 
        
        // Data for dropdowns
        const availProvinces = addr.region ? provinces[addr.region] || [] : [];
        const availCities = addr.province ? cities[addr.province] || [] : [];
        const availBarangays = addr.city ? barangays[addr.city] || [] : [];

        return (
            <>
                <h3 className={styles.sectionTitle}>{title}</h3>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Region</label>
                        <select className={styles.inputField} value={addr.region} onChange={(e) => handleAddressChange(type, 'region', e.target.value)} disabled={isDisabled}>
                            <option value="" hidden>Select Region</option>
                            {regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Province</label>
                        <select className={styles.inputField} value={addr.province} onChange={(e) => handleAddressChange(type, 'province', e.target.value)} disabled={isDisabled || !addr.region}>
                            <option value="" hidden>Select Province</option>
                            {availProvinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>City / Municipality</label>
                        <select className={styles.inputField} value={addr.city} onChange={(e) => handleAddressChange(type, 'city', e.target.value)} disabled={isDisabled || !addr.province}>
                            <option value="" hidden>Select City</option>
                            {availCities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Barangay</label>
                        <select className={styles.inputField} value={addr.barangay} onChange={(e) => handleAddressChange(type, 'barangay', e.target.value)} disabled={isDisabled || !addr.city}>
                            <option value="" hidden>Select Barangay</option>
                            {availBarangays.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Street</label>
                        <input className={styles.inputField} value={addr.street} onChange={(e) => handleAddressChange(type, 'street', e.target.value)} disabled={isDisabled} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>House No.</label>
                        <input className={styles.inputField} value={addr.houseNumber} onChange={(e) => handleAddressChange(type, 'houseNumber', e.target.value)} disabled={isDisabled} />
                    </div>
                </div>
            </>
        );
    };

    if (isLoading) return <div className={styles.container}>Loading...</div>;

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
                        <div className={styles.uploadSection}>
                            <div className={styles.imageWrapper} onClick={() => isEditing && fileInputRef.current.click()} style={{ cursor: isEditing ? 'pointer' : 'default', opacity: isEditing ? 1 : 0.9 }}>
                                {profileImage ? <img src={profileImage} alt="Profile" className={styles.previewImage} /> : <div className={styles.uploadPlaceholder}>No Image</div>}
                            </div>
                            <input type="file" ref={fileInputRef} style={{display:'none'}} onChange={handleImageChange} accept="image/*" />
                            {isEditing && <p className={styles.uploadHint}>Click image to change</p>}
                        </div>

                        <h3 className={styles.mainSectionTitle}>Personal Details</h3>
                        <div className={styles.row}>
                            <div className={styles.formGroup}><label>First Name</label><input className={styles.inputField} name="firstName" value={formData.firstName} onChange={handleChange} disabled={!isEditing} /></div>
                            <div className={styles.formGroup}><label>Middle Name</label><input className={styles.inputField} name="middleName" value={formData.middleName} onChange={handleChange} disabled={!isEditing} /></div>
                            <div className={styles.formGroup}><label>Last Name</label><input className={styles.inputField} name="lastName" value={formData.lastName} onChange={handleChange} disabled={!isEditing} /></div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.formGroup}><label>Birthdate</label><input type="date" className={styles.inputField} name="birthdate" value={formData.birthdate} onChange={handleChange} disabled={!isEditing} /></div>
                            <div className={styles.formGroup}><label>Phone (+63)</label><input className={styles.inputField} name="phone" value={formData.phone} onChange={handleChange} maxLength={10} disabled={!isEditing} /></div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.formGroup}><label>Email Address</label><input className={styles.inputField} value={formData.email} disabled title="Contact Admin to change email" /></div>
                            {userRole === 'dentist' && (
                                <>
                                    <div className={styles.formGroup}><label>Specialization</label><input className={styles.inputField} name="specialization" value={formData.specialization} onChange={handleChange} disabled={!isEditing} /></div>
                                    <div className={styles.formGroup}><label>License No.</label><input className={styles.inputField} value={formData.licenseNumber} disabled /></div>
                                </>
                            )}
                        </div>

                        <hr className={styles.divider} />
                        
                        {/* Current Address */}
                        {renderAddressFields('currentAddress', 'Current Address')}

                        {/* Checkbox for Same Address */}
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

                        {/* Permanent Address */}
                        {renderAddressFields('permanentAddress', 'Permanent Address', isSameAddress)}

                        <div className={styles.buttonGroup}>
                            {!isEditing ? (
                                <button className={styles.saveBtn} onClick={() => setIsEditing(true)}>EDIT PROFILE</button>
                            ) : (
                                <>
                                    <button className={styles.cancelBtn} onClick={handleEditToggle} style={{marginRight: '15px'}}>CANCEL</button>
                                    <button className={hasChanges() ? styles.saveBtn : styles.disabledBtn} disabled={!hasChanges()} onClick={() => setShowConfirmModal(true)}>SAVE CHANGES</button>
                                </>
                            )}
                        </div>
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
            {showConfirmModal && (<div className={styles.modalOverlay}><div className={styles.modalCard}><h3>Save Changes?</h3><p style={{color:'#666'}}>Are you sure you want to update your profile?</p><div className={styles.modalActions}><button className={styles.cancelBtn} onClick={() => setShowConfirmModal(false)}>Cancel</button><button className={styles.saveBtn} onClick={handleSaveInfo}>Yes, Save</button></div></div></div>)}
            {showSuccessModal && (<div className={styles.modalOverlay}><div className={styles.modalCard}><img src={successIcon} alt="Success" className={styles.modalIcon} /><h3>Success!</h3><p style={{color:'#666'}}>{modalMessage}</p><button className={styles.closeLink} onClick={() => setShowSuccessModal(false)}>Close</button></div></div>)}
        </div>
    );
}