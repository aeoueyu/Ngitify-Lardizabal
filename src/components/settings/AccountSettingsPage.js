import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styles/settings/AccountSettingsPage.module.css';
import { regions, provinces, cities, barangays } from '../../utils/addressData';
import Modal from '../modal/Modal';
import successIcon from '../../assets/alert-icons/success.svg';
import warningIcon from '../../assets/alert-icons/warning.svg';

const AccountSettingsPage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        currentAddress: {
            region: '',
            province: '',
            city: '',
            barangay: '',
            street: '',
            houseNumber: ''
        },
        permanentAddress: {
            region: '',
            province: '',
            city: '',
            barangay: '',
            street: '',
            houseNumber: ''
        }
    });
    const [isSameAddress, setIsSameAddress] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [initialImage, setInitialImage] = useState(null);
    const [passwordChangeRequired, setPasswordChangeRequired] = useState(false);
    const [isCurrentPasswordVerified, setIsCurrentPasswordVerified] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const response = await fetch(`http://localhost:5000/api/user/${userId}`);
                    const data = await response.json();
                    if (response.ok) {
                        const userData = {
                            firstName: data.name?.first || '',
                            middleName: data.name?.middle || '',
                            lastName: data.name?.last || '',
                            email: data.email || '',
                            phone: data.contactNumber ? data.contactNumber.replace('+63', '') : '',
                            currentAddress: data.currentAddress || formData.currentAddress,
                            permanentAddress: data.permanentAddress || formData.permanentAddress,
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                        };
                        setFormData(userData);
                        setInitialData(userData);
                        setProfileImage(data.profileImage);
                        setInitialImage(data.profileImage);
                        setIsSameAddress(JSON.stringify(userData.currentAddress) === JSON.stringify(userData.permanentAddress));
                        setPasswordChangeRequired(data.isPasswordChanged === false);
                    }
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                }
            }
        };
        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'newPassword') {
            const length = value.length >= 8;
            const uppercase = /[A-Z]/.test(value);
            const lowercase = /[a-z]/.test(value);
            const number = /[0-9]/.test(value);
            const specialChar = /[!@#$%^&*]/.test(value);
            setPasswordCriteria({ length, uppercase, lowercase, number, specialChar });
        }

        if (name === 'confirmPassword') {
            setPasswordMatch(formData.newPassword === value);
        }
    };

    const verifyCurrentPassword = async () => {
        const userId = localStorage.getItem('userId');
        const { currentPassword } = formData;

        try {
            const response = await fetch(`http://localhost:5000/api/verify-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, password: currentPassword })
            });

            if (response.ok) {
                setIsCurrentPasswordVerified(true);
            } else {
                setIsCurrentPasswordVerified(false);
            }
        } catch (error) {
            console.error('Error verifying password:', error);
            setIsCurrentPasswordVerified(false);
        }
    };


    const handleAddressChange = (type, field, value) => {
        setFormData(prev => {
            const updatedAddr = { ...prev[type], [field]: value };
            if (field === 'region') {
                updatedAddr.province = '';
                updatedAddr.city = '';
                updatedAddr.barangay = '';
            } else if (field === 'province') {
                updatedAddr.city = '';
                updatedAddr.barangay = '';
            } else if (field === 'city') {
                updatedAddr.barangay = '';
            }
            
            const newState = { ...prev, [type]: updatedAddr };
            if (isSameAddress && type === 'currentAddress') {
                newState.permanentAddress = updatedAddr;
            }
            return newState;
        });
    };

    const handleSameAddressToggle = (e) => {
        const checked = e.target.checked;
        setIsSameAddress(checked);
        if (checked) {
            setFormData(prev => ({ ...prev, permanentAddress: prev.currentAddress }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfileImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setFormData(initialData);
        setProfileImage(initialImage);
    };

    const handleSaveChanges = () => {
        setShowSaveModal(true);
    };

    const confirmSaveChanges = async () => {
        const userId = localStorage.getItem('userId');
        const payload = {
            name: {
                first: formData.firstName,
                middle: formData.middleName,
                last: formData.lastName
            },
            email: formData.email,
            contactNumber: `+63${formData.phone}`,
            currentAddress: formData.currentAddress,
            permanentAddress: isSameAddress ? formData.currentAddress : formData.permanentAddress,
            profileImage
        };

        try {
            const response = await fetch(`http://localhost:5000/api/user/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                const newInitialData = {
                    ...initialData,
                    firstName: updatedUser.name.first,
                    middleName: updatedUser.name.middle,
                    lastName: updatedUser.name.last,
                    email: updatedUser.email,
                    phone: updatedUser.contactNumber.replace('+63', ''),
                    currentAddress: updatedUser.currentAddress,
                    permanentAddress: updatedUser.permanentAddress
                };
                setInitialData(newInitialData);
                setFormData(newInitialData);
                setInitialImage(updatedUser.profileImage);
                setIsEditing(false);
            } else {
                console.error('Failed to save changes');
            }
        } catch (error) {
            console.error('Error saving changes:', error);
        }
        setShowSaveModal(false);
    };

    const handleChangePassword = async () => {
        const userId = localStorage.getItem('userId');
        const { currentPassword, newPassword, confirmPassword } = formData;

        if (newPassword !== confirmPassword) {
            alert("New passwords don't match.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/user/change-password/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            if (response.ok) {
                setShowLogoutModal(true);
            } else {
                const error = await response.json();
                alert(error.message);
            }
        } catch (error) {
            console.error('Error changing password:', error);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    const hasChanges = () => {
        if (!initialData) return false;
        const formChanged = JSON.stringify(formData) !== JSON.stringify(initialData);
        const imageChanged = profileImage !== initialImage;
        return formChanged || imageChanged;
    };

    const renderAddressFields = (type, title, disabled = false) => {
        const addr = formData[type];
        const availProvinces = addr.region ? provinces[addr.region] || [] : [];
        const availCities = addr.province ? cities[addr.province] || [] : [];
        const availBarangays = addr.city ? barangays[addr.city] || [] : [];

        return (
            <div className={styles.addressBlock}>
                <h3 className={styles.sectionSubtitle}>{title}</h3>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Region</label>
                        <select className={styles.inputField} value={addr.region} onChange={(e) => handleAddressChange(type, 'region', e.target.value)} disabled={disabled}>
                            <option value="">Select Region</option>
                            {regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Province</label>
                        <select className={styles.inputField} value={addr.province} onChange={(e) => handleAddressChange(type, 'province', e.target.value)} disabled={disabled || !addr.region}>
                            <option value="">Select Province</option>
                            {availProvinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>City / Municipality</label>
                        <select className={styles.inputField} value={addr.city} onChange={(e) => handleAddressChange(type, 'city', e.target.value)} disabled={disabled || !addr.province}>
                            <option value="">Select City</option>
                            {availCities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Barangay</label>
                        <select className={styles.inputField} value={addr.barangay} onChange={(e) => handleAddressChange(type, 'barangay', e.target.value)} disabled={disabled || !addr.city}>
                            <option value="">Select Barangay</option>
                            {availBarangays.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Street</label>
                        <input className={styles.inputField} value={addr.street} onChange={(e) => handleAddressChange(type, 'street', e.target.value)} disabled={disabled} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>House No.</label>
                        <input className={styles.inputField} value={addr.houseNumber} onChange={(e) => handleAddressChange(type, 'houseNumber', e.target.value)} disabled={disabled} />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Account Settings</h2>
                    <p className={styles.subtitle}>Manage your personal information and password.</p>
                </div>

                <div className={styles.uploadSection}>
                    <div className={styles.imageWrapper} onClick={() => isEditing && fileInputRef.current.click()} style={{cursor: isEditing ? 'pointer' : 'default'}}>
                        {profileImage ? <img src={profileImage} alt="Profile" className={styles.previewImage} /> : <div className={styles.uploadPlaceholder}>Click to Upload</div>}
                    </div>
                    <input type="file" ref={fileInputRef} style={{display:'none'}} onChange={handleImageChange} accept="image/*" disabled={!isEditing} />
                </div>

                <div className={styles.mainSectionTitle}>Personal Information</div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label htmlFor="firstName">First Name</label>
                        <input className={styles.inputField} type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} disabled={!isEditing} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="middleName">Middle Name</label>
                        <input className={styles.inputField} type="text" id="middleName" name="middleName" value={formData.middleName} onChange={handleInputChange} disabled={!isEditing} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="lastName">Last Name</label>
                        <input className={styles.inputField} type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} disabled={!isEditing} />
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input className={styles.inputField} type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="phone">Phone</label>
                        <input className={styles.inputField} type="text" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} disabled={!isEditing} />
                    </div>
                </div>

                <div className={styles.addressSection}>
                    {renderAddressFields('currentAddress', 'Current Address', !isEditing)}
                </div>
                
                <div className={styles.checkboxContainer}>
                    <input type="checkbox" id="sameAddress" checked={isSameAddress} onChange={handleSameAddressToggle} disabled={!isEditing} />
                    <label htmlFor="sameAddress">Permanent address is the same as current address.</label>
                </div>

                <div className={styles.addressSection}>
                    {renderAddressFields('permanentAddress', 'Permanent Address', !isEditing || isSameAddress)}
                </div>

                <div className={styles.buttonGroup}>
                    {isEditing ? (
                        <>
                            <button onClick={handleSaveChanges} className={`${styles.submitBtn} ${!hasChanges() && styles.disabledBtn}`} disabled={!hasChanges()}>Save Changes</button>
                            <button onClick={handleCancelClick} className={styles.cancelBtn}>Cancel</button>
                        </>
                    ) : (
                        <button onClick={handleEditClick} className={styles.submitBtn}>Edit</button>
                    )}
                </div>

                <div className={styles.divider}></div>

                <div className={styles.sectionTitle}>Change Password</div>
                {passwordChangeRequired && (
                    <div className={styles.warningMessage}>
                        Please change your temporary password. It will expire in 7 days.
                    </div>
                )}
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="currentPassword">Current Password</label>
                        <input className={styles.inputField} type="password" id="currentPassword" name="currentPassword" value={formData.currentPassword} onChange={handleInputChange} onBlur={verifyCurrentPassword} />
                    </div>
                </div>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="newPassword">New Password</label>
                        <input className={styles.inputField} type="password" id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleInputChange} onFocus={() => setIsNewPasswordFocused(true)} onBlur={() => setIsNewPasswordFocused(formData.newPassword !== '')} disabled={!isCurrentPasswordVerified} />
                        {isNewPasswordFocused && (
                            <div className={styles.passwordCriteria}>
                                <div className={passwordCriteria.length ? styles.valid : ''}>At least 8 characters</div>
                                <div className={passwordCriteria.uppercase ? styles.valid : ''}>One uppercase letter</div>
                                <div className={passwordCriteria.lowercase ? styles.valid : ''}>One lowercase letter</div>
                                <div className={passwordCriteria.number ? styles.valid : ''}>One number</div>
                                <div className={passwordCriteria.specialChar ? styles.valid : ''}>One special character</div>
                            </div>
                        )}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input className={styles.inputField} type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} disabled={!isCurrentPasswordVerified} />
                        {formData.confirmPassword && !passwordMatch && <div className={styles.passwordMismatch}>Passwords do not match</div>}
                    </div>
                </div>
                <div className={styles.buttonGroup}>
                    <button onClick={handleChangePassword} className={styles.submitBtn} disabled={!isCurrentPasswordVerified || !passwordMatch || Object.values(passwordCriteria).some(v => !v) || !formData.newPassword || !formData.confirmPassword}>Change Password</button>
                </div>
            </div>

            {showSaveModal && (
                <Modal 
                    icon={warningIcon}
                    title="Confirm Changes"
                    body="Are you sure you want to save these changes?"
                    primaryButtonText="Save"
                    secondaryButtonText="Cancel"
                    onPrimaryClick={confirmSaveChanges}
                    onSecondaryClick={() => setShowSaveModal(false)}
                    onClose={() => setShowSaveModal(false)}
                    modalType="save"
                />
            )}

            {showLogoutModal && (
                <Modal
                    icon={successIcon}
                    title="Password Changed"
                    body="Your password has been changed successfully. You will be logged out."
                    primaryButtonText="Logout"
                    onPrimaryClick={handleLogout}
                    onClose={handleLogout}
                    modalType="logout"
                />
            )}
        </div>
    );
};

export default AccountSettingsPage;
