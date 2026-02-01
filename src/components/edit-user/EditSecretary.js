import React, { useState, useRef, useEffect } from 'react';
import styles from '../../styles/edit-user/EditSecretaryPage.module.css'; // Reuse CSS
import { useNavigate, useParams } from 'react-router-dom';
import { regions, provinces, cities, barangays } from '../../utils/addressData';
import successIcon from '../../assets/alert-icons/success.svg';

export default function EditSecretaryPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const fileInputRef = useRef(null);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSameAddress, setIsSameAddress] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errors, setErrors] = useState({});

    const initialAddressState = { country: 'Philippines', region: '', province: '', city: '', barangay: '', houseNumber: '', street: '' };

    const [formData, setFormData] = useState({
        firstName: '', middleName: '', lastName: '', birthdate: '',
        email: '', phone: '',
        currentAddress: { ...initialAddressState },
        permanentAddress: { ...initialAddressState }
    });

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const toTitleCase = (str) => str.toLowerCase().replace(/(?:^|\s|-|\.)\S/g, (char) => char.toUpperCase());
    const getAge = (dateString) => {
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        return age;
    };

    // FETCH DATA
    useEffect(() => {
        const fetchSecretary = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/user/${id}`);
                const data = await response.json();
                
                if (response.ok) {
                    const currentAddr = data.currentAddress || {};
                    const permAddr = data.permanentAddress || {};

                    setFormData({
                        firstName: data.name?.first || '',
                        middleName: data.name?.middle || '',
                        lastName: data.name?.last || '',
                        birthdate: data.birthdate ? new Date(data.birthdate).toISOString().split('T')[0] : '',
                        email: data.email || '',
                        phone: data.contactNumber ? data.contactNumber.replace('+63', '') : '',
                        
                        currentAddress: {
                            country: 'Philippines',
                            region: currentAddr.region || '',
                            province: currentAddr.province || '',
                            city: currentAddr.city || '',
                            barangay: currentAddr.brgy || currentAddr.barangay || '',
                            street: currentAddr.street || '',
                            houseNumber: currentAddr.houseNumber || ''
                        },
                        permanentAddress: {
                            country: 'Philippines',
                            region: permAddr.region || '',
                            province: permAddr.province || '',
                            city: permAddr.city || '',
                            barangay: permAddr.brgy || permAddr.barangay || '',
                            street: permAddr.street || '',
                            houseNumber: permAddr.houseNumber || ''
                        }
                    });
                    setProfileImage(data.profileImage);
                }
            } catch (error) { console.error("Error:", error); } finally { setIsLoading(false); }
        };
        fetchSecretary();
    }, [id]);

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

    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        if (errors[name]) setErrors(prev => { const n = {...prev}; delete n[name]; return n; });
        if (['firstName', 'middleName', 'lastName'].includes(name)) {
            if (value === '' || /^[a-zA-Z\s.-]+$/.test(value)) setFormData({ ...formData, [name]: toTitleCase(value) });
            return;
        }
        setFormData({ ...formData, [name]: value });
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

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;
        const requiredFields = ['firstName', 'lastName', 'birthdate', 'email'];
        requiredFields.forEach(field => { if (!formData[field]) { newErrors[field] = "This field is required"; isValid = false; } });

        if (!formData.phone) { newErrors.phone = "Required"; isValid = false; }
        else if (formData.phone.length !== 10 || formData.phone[0] !== '9') { newErrors.phone = "Invalid format"; isValid = false; }

        if (formData.email && !validateEmail(formData.email)) { newErrors.email = "Invalid email"; isValid = false; }

        // AGE CHECK (18+)
        if (formData.birthdate && getAge(formData.birthdate) < 18) {
            newErrors.birthdate = "Must be at least 18 years old";
            isValid = false;
        }

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
            const response = await fetch(`http://localhost:5000/api/user/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            });
            if (response.ok) setShowSuccessModal(true);
            else alert("Failed to update.");
        } catch (error) { console.error("Error:", error); }
    };

    // --- RENDER ADDRESS HELPER ---
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

    if (isLoading) return <div className={styles.container}><p>Loading...</p></div>;

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <div className={styles.header}>
                    <h2>Edit <span className={styles.highlight}>Secretary</span></h2>
                    <p>Update secretary account details.</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className={styles.uploadSection}>
                        <div className={styles.imageWrapper} onClick={triggerFileInput}>
                            {profileImage ? <img src={profileImage} alt="Profile" className={styles.previewImage} /> : <div className={styles.uploadPlaceholder}><span>No Image</span></div>}
                        </div>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                        <p className={styles.uploadHint}>Click to change photo.</p>
                    </div>

                    <h3 className={styles.mainSectionTitle}>Personal Information</h3>
                    <div className={styles.row}>
                        <div className={styles.formGroup}><label>FIRST NAME <span style={{color: 'red'}}>*</span></label><input className={`${styles.inputField} ${errors.firstName ? styles.errorBorder : ''}`} name="firstName" value={formData.firstName} onChange={handlePersonalChange} maxLength={50}/>{errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}</div>
                        <div className={styles.formGroup}><label>MIDDLE NAME</label><input className={styles.inputField} name="middleName" value={formData.middleName} onChange={handlePersonalChange} maxLength={50}/></div>
                        <div className={styles.formGroup}><label>LAST NAME <span style={{color: 'red'}}>*</span></label><input className={`${styles.inputField} ${errors.lastName ? styles.errorBorder : ''}`} name="lastName" value={formData.lastName} onChange={handlePersonalChange} maxLength={50}/>{errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}</div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.formGroup}><label>BIRTHDATE <span style={{color: 'red'}}>*</span></label><input type="date" className={`${styles.inputField} ${errors.birthdate ? styles.errorBorder : ''}`} name="birthdate" value={formData.birthdate} onChange={handlePersonalChange} />{errors.birthdate && <span className={styles.errorText}>{errors.birthdate}</span>}</div>
                        <div className={styles.formGroup}><label>EMAIL <span style={{color: 'red'}}>*</span></label><input type="email" className={`${styles.inputField} ${errors.email ? styles.errorBorder : ''}`} name="email" value={formData.email} onChange={handlePersonalChange} maxLength={100}/>{errors.email && <span className={styles.errorText}>{errors.email}</span>}</div>
                        <div className={styles.formGroup}><label>PHONE <span style={{color: 'red'}}>*</span></label><div className={styles.phoneInputGroup}><span className={styles.phonePrefix}>+63</span><input className={`${styles.phoneField} ${errors.phone ? styles.errorBorder : ''}`} name="phone" value={formData.phone} onChange={handlePhoneChange} maxLength={10}/></div>{errors.phone && <span className={styles.errorText}>{errors.phone}</span>}</div>
                    </div>

                    <hr className={styles.divider} />
                    {renderAddressFields('currentAddress', 'Current Address')}
                    <div className={styles.permanentHeader}><h3 className={styles.sectionTitle}>Permanent Address</h3><div className={styles.checkboxContainer}><input type="checkbox" id="sameAddress" checked={isSameAddress} onChange={handleSameAddressToggle} /><label htmlFor="sameAddress">Same as Current</label></div></div>
                    {isSameAddress ? <div className={styles.disabledOverlay}>{renderAddressFields('permanentAddress', '', true)}</div> : renderAddressFields('permanentAddress', '')}

                    <div className={styles.buttonGroup}>
                        <button type="button" className={styles.cancelBtn} onClick={() => navigate('/owner/manage-secretaries')}>CANCEL</button>
                        <button type="submit" className={styles.submitBtn}>SAVE CHANGES</button>
                    </div>
                </form>
            </div>
            {showSuccessModal && (<div className={styles.modalOverlay}><div className={styles.modalCard}><img src={successIcon} alt="Success" className={styles.modalIcon} /><h3 className={styles.modalTitle}>Update Successful!</h3><p className={styles.modalMessage}>Secretary details updated.</p><button className={styles.closeLink} onClick={() => navigate('/owner/manage-secretaries')}>Close</button></div></div>)}
        </div>
    );
}