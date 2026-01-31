import React, { useState, useRef, useEffect } from 'react';
// Re-use natin ang styles ng Add Page para consistent
import styles from '../../styles/edit-user/EditDentistPage.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { regions, provinces, cities, barangays } from '../../utils/addressData';
import successIcon from '../../assets/alert-icons/success.svg';

export default function EditDentistPage() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get ID from URL
    const fileInputRef = useRef(null);
    
    // --- STATE ---
    const [isLoading, setIsLoading] = useState(true); // Loading State
    const [isSameAddress, setIsSameAddress] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

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

    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false, uppercase: false, lowercase: false, number: false
    });
    const [passwordsMatch, setPasswordsMatch] = useState(true); 
    const [showPasswordRules, setShowPasswordRules] = useState(false);

    // --- 1. FETCH DATA ON LOAD ---
    useEffect(() => {
        const fetchDentist = async () => {
            console.log("Fetching dentist with ID:", id); // DEBUG LOG 1

            try {
                const response = await fetch(`http://localhost:5000/api/dentist/${id}`);
                
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();
                console.log("Fetched Data:", data); // DEBUG LOG 2 - Check console if data appears

                // PRE-FILL FORM with Safety Checks (?. and || '')
                setFormData({
                    firstName: data.name?.first || '',
                    middleName: data.name?.middle || '',
                    lastName: data.name?.last || '',
                    
                    // Format date to YYYY-MM-DD for input type="date"
                    birthdate: data.birthdate ? new Date(data.birthdate).toISOString().split('T')[0] : '',
                    
                    email: data.email || '',
                    // Remove +63 for display purposes
                    phone: data.contactNumber ? data.contactNumber.replace('+63', '') : '',
                    
                    licenseNumber: data.licenseNumber || '',
                    specialization: data.specialization || '',
                    
                    password: '', // Keep blank for security
                    confirmPassword: '',
                    
                    currentAddress: data.currentAddress || initialAddressState,
                    permanentAddress: data.permanentAddress || initialAddressState
                });

                if (data.profileImage) {
                    setProfileImage(data.profileImage);
                }

            } catch (error) {
                console.error("Error loading dentist:", error);
                alert("Error loading dentist data. Please try again.");
                navigate('/owner/manage-dentists');
            } finally {
                setIsLoading(false); // Stop loading
            }
        };

        if (id) {
            fetchDentist();
        }
    }, [id, navigate]);

    // --- HANDLERS ---
    const handlePasswordChange = (e) => {
        const val = e.target.value;
        setFormData({ ...formData, password: val });
        setPasswordCriteria({
            length: val.length >= 8,
            uppercase: /[A-Z]/.test(val),
            lowercase: /[a-z]/.test(val),
            number: /[0-9]/.test(val)
        });
        if (formData.confirmPassword) setPasswordsMatch(val === formData.confirmPassword);
    };

    const handleConfirmPasswordChange = (e) => {
        const val = e.target.value;
        setFormData({ ...formData, confirmPassword: val });
        setPasswordsMatch(val === formData.password);
    };

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
    const handlePersonalChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); 
        if (value.length <= 10) setFormData({ ...formData, phone: value });
    };

    const handleAddressChange = (type, field, value) => {
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
        } else {
            setFormData(prev => ({ ...prev, permanentAddress: { ...initialAddressState } }));
        }
    };

    // --- SUBMIT (UPDATE) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Prepare Data
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
                const err = await response.json();
                alert(err.message || "Failed to update account.");
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

    // Render Address Helper
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
                            <option value="" disabled>Select Region</option>
                            {regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>PROVINCE</label>
                        <select className={styles.inputField} value={address.province} onChange={(e) => handleAddressChange(type, 'province', e.target.value)} disabled={isDisabled || !address.region} required>
                            <option value="" disabled>Select Province</option>
                            {availableProvinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>CITY / MUNICIPALITY</label>
                        <select className={styles.inputField} value={address.city} onChange={(e) => handleAddressChange(type, 'city', e.target.value)} disabled={isDisabled || !address.province} required>
                            <option value="" disabled>Select City</option>
                            {availableCities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>BARANGAY</label>
                        <select className={styles.inputField} value={address.barangay} onChange={(e) => handleAddressChange(type, 'barangay', e.target.value)} disabled={isDisabled || !address.city} required>
                            <option value="" disabled>Select Barangay</option>
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

    // --- RENDER LOADING STATE ---
    if (isLoading) {
        return (
            <div className={styles.container} style={{ height: '80vh', alignItems: 'center' }}>
                <p style={{ color: '#005466', fontWeight: 'bold' }}>Loading dentist information...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <div className={styles.header}>
                    <h2>Edit <span className={styles.highlight}>Dentist</span></h2>
                    <p>Update the dentist's professional and personal details.</p>
                </div>

                <form onSubmit={handleSubmit}>
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
                            <label>FIRST NAME</label>
                            <input type="text" name="firstName" className={styles.inputField} value={formData.firstName} onChange={handlePersonalChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>MIDDLE NAME</label>
                            <input type="text" name="middleName" className={styles.inputField} value={formData.middleName} onChange={handlePersonalChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>LAST NAME</label>
                            <input type="text" name="lastName" className={styles.inputField} value={formData.lastName} onChange={handlePersonalChange} required />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>BIRTH DATE</label>
                            <input type="date" name="birthdate" className={styles.inputField} value={formData.birthdate} max={getMaxDate()} onChange={handlePersonalChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>SPECIALIZATION</label>
                            <select name="specialization" className={styles.inputField} value={formData.specialization} onChange={handlePersonalChange} required>
                                <option value="" disabled>Select Specialization</option>
                                <option value="General Dentistry">General Dentistry</option>
                                <option value="Orthodontics">Orthodontics</option>
                                <option value="Pediatric Dentistry">Pediatric Dentistry</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>PRC LICENSE NO.</label>
                            <input type="text" name="licenseNumber" className={styles.inputField} value={formData.licenseNumber} onChange={handlePersonalChange} required />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>EMAIL ADDRESS</label>
                            <input type="email" name="email" className={styles.inputField} value={formData.email} onChange={handlePersonalChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>PHONE NUMBER</label>
                            <div className={styles.phoneInputGroup}>
                                <span className={styles.phonePrefix}>+63</span>
                                <input type="text" name="phone" className={styles.phoneField} value={formData.phone} onChange={handlePhoneChange} required />
                            </div>
                        </div>
                    </div>

                    <hr className={styles.divider} />

                    <h3 className={styles.mainSectionTitle}>Account Security (Optional)</h3>
                    <p style={{fontSize: '12px', color: '#888', marginBottom: '15px'}}>Leave blank if you don't want to change the password.</p>
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>NEW PASSWORD</label>
                            <input 
                                type="password" 
                                name="password" 
                                className={styles.inputField} 
                                placeholder="Enter new password" 
                                onChange={handlePasswordChange}
                                onFocus={() => setShowPasswordRules(true)}
                                onBlur={() => setShowPasswordRules(false)}
                                value={formData.password}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>CONFIRM NEW PASSWORD</label>
                            <input 
                                type="password" 
                                name="confirmPassword" 
                                className={`${styles.inputField} ${!passwordsMatch ? styles.errorBorder : ''}`} 
                                placeholder="Repeat new password" 
                                onChange={handleConfirmPasswordChange} 
                                value={formData.confirmPassword}
                            />
                            {!passwordsMatch && <span className={styles.errorText}>Passwords do not match</span>}
                        </div>
                    </div>

                    {showPasswordRules && formData.password && (
                        <div className={styles.passwordRulesContainer}>
                            <p className={styles.rulesLabel}>Password must contain:</p>
                            <ul className={styles.rulesList}>
                                <li className={passwordCriteria.length ? styles.validRule : styles.invalidRule}><span className={styles.ruleIcon}>{passwordCriteria.length ? '✓' : '○'}</span> 8+ chars</li>
                                <li className={passwordCriteria.uppercase ? styles.validRule : styles.invalidRule}><span className={styles.ruleIcon}>{passwordCriteria.uppercase ? '✓' : '○'}</span> Uppercase</li>
                                <li className={passwordCriteria.lowercase ? styles.validRule : styles.invalidRule}><span className={styles.ruleIcon}>{passwordCriteria.lowercase ? '✓' : '○'}</span> Lowercase</li>
                                <li className={passwordCriteria.number ? styles.validRule : styles.invalidRule}><span className={styles.ruleIcon}>{passwordCriteria.number ? '✓' : '○'}</span> Number</li>
                            </ul>
                        </div>
                    )}

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

            {/* --- CUSTOM CARD MODAL --- */}
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