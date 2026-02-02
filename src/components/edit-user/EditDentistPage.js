import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../styles/edit-user/EditDentistPage.module.css';
import { regions, provinces, cities, barangays } from '../../utils/addressData'; 
import warningIcon from '../../assets/alert-icons/warning.svg';
import successIcon from '../../assets/alert-icons/success.svg';

export default function EditDentistPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(true);

    const specializationOptions = [
        "General Dentist", "Orthodontist", "Pediatric Dentist (Pedodontist)", 
        "Periodontist", "Endodontist", "Oral & Maxillofacial Surgeon", 
        "Prosthodontist", "Cosmetic Dentist"
    ];

    const initialAddressState = { region: '', province: '', city: '', barangay: '', street: '', houseNumber: '' };

    // --- STATES ---
    const [formData, setFormData] = useState({
        firstName: '', middleName: '', lastName: '', 
        email: '', phone: '', birthdate: '',
        licenseNumber: '', specialization: '', 
        currentAddress: { ...initialAddressState },
        permanentAddress: { ...initialAddressState }
    });

    const [initialData, setInitialData] = useState(null); 
    const [profileImage, setProfileImage] = useState(null);
    const [initialImage, setInitialImage] = useState(null);
    
    const [isSameAddress, setIsSameAddress] = useState(false);
    const [errors, setErrors] = useState({});

    // Modals
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Helpers
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 21, today.getMonth(), today.getDate()).toISOString().split('T')[0];
    const getAge = (d) => { const today=new Date(); const birth=new Date(d); let age=today.getFullYear()-birth.getFullYear(); const m=today.getMonth()-birth.getMonth(); if(m<0||(m===0&&today.getDate()<birth.getDate()))age--; return age; };
    
    const validateEmail = (email) => {
        const formatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formatRegex.test(email)) return false;
        const allowedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'live.com'];
        const domain = email.split('@')[1].toLowerCase();
        return allowedDomains.includes(domain);
    };

    const toTitleCase = (str) => str.toLowerCase().replace(/(?:^|\s|-|\.)\S/g, (char) => char.toUpperCase());

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchDentist = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/user/${id}`);
                const data = await res.json();
                if (res.ok) {
                    const currentAddr = data.currentAddress || initialAddressState;
                    const permanentAddr = data.permanentAddress || initialAddressState;
                    const isSame = JSON.stringify(currentAddr) === JSON.stringify(permanentAddr);

                    const loadedData = {
                        firstName: data.name.first,
                        middleName: data.name.middle,
                        lastName: data.name.last,
                        email: data.email,
                        phone: data.contactNumber ? data.contactNumber.replace('+63', '') : '',
                        birthdate: data.birthdate ? new Date(data.birthdate).toISOString().split('T')[0] : '',
                        licenseNumber: data.licenseNumber,
                        specialization: data.specialization,
                        currentAddress: currentAddr,
                        permanentAddress: permanentAddr
                    };

                    setFormData(loadedData);
                    setInitialData(loadedData);
                    setProfileImage(data.profileImage);
                    setInitialImage(data.profileImage);
                    setIsSameAddress(isSame);
                }
            } catch (err) { console.error(err); } 
            finally { setLoading(false); }
        };
        fetchDentist();
    }, [id]);

    const hasChanges = () => {
        if (!initialData) return false;
        const formChanged = JSON.stringify(formData) !== JSON.stringify(initialData);
        const imageChanged = profileImage !== initialImage;
        return formChanged || imageChanged;
    };

    // --- HANDLERS ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (errors[name]) setErrors(prev => { const n={...prev}; delete n[name]; return n; });

        // Name Validation
        if (['firstName', 'middleName', 'lastName'].includes(name)) {
            if (value === '' || /^[a-zA-Z\s.-]+$/.test(value)) {
                setFormData(prev => ({ ...prev, [name]: toTitleCase(value) }));
            }
            return;
        }

        // Phone Validation
        if (name === 'phone') {
            const numericValue = value.replace(/[^0-9]/g, '');
            if (numericValue.length <= 10) setFormData(prev => ({ ...prev, [name]: numericValue }));
            return;
        }

        // License Number Validation (Clear error on type)
        if (name === 'licenseNumber') {
            const numericValue = value.replace(/[^0-9]/g, '');
            if (numericValue.length <= 7) {
                setFormData(prev => ({ ...prev, [name]: numericValue }));
            }
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- REAL-TIME VALIDATION (ON BLUR) ---
    const handleBlur = (e) => {
        const { name, value } = e.target;
        let newError = "";

        switch (name) {
            case 'email':
                if (!value) newError = "Required";
                else if (!validateEmail(value)) newError = "Invalid email domain (e.g. gmail.com, yahoo.com)";
                break;
            case 'phone':
                if (!value) newError = "Required";
                else if (value.length !== 10 || value[0] !== '9') newError = "Invalid format (9xxxxxxxxx)";
                break;
            case 'licenseNumber':
                if (!value) newError = "Required";
                else if (value.length !== 7) newError = "Must be 7 digits";
                break;
            default:
                break;
        }

        if (newError) setErrors(prev => ({ ...prev, [name]: newError }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfileImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

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

    const handleSameAddressToggle = (e) => {
        const checked = e.target.checked;
        setIsSameAddress(checked);
        if (checked) {
            setFormData(prev => ({ ...prev, permanentAddress: prev.currentAddress }));
            setErrors(prev=>{const n={...prev}; Object.keys(n).forEach(k=>{if(k.startsWith('permanent_'))delete n[k];}); return n;});
        } else {
            setFormData(prev => ({ ...prev, permanentAddress: { ...initialAddressState } })); 
        }
    };

    // --- FORM VALIDATION (ON SUBMIT) ---
    const validateForm = () => {
        let newErrors = {};
        let isValid = true;
        const required = ['firstName', 'lastName', 'birthdate', 'licenseNumber', 'specialization', 'email'];
        
        required.forEach(f => { if(!formData[f]) { newErrors[f] = "Required"; isValid = false; }});

        if(!formData.phone) { newErrors.phone="Required"; isValid=false; }
        else if(formData.phone.length!==10 || formData.phone[0]!=='9') { newErrors.phone="Invalid format (9xxxxxxxxx)"; isValid=false; }
        
        if(formData.email && !validateEmail(formData.email)) { 
            newErrors.email="Invalid email domain (e.g. gmail.com, yahoo.com)"; isValid=false; 
        }
        
        if(formData.birthdate && getAge(formData.birthdate)<21) { newErrors.birthdate="Min age 21"; isValid=false; }
        
        // LICENSE VALIDATION (Must be 7 digits)
        if(formData.licenseNumber && formData.licenseNumber.length !== 7) { 
            newErrors.licenseNumber="Must be 7 digits"; isValid=false; 
        }

        const validateAddr = (addr, prefix) => {
            ['region', 'province', 'city', 'barangay', 'street', 'houseNumber'].forEach(f => {
                if(!addr[f]) { newErrors[`${prefix}_${f}`]="Required"; isValid=false; }
            });
        };
        validateAddr(formData.currentAddress, 'current');
        if(!isSameAddress) validateAddr(formData.permanentAddress, 'permanent');

        setErrors(newErrors);
        
        if (!isValid) {
            const firstKey = Object.keys(newErrors)[0];
            const el = document.getElementsByName(firstKey)[0];
            if(el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
        }
        return isValid;
    };

    const handleSaveClick = () => {
        if (validateForm()) {
            setShowSaveModal(true);
        }
    };

    const handleConfirmSave = async () => {
        setShowSaveModal(false);
        try {
            const updatePayload = {
                name: { first: formData.firstName, middle: formData.middleName, last: formData.lastName },
                contactNumber: `+63${formData.phone}`, 
                birthdate: formData.birthdate,
                licenseNumber: formData.licenseNumber,
                specialization: formData.specialization,
                email: formData.email,
                currentAddress: formData.currentAddress,
                permanentAddress: isSameAddress ? formData.currentAddress : formData.permanentAddress,
                profileImage
            };

            const res = await fetch(`http://localhost:5000/api/user/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload)
            });

            const data = await res.json();

            if (res.ok) {
                setShowSuccessModal(true);
            } else {
                if (res.status === 409) {
                    alert(data.message);
                } else {
                    alert("Failed to update.");
                }
            }
        } catch (error) { console.error(error); }
    };

    const handleCancelClick = () => {
        if (hasChanges()) {
            setShowCancelModal(true);
        } else {
            navigate(-1);
        }
    };

    const handleDiscardChanges = () => {
        navigate(-1);
    };

    const renderAddressFields = (type, title, disabled = false) => {
        const addr = formData[type];
        const prefix = type === 'currentAddress' ? 'current' : 'permanent';
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
                        <select name={`${prefix}_region`} className={`${styles.inputField} ${getErrorClass('region')}`} value={addr.region} onChange={(e) => handleAddressChange(type, 'region', e.target.value)} disabled={disabled}>
                            <option value="" hidden>Select Region</option>
                            {regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                        </select>
                        {getError('region') && <span className={styles.errorText}>{getError('region')}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Province <span style={{color:'red'}}>*</span></label>
                        <select name={`${prefix}_province`} className={`${styles.inputField} ${getErrorClass('province')}`} value={addr.province} onChange={(e) => handleAddressChange(type, 'province', e.target.value)} disabled={disabled || !addr.region}>
                            <option value="" hidden>Select Province</option>
                            {availProvinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                        </select>
                        {getError('province') && <span className={styles.errorText}>{getError('province')}</span>}
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>City / Municipality <span style={{color:'red'}}>*</span></label>
                        <select name={`${prefix}_city`} className={`${styles.inputField} ${getErrorClass('city')}`} value={addr.city} onChange={(e) => handleAddressChange(type, 'city', e.target.value)} disabled={disabled || !addr.province}>
                            <option value="" hidden>Select City</option>
                            {availCities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                        {getError('city') && <span className={styles.errorText}>{getError('city')}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Barangay <span style={{color:'red'}}>*</span></label>
                        <select name={`${prefix}_barangay`} className={`${styles.inputField} ${getErrorClass('barangay')}`} value={addr.barangay} onChange={(e) => handleAddressChange(type, 'barangay', e.target.value)} disabled={disabled || !addr.city}>
                            <option value="" hidden>Select Barangay</option>
                            {availBarangays.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        {getError('barangay') && <span className={styles.errorText}>{getError('barangay')}</span>}
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Street <span style={{color:'red'}}>*</span></label>
                        <input name={`${prefix}_street`} className={`${styles.inputField} ${getErrorClass('street')}`} value={addr.street} onChange={(e) => handleAddressChange(type, 'street', e.target.value)} disabled={disabled} />
                        {getError('street') && <span className={styles.errorText}>{getError('street')}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>House No. <span style={{color:'red'}}>*</span></label>
                        <input name={`${prefix}_houseNumber`} className={`${styles.inputField} ${getErrorClass('houseNumber')}`} value={addr.houseNumber} onChange={(e) => handleAddressChange(type, 'houseNumber', e.target.value)} disabled={disabled} />
                        {getError('houseNumber') && <span className={styles.errorText}>{getError('houseNumber')}</span>}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <div className={styles.container}>Loading...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <div className={styles.header}>
                    <h2>Edit Dentist</h2>
                    <p>Update dentist's personal and professional information.</p>
                </div>

                <div className={styles.uploadSection}>
                    <div className={styles.imageWrapper} onClick={() => fileInputRef.current.click()} style={{cursor: 'pointer'}}>
                        {profileImage ? <img src={profileImage} alt="Profile" className={styles.previewImage} /> : <div className={styles.uploadPlaceholder}>Click to Upload</div>}
                    </div>
                    <input type="file" ref={fileInputRef} style={{display:'none'}} onChange={handleImageChange} accept="image/*" />
                </div>

                <div className={styles.mainSectionTitle}>Personal Information</div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>First Name <span style={{color:'red'}}>*</span></label>
                        <input 
                            className={`${styles.inputField} ${errors.firstName?styles.errorBorder:''}`} 
                            name="firstName" 
                            value={formData.firstName} 
                            onChange={handleChange} 
                            maxLength={50}
                        />
                        {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Middle Name </label>
                        <input 
                            className={styles.inputField} 
                            name="middleName" 
                            value={formData.middleName} 
                            onChange={handleChange} 
                            maxLength={20}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Last Name <span style={{color:'red'}}>*</span></label>
                        <input 
                            className={`${styles.inputField} ${errors.lastName?styles.errorBorder:''}`} 
                            name="lastName" 
                            value={formData.lastName} 
                            onChange={handleChange} 
                            maxLength={20}
                        />
                        {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>License Number <span style={{color:'red'}}>*</span></label>
                        <input 
                            className={`${styles.inputField} ${errors.licenseNumber?styles.errorBorder:''}`} 
                            name="licenseNumber" 
                            value={formData.licenseNumber} 
                            onChange={handleChange} 
                            onBlur={handleBlur} // ADDED onBlur
                            maxLength={7} 
                        />
                        {errors.licenseNumber && <span className={styles.errorText}>{errors.licenseNumber}</span>}
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>Specialization <span style={{color:'red'}}>*</span></label>
                        <select 
                            className={`${styles.inputField} ${errors.specialization?styles.errorBorder:''}`} 
                            name="specialization" 
                            value={formData.specialization} 
                            onChange={handleChange}
                        >
                            <option value="" hidden>Select Specialization</option>
                            {specializationOptions.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                        {errors.specialization && <span className={styles.errorText}>{errors.specialization}</span>}
                    </div>
                </div>

                {/* SWAPPED ORDER: EMAIL FIRST, THEN PHONE */}
                <div className={styles.row}>
                    <div className={styles.formGroup} style={{ flex: 1.5 }}> 
                        <label>Email Address <span style={{color:'red'}}>*</span></label>
                        <input 
                            className={`${styles.inputField} ${errors.email?styles.errorBorder:''}`} 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            onBlur={handleBlur} 
                        />
                        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>

                    <div className={styles.formGroup} style={{ flex: 1 }}>
                        <label>Phone Number <span style={{color:'red'}}>*</span></label>
                        <div className={`${styles.phoneInputGroup} ${errors.phone ? styles.errorBorder : ''}`}>
                            <span className={styles.phonePrefix}>+63</span>
                            <input 
                                className={styles.phoneField} 
                                name="phone" 
                                value={formData.phone} 
                                onChange={handleChange} 
                                onBlur={handleBlur}
                                maxLength={10} 
                                placeholder="9xxxxxxxxx"
                            />
                        </div>
                        {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Birthdate <span style={{color:'red'}}>*</span></label>
                        <input 
                            type="date" 
                            className={`${styles.inputField} ${errors.birthdate?styles.errorBorder:''}`} 
                            name="birthdate" 
                            value={formData.birthdate} 
                            onChange={handleChange} 
                            max={maxDate} 
                        />
                        {errors.birthdate && <span className={styles.errorText}>{errors.birthdate}</span>}
                    </div>
                </div>

                <hr className={styles.divider} />
                {renderAddressFields('currentAddress', 'Current Address')}
                <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center'}}><input type="checkbox" id="sameAddress" checked={isSameAddress} onChange={handleSameAddressToggle} style={{ width: '18px', height: '18px', marginRight: '10px', accentColor: '#005466', cursor: 'pointer' }} /><label htmlFor="sameAddress" style={{ fontSize: '14px', color: '#555', fontWeight: '500', cursor: 'pointer' }}>Permanent address is same as current address</label></div>
                {renderAddressFields('permanentAddress', 'Permanent Address', isSameAddress)}

                <div className={styles.buttonGroup}>
                    <button className={`${styles.actionBtn} ${styles.cancelBtn}`} onClick={handleCancelClick}>Cancel</button>
                    
                    <button 
                        className={`${styles.actionBtn} ${styles.submitBtn} ${!hasChanges() ? styles.disabledBtn : ''}`} 
                        onClick={handleSaveClick}
                        disabled={!hasChanges()}
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            {/* MODALS remain unchanged */}
            {showSaveModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <h3 className={styles.modalTitle}>Save Changes?</h3>
                        <p className={styles.modalMessage}>Are you sure you want to update this dentist's information?</p>
                        <div className={styles.modalActions}>
                            <button className={styles.modalCancelBtn} onClick={() => setShowSaveModal(false)}>No, Keep Editing</button>
                            <button className={styles.modalDeleteBtn} onClick={handleConfirmSave} style={{backgroundColor: '#005466'}}>Yes, Save</button>
                        </div>
                    </div>
                </div>
            )}

            {showCancelModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <img src={warningIcon} alt="Warning" className={styles.modalIcon} />
                        <h3 className={styles.modalTitle}>Discard Changes?</h3>
                        <p className={styles.modalMessage}>You have unsaved changes. Are you sure you want to discard them?</p>
                        <div className={styles.modalActions}>
                            <button className={styles.modalCancelBtn} onClick={() => setShowCancelModal(false)}>No, Keep Editing</button>
                            <button className={styles.modalDeleteBtn} onClick={handleDiscardChanges} style={{backgroundColor: '#c62828'}}>Yes, Discard</button>
                        </div>
                    </div>
                </div>
            )}

            {showSuccessModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <img src={successIcon} alt="Success" className={styles.modalIcon} />
                        <h3 className={styles.modalTitle}>Success!</h3>
                        <p className={styles.modalMessage}>Dentist profile updated successfully.</p>
                        <button className={styles.closeLink} onClick={() => navigate(-1)}>Back to Profile</button>
                    </div>
                </div>
            )}
        </div>
    );
}