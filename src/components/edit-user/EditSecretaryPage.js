import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../styles/edit-user/EditSecretaryPage.module.css';
import { regions, provinces, cities, barangays } from '../../utils/addressData'; 
import warningIcon from '../../assets/alert-icons/warning.svg';
import successIcon from '../../assets/alert-icons/success.svg';

export default function EditSecretaryPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(true);

    const initialAddressState = { region: '', province: '', city: '', barangay: '', street: '', houseNumber: '' };

    const [formData, setFormData] = useState({
        firstName: '', middleName: '', lastName: '', 
        email: '', phone: '', birthdate: '',
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
    const getMaxDate = () => { const t=new Date(); t.setFullYear(t.getFullYear()-18); return t.toISOString().split('T')[0]; };
    const validateEmailFormat = (email) => {
        const formatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formatRegex.test(email)) return false;
        const allowedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'live.com'];
        const domain = email.split('@')[1].toLowerCase();
        return allowedDomains.includes(domain);
    };
    const toTitleCase = (str) => str.toLowerCase().replace(/(?:^|\s|-|\.)\S/g, (char) => char.toUpperCase());

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchSecretary = async () => {
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
        fetchSecretary();
    }, [id]);

    const hasChanges = () => {
        if (!initialData) return false;
        const formChanged = JSON.stringify(formData) !== JSON.stringify(initialData);
        const imageChanged = profileImage !== initialImage;
        return formChanged || imageChanged;
    };

    // --- HANDLERS ---
    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        if (errors[name]) setErrors(prev => { const n={...prev}; delete n[name]; return n; });

        if (['firstName', 'middleName', 'lastName'].includes(name)) {
            if (value === '' || /^[a-zA-Z\s.-]+$/.test(value)) {
                setFormData(prev => ({ ...prev, [name]: toTitleCase(value) }));
            }
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length > 10) return;
        if (errors.phone) setErrors(prev => { const n={...prev}; delete n.phone; return n; });
        setFormData({ ...formData, phone: value });
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let newError = "";
        switch (name) {
            case 'email': if (value && !validateEmailFormat(value)) newError = "Invalid email domain"; break;
            case 'phone': if (value && (value.length !== 10 || value[0] !== '9')) newError = "Invalid format"; break;
            case 'firstName': case 'lastName': if (!value) newError = "Required"; break;
            case 'birthdate':
                if(!value) newError = "Required";
                else {
                    const t=new Date(); const b=new Date(value); let age=t.getFullYear()-b.getFullYear();
                    if(t.getMonth()<b.getMonth() || (t.getMonth()===b.getMonth() && t.getDate()<b.getDate())) age--;
                    if(age<18) newError="Min age 18";
                }
                break;
            default: break;
        }
        if (newError) setErrors(prev => ({ ...prev, [name]: newError }));
    };

    const handleImageChange = (e) => { const f=e.target.files[0]; if(f){ const r=new FileReader(); r.onloadend=()=>setProfileImage(r.result); r.readAsDataURL(f); }};

    const handleAddressChange = (type, field, value) => {
        const prefix = type === 'currentAddress' ? 'current' : 'permanent';
        const errorKey = `${prefix}_${field}`;
        if(errors[errorKey]) setErrors(prev=>{const n={...prev};delete n[errorKey];return n;});
        setFormData(prev => {
            const upd = { ...prev[type], [field]: value };
            if(field==='region'){upd.province='';upd.city='';upd.barangay='';}
            else if(field==='province'){upd.city='';upd.barangay='';}
            else if(field==='city'){upd.barangay='';}
            const newState = {...prev, [type]: upd};
            if(isSameAddress && type==='currentAddress') newState.permanentAddress = upd;
            return newState;
        });
    };

    const handleSameAddressToggle = (e) => {
        const checked = e.target.checked; setIsSameAddress(checked);
        if (checked) { setFormData(prev => ({ ...prev, permanentAddress: prev.currentAddress })); } 
        else { setFormData(prev => ({ ...prev, permanentAddress: { ...initialAddressState } })); }
    };

    // --- VALIDATION (Gather Errors) ---
    const getFormErrors = () => {
        let newErrors = {};
        const required = ['firstName', 'lastName', 'birthdate', 'email'];
        required.forEach(f => { if(!formData[f]) newErrors[f] = "Required"; });

        if(formData.phone && (formData.phone.length!==10 || formData.phone[0]!=='9')) newErrors.phone="Invalid format";
        if(!formData.phone) newErrors.phone="Required";
        if(formData.email && !validateEmailFormat(formData.email)) newErrors.email="Invalid domain";
        
        // Age Check
        if(formData.birthdate) {
            const t=new Date(); const b=new Date(formData.birthdate); let age=t.getFullYear()-b.getFullYear();
            if(t.getMonth()<b.getMonth() || (t.getMonth()===b.getMonth() && t.getDate()<b.getDate())) age--;
            if(age<18) newErrors.birthdate = "Min age 18";
        }

        const checkAddr = (addr, prefix) => {
            ['region', 'province', 'city', 'barangay', 'street', 'houseNumber'].forEach(f => {
                if(!addr[f]) newErrors[`${prefix}_${f}`] = "Required";
            });
        };
        checkAddr(formData.currentAddress, 'current');
        if(!isSameAddress) checkAddr(formData.permanentAddress, 'permanent');

        return newErrors;
    };

    // --- SAVE LOGIC ---
    const handleSaveClick = async () => {
        const currentErrors = getFormErrors();

        // Check Duplicate Email (Server)
        if (formData.email && !currentErrors.email) {
            try {
                // Pass excludeId to ignore own email
                const res = await fetch('http://localhost:5000/api/check-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.email, excludeId: id }) 
                });
                if (res.status === 409) {
                    currentErrors.email = "Email already exists";
                }
            } catch (error) { console.error("Error checking email:", error); }
        }

        setErrors(currentErrors);

        if (Object.keys(currentErrors).length > 0) {
            const firstKey = Object.keys(currentErrors)[0];
            const el = document.getElementsByName(firstKey)[0];
            if(el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
            return;
        }

        setShowSaveModal(true);
    };

    const handleConfirmSave = async () => {
        setShowSaveModal(false);
        try {
            const updatePayload = {
                name: { first: formData.firstName, middle: formData.middleName, last: formData.lastName },
                contactNumber: `+63${formData.phone}`, 
                birthdate: formData.birthdate,
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
                    setErrors(prev => ({ ...prev, [data.field]: data.message }));
                    const el = document.getElementsByName(data.field)[0];
                    if(el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
                } else alert("Failed to update.");
            }
        } catch (error) { console.error(error); }
    };

    const handleCancelClick = () => {
        if (hasChanges()) setShowCancelModal(true);
        else navigate(-1);
    };

    const handleDiscardChanges = () => navigate(-1);

    // FIX: Using isDisabled and address to match usages inside
    const renderAddressFields = (type, title, isDisabled = false) => {
        const address = formData[type]; // Fixed variable name
        const prefix = type === 'currentAddress' ? 'current' : 'permanent';
        
        const availProvinces = address.region ? provinces[address.region] || [] : [];
        const availCities = address.province ? cities[address.province] || [] : [];
        const availBarangays = address.city ? barangays[address.city] || [] : [];
        
        const getError = (field) => errors[`${prefix}_${field}`];
        const getErrorClass = (field) => getError(field) ? styles.errorBorder : '';

        return (
            <div className={styles.addressBlock}>
                <h3 className={styles.sectionTitle}>{title}</h3>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Region <span style={{color:'red'}}>*</span></label>
                        <select name={`${prefix}_region`} className={`${styles.inputField} ${getErrorClass('region')}`} value={address.region} onChange={(e)=>handleAddressChange(type,'region',e.target.value)} disabled={isDisabled}>
                            <option value="" hidden>Select Region</option>
                            {regions.map(r=><option key={r.code} value={r.code}>{r.name}</option>)}
                        </select>
                        {getError('region') && <span className={styles.errorText}>{getError('region')}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Province <span style={{color:'red'}}>*</span></label>
                        <select name={`${prefix}_province`} className={`${styles.inputField} ${getErrorClass('province')}`} value={address.province} onChange={(e)=>handleAddressChange(type,'province',e.target.value)} disabled={isDisabled || !address.region}>
                            <option value="" hidden>Select Province</option>
                            {availProvinces.map(p=><option key={p.code} value={p.code}>{p.name}</option>)}
                        </select>
                        {getError('province') && <span className={styles.errorText}>{getError('province')}</span>}
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>City / Municipality <span style={{color:'red'}}>*</span></label>
                        <select name={`${prefix}_city`} className={`${styles.inputField} ${getErrorClass('city')}`} value={address.city} onChange={(e)=>handleAddressChange(type,'city',e.target.value)} disabled={isDisabled || !address.province}>
                            <option value="" hidden>Select City</option>
                            {availCities.map(c=><option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                        {getError('city') && <span className={styles.errorText}>{getError('city')}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Barangay <span style={{color:'red'}}>*</span></label>
                        <select name={`${prefix}_barangay`} className={`${styles.inputField} ${getErrorClass('barangay')}`} value={address.barangay} onChange={(e)=>handleAddressChange(type,'barangay',e.target.value)} disabled={isDisabled || !address.city}>
                            <option value="" hidden>Select Barangay</option>
                            {availBarangays.map(b=><option key={b} value={b}>{b}</option>)}
                        </select>
                        {getError('barangay') && <span className={styles.errorText}>{getError('barangay')}</span>}
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Street <span style={{color:'red'}}>*</span></label>
                        <input name={`${prefix}_street`} className={`${styles.inputField} ${getErrorClass('street')}`} value={address.street} onChange={(e)=>handleAddressChange(type,'street',e.target.value)} disabled={isDisabled} />
                        {getError('street') && <span className={styles.errorText}>{getError('street')}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>House No. <span style={{color:'red'}}>*</span></label>
                        <input name={`${prefix}_houseNumber`} className={`${styles.inputField} ${getErrorClass('houseNumber')}`} value={address.houseNumber} onChange={(e)=>handleAddressChange(type,'houseNumber',e.target.value)} disabled={isDisabled} />
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
                    <h2>Edit Secretary</h2>
                    <p>Update secretary's personal and professional information.</p>
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
                        <label>First Name (Max 50) <span style={{color:'red'}}>*</span></label>
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
                        <label>Middle Name (Max 20)</label>
                        <input 
                            className={styles.inputField} 
                            name="middleName" 
                            value={formData.middleName} 
                            onChange={handlePersonalChange} 
                            maxLength={20}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Last Name (Max 20) <span style={{color:'red'}}>*</span></label>
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
                        <label>Birthdate (18+ only) <span style={{color:'red'}}>*</span></label>
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
                        <label>Phone Number <span style={{color:'red'}}>*</span></label>
                        <div className={`${styles.phoneInputGroup} ${errors.phone?styles.errorBorder:''}`}>
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
                        <label>Email Address <span style={{color:'red'}}>*</span></label>
                        <input 
                            className={`${styles.inputField} ${errors.email?styles.errorBorder:''}`} 
                            name="email" 
                            value={formData.email} 
                            onChange={handlePersonalChange} 
                            onBlur={handleBlur} 
                        />
                        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>
                </div>

                <hr className={styles.divider} />
                {renderAddressFields('currentAddress', 'Current Address')}
                <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center' }}><input type="checkbox" id="sameAddress" checked={isSameAddress} onChange={handleSameAddressToggle} style={{ width: '18px', height: '18px', marginRight: '10px', accentColor: '#005466' }} /><label htmlFor="sameAddress" style={{ fontSize: '14px', color: '#555', fontWeight: '500', cursor: 'pointer' }}>Permanent address is same as current address</label></div>
                {renderAddressFields('permanentAddress', 'Permanent Address', isSameAddress)}

                <div className={styles.buttonGroup}>
                    <button className={`${styles.actionBtn} ${styles.backBtn}`} onClick={handleCancelClick}>Cancel</button>
                    <button className={`${styles.actionBtn} ${styles.editBtn} ${!hasChanges() ? styles.disabledBtn : ''}`} onClick={handleSaveClick} disabled={!hasChanges()}>Save Changes</button>
                </div>
            </div>

            {showSaveModal && (<div className={styles.modalOverlay}><div className={styles.modalCard}><img src={warningIcon} className={styles.modalIcon} /><h3>Save Changes?</h3><p>Update secretary's information?</p><div className={styles.modalActions}><button className={styles.modalCancelBtn} onClick={() => setShowSaveModal(false)}>No</button><button className={styles.modalDeleteBtn} onClick={handleConfirmSave} style={{backgroundColor: '#005466'}}>Yes, Save</button></div></div></div>)}
            {showCancelModal && (<div className={styles.modalOverlay}><div className={styles.modalCard}><img src={warningIcon} className={styles.modalIcon} /><h3>Discard Changes?</h3><p>Unsaved changes will be lost.</p><div className={styles.modalActions}><button className={styles.modalCancelBtn} onClick={() => setShowCancelModal(false)}>No</button><button className={styles.modalDeleteBtn} onClick={handleDiscardChanges} style={{backgroundColor: '#c62828'}}>Yes, Discard</button></div></div></div>)}
            {showSuccessModal && (<div className={styles.modalOverlay}><div className={styles.modalCard}><img src={successIcon} className={styles.modalIcon} /><h3>Success!</h3><button className={styles.closeLink} onClick={() => navigate(-1)}>Back to Profile</button></div></div>)}
        </div>
    );
}