import React, { useState, useRef } from 'react';
import styles from '../../styles/add-user/AddSecretaryPage.module.css';
import { useNavigate } from 'react-router-dom';
import { regions, provinces, cities, barangays } from '../../utils/addressData';
import successIcon from '../../assets/alert-icons/success.svg';

export default function AddSecretaryPage() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    const [isSameAddress, setIsSameAddress] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errors, setErrors] = useState({}); 

    const initialAddressState = { 
        country: 'Philippines', region: '', province: '', city: '', barangay: '', houseNumber: '', street: '' 
    };

    const [formData, setFormData] = useState({
        firstName: '', middleName: '', lastName: '', birthdate: '', 
        email: '', phone: '',
        currentAddress: { ...initialAddressState },
        permanentAddress: { ...initialAddressState }
    });

    // --- HELPERS ---
    const validateEmailFormat = (email) => {
        const formatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formatRegex.test(email)) return false;
        const allowedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'live.com'];
        const domain = email.split('@')[1].toLowerCase();
        return allowedDomains.includes(domain);
    };

    const toTitleCase = (str) => str.toLowerCase().replace(/(?:^|\s|-|\.)\S/g, (char) => char.toUpperCase());
    const getMaxDate = () => { const t=new Date(); t.setFullYear(t.getFullYear()-18); return t.toISOString().split('T')[0]; };

    // --- REALTIME VALIDATION (ON BLUR) ---
    const handleBlur = (e) => {
        const { name, value } = e.target;
        let newError = "";

        switch (name) {
            case 'email':
                if (!value) newError = "Required";
                else if (!validateEmailFormat(value)) newError = "Invalid email domain (e.g. gmail.com)";
                break;
            case 'phone':
                if (!value) newError = "Required";
                else if (value.length !== 10 || value[0] !== '9') newError = "Invalid format (9xxxxxxxxx)";
                break;
            case 'firstName':
            case 'lastName':
            case 'birthdate':
                if (!value) newError = "Required";
                break;
            default: break;
        }
        setErrors(prev => ({ ...prev, [name]: newError }));
    };

    // --- HANDLERS ---
    const handleImageChange = (e) => { 
        const file=e.target.files[0]; 
        if(file){ const r=new FileReader(); r.onloadend=()=>setProfileImage(r.result); r.readAsDataURL(file); }
    };
    const triggerFileInput = () => fileInputRef.current.click();

    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        if (errors[name]) setErrors(prev => { const n={...prev}; delete n[name]; return n; });

        if (['firstName', 'middleName', 'lastName'].includes(name)) {
            if (value===''||/^[a-zA-Z\s.-]+$/.test(value)) setFormData({...formData, [name]: toTitleCase(value)});
            return;
        }
        setFormData({ ...formData, [name]: value });
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length > 10) return;
        if (errors.phone) setErrors(prev => { const n={...prev}; delete n.phone; return n; });
        setFormData({ ...formData, phone: value });
    };

    const handleAddressChange = (type, field, value) => {
        const errorKey = `${type==='currentAddress'?'current':'permanent'}_${field}`;
        if(errors[errorKey]) setErrors(prev=>{const n={...prev};delete n[errorKey];return n;});
        setFormData(prev => {
            const updated = { ...prev[type], [field]: value };
            if(field==='region'){updated.province='';updated.city='';updated.barangay='';}
            else if(field==='province'){updated.city='';updated.barangay='';}
            else if(field==='city'){updated.barangay='';}
            if(type==='currentAddress'&&isSameAddress) return {...prev, currentAddress: updated, permanentAddress: updated};
            return {...prev, [type]: updated};
        });
    };

    const handleSameAddressToggle = (e) => {
        const checked = e.target.checked; setIsSameAddress(checked);
        if(checked) {
            setFormData(prev => ({...prev, permanentAddress: {...prev.currentAddress}}));
            setErrors(prev=>{const n={...prev}; Object.keys(n).forEach(k=>{if(k.startsWith('permanent_'))delete n[k];}); return n;});
        } else {
            setFormData(prev => ({...prev, permanentAddress: {...initialAddressState}}));
        }
    };

    // --- GET FORM ERRORS (Synchronous) ---
    const getFormErrors = () => {
        let newErrors = {};
        const required = ['firstName', 'lastName', 'birthdate', 'email', 'phone'];
        required.forEach(f => { if(!formData[f]) newErrors[f] = "Required"; });

        if(formData.phone && (formData.phone.length!==10 || formData.phone[0]!=='9')) { newErrors.phone="Invalid format"; }
        if(formData.email && !validateEmailFormat(formData.email)) { newErrors.email = "Invalid domain"; }
        
        // Age Check
        const today = new Date();
        const birth = new Date(formData.birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
        if(formData.birthdate && age < 18) { newErrors.birthdate = "Min age 18"; }

        // Address
        const validateAddr = (addr, prefix) => {
            ['region', 'province', 'city', 'barangay', 'street', 'houseNumber'].forEach(f => {
                if(!addr[f]) newErrors[`${prefix}_${f}`] = "Required"; 
            });
        };
        validateAddr(formData.currentAddress, 'current');
        if(!isSameAddress) validateAddr(formData.permanentAddress, 'permanent');

        return newErrors;
    };

    // --- SUBMIT WITH EMAIL CHECK ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Get Client-Side Errors
        const currentErrors = getFormErrors();

        // 2. Check Duplicate Email (Server-Side)
        // Only run if email is not empty and has valid format
        if (formData.email && !currentErrors.email) {
            try {
                const res = await fetch('http://localhost:5000/api/check-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.email })
                });
                if (res.status === 409) {
                    currentErrors.email = "Email already exists";
                }
            } catch (error) {
                console.error("Error checking email:", error);
            }
        }

        // 3. Update Errors State
        setErrors(currentErrors);

        // 4. Stop if any errors found
        if (Object.keys(currentErrors).length > 0) {
            const firstKey = Object.keys(currentErrors)[0];
            const el = document.getElementsByName(firstKey)[0];
            if(el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
            return;
        }

        // 5. Submit Data
        const finalData = {
            name: { first: formData.firstName, middle: formData.middleName, last: formData.lastName },
            email: formData.email,
            contactNumber: `+63${formData.phone}`,
            birthdate: formData.birthdate,
            role: 'secretary',
            profileImage: profileImage,
            currentAddress: formData.currentAddress,
            permanentAddress: isSameAddress ? formData.currentAddress : formData.permanentAddress
        };

        try {
            const response = await fetch('http://localhost:5000/api/add-secretary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            });

            const data = await response.json();

            if (response.ok) {
                setShowSuccessModal(true);
            } else {
                // Fallback for race conditions
                if (response.status === 409) {
                    setErrors(prev => ({ ...prev, [data.field]: data.message }));
                    const el = document.getElementsByName(data.field)[0];
                    if(el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
                } else {
                    alert(data.message || "Failed to add secretary");
                }
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Cannot connect to server.");
        }
    };

    const renderAddressFields = (type, title, isDisabled = false) => {
        const address = formData[type];
        const prefix = type === 'currentAddress' ? 'current' : 'permanent';
        const availProvinces = address.region ? provinces[address.region] || [] : [];
        const availCities = address.province ? cities[address.province] || [] : [];
        const availBarangays = address.city ? barangays[address.city] || [] : [];
        const getError = (field) => errors[`${prefix}_${field}`];
        const getErrorClass = (field) => getError(field) ? styles.errorBorder : '';

        return (
            <div className={styles.addressSection}>
                <h3 className={styles.sectionTitle}>{title}</h3>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>REGION <span style={{color:'red'}}>*</span></label>
                        <select name={`${prefix}_region`} className={`${styles.inputField} ${getErrorClass('region')}`} value={address.region} onChange={(e)=>handleAddressChange(type,'region',e.target.value)} disabled={isDisabled}>
                            <option value="" hidden>Select Region</option>
                            {regions.map(r=><option key={r.code} value={r.code}>{r.name}</option>)}
                        </select>
                        {getError('region') && <span className={styles.errorText}>{getError('region')}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>PROVINCE <span style={{color:'red'}}>*</span></label>
                        <select name={`${prefix}_province`} className={`${styles.inputField} ${getErrorClass('province')}`} value={address.province} onChange={(e)=>handleAddressChange(type,'province',e.target.value)} disabled={isDisabled || !address.region}>
                            <option value="" hidden>Select Province</option>
                            {availProvinces.map(p=><option key={p.code} value={p.code}>{p.name}</option>)}
                        </select>
                        {getError('province') && <span className={styles.errorText}>{getError('province')}</span>}
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>CITY / MUNICIPALITY <span style={{color:'red'}}>*</span></label>
                        <select name={`${prefix}_city`} className={`${styles.inputField} ${getErrorClass('city')}`} value={address.city} onChange={(e)=>handleAddressChange(type,'city',e.target.value)} disabled={isDisabled || !address.province}>
                            <option value="" hidden>Select City</option>
                            {availCities.map(c=><option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                        {getError('city') && <span className={styles.errorText}>{getError('city')}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>BARANGAY <span style={{color:'red'}}>*</span></label>
                        <select name={`${prefix}_barangay`} className={`${styles.inputField} ${getErrorClass('barangay')}`} value={address.barangay} onChange={(e)=>handleAddressChange(type,'barangay',e.target.value)} disabled={isDisabled || !address.city}>
                            <option value="" hidden>Select Barangay</option>
                            {availBarangays.map(b=><option key={b} value={b}>{b}</option>)}
                        </select>
                        {getError('barangay') && <span className={styles.errorText}>{getError('barangay')}</span>}
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>STREET <span style={{color:'red'}}>*</span></label>
                        <input name={`${prefix}_street`} className={`${styles.inputField} ${getErrorClass('street')}`} value={address.street} onChange={(e)=>handleAddressChange(type,'street',e.target.value)} disabled={isDisabled} maxLength={100} placeholder="e.g. Mabini St."/>
                        {getError('street') && <span className={styles.errorText}>{getError('street')}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>HOUSE NO. <span style={{color:'red'}}>*</span></label>
                        <input name={`${prefix}_houseNumber`} className={`${styles.inputField} ${getErrorClass('houseNumber')}`} value={address.houseNumber} onChange={(e)=>handleAddressChange(type,'houseNumber',e.target.value)} disabled={isDisabled} maxLength={20} placeholder="e.g. Unit 123"/>
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
                    <h2>Add New <span className={styles.highlight}>Secretary</span></h2>
                    <p>Enter the secretary's personal and professional details below.</p>
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
                        <div className={styles.formGroup}>
                            <label>FIRST NAME <span style={{color:'red'}}>*</span></label>
                            <input 
                                className={`${styles.inputField} ${errors.firstName?styles.errorBorder:''}`} 
                                name="firstName" 
                                value={formData.firstName} 
                                onChange={handlePersonalChange} 
                                onBlur={handleBlur}
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
                                maxLength={20}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>LAST NAME <span style={{color:'red'}}>*</span></label>
                            <input 
                                className={`${styles.inputField} ${errors.lastName?styles.errorBorder:''}`} 
                                name="lastName" 
                                value={formData.lastName} 
                                onChange={handlePersonalChange} 
                                onBlur={handleBlur}
                                maxLength={20}
                            />
                            {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
                        </div>
                    </div>
                    
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>BIRTHDATE <span style={{color:'red'}}>*</span></label>
                            <input 
                                type="date" 
                                className={`${styles.inputField} ${errors.birthdate?styles.errorBorder:''}`} 
                                name="birthdate" 
                                value={formData.birthdate} 
                                onChange={handlePersonalChange} 
                                onBlur={handleBlur}
                                max={getMaxDate()}
                            />
                            {errors.birthdate && <span className={styles.errorText}>{errors.birthdate}</span>}
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>PHONE NUMBER <span style={{color:'red'}}>*</span></label>
                            <div className={`${styles.phoneInputGroup} ${errors.phone ? styles.errorBorder : ''}`}>
                                <span className={styles.phonePrefix}>+63</span>
                                <input 
                                    className={styles.phoneField} 
                                    name="phone" 
                                    value={formData.phone} 
                                    onChange={handlePhoneChange} 
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
                            <label>EMAIL ADDRESS <span style={{color:'red'}}>*</span></label>
                            <input 
                                type="email" 
                                className={`${styles.inputField} ${errors.email ? styles.errorBorder : ''}`} 
                                name="email" 
                                value={formData.email} 
                                onChange={handlePersonalChange} 
                                onBlur={handleBlur} 
                                maxLength={100}
                            />
                            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                        </div>
                    </div>

                    <hr className={styles.divider} />
                    {renderAddressFields('currentAddress', 'Current Address')}
                    <div className={styles.permanentHeader}><h3 className={styles.sectionTitle}>Permanent Address</h3><div className={styles.checkboxContainer}><input type="checkbox" id="sameAddress" checked={isSameAddress} onChange={handleSameAddressToggle} /><label htmlFor="sameAddress">Same as Current Address</label></div></div>
                    {isSameAddress ? <div className={styles.disabledOverlay}>{renderAddressFields('permanentAddress', '', true)}</div> : renderAddressFields('permanentAddress', '')}

                    <div className={styles.buttonGroup}>
                        <button type="button" className={styles.cancelBtn} onClick={() => navigate('/owner/manage-secretaries')}>CANCEL</button>
                        <button type="submit" className={styles.submitBtn}>ADD SECRETARY</button>
                    </div>
                </form>
            </div>
            {showSuccessModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <img src={successIcon} alt="Success" className={styles.modalIcon} />
                        <h3 className={styles.modalTitle}>Secretary Added Successfully!</h3>
                        <p className={styles.modalMessage}>An email with the temporary password has been sent.</p>
                        <button className={styles.closeLink} onClick={() => navigate('/owner/manage-secretaries')}>Back to List</button>
                    </div>
                </div>
            )}
        </div>
    );
}