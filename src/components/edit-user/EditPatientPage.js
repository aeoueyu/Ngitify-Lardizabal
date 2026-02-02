import React, { useState, useRef, useEffect } from 'react';
import styles from '../../styles/edit-user/EditPatientPage.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { regions, provinces, cities, barangays } from '../../utils/addressData';
import successIcon from '../../assets/alert-icons/success.svg';
import warningIcon from '../../assets/alert-icons/warning.svg';

export default function EditPatientPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const fileInputRef = useRef(null);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSameAddress, setIsSameAddress] = useState(false);
    const [isMinor, setIsMinor] = useState(false);
    
    const [profileImage, setProfileImage] = useState(null);
    const [initialData, setInitialData] = useState(null);
    const [initialImage, setInitialImage] = useState(null);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errors, setErrors] = useState({});

    const relationshipOptions = ["Parent", "Sibling", "Spouse", "Relative", "Guardian", "Other"];
    const commonConditions = ["High Blood Pressure", "Diabetes", "Asthma", "Heart Disease", "Bleeding Disorders", "Epilepsy/Seizures", "None"];
    const initialAddressState = { region: '', province: '', city: '', barangay: '', houseNumber: '', street: '' };

    const [formData, setFormData] = useState({
        firstName: '', middleName: '', lastName: '', birthdate: '', email: '', phone: '',
        guardian: { name: '', relationship: '', contactNumber: '' },
        medicalHistory: { allergies: '', conditions: [] },
        currentAddress: { ...initialAddressState },
        permanentAddress: { ...initialAddressState }
    });

    const calculateIsMinor = (dateString) => {
        if (!dateString) return false;
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) age--;
        return age < 18;
    };
    const getTodayDate = () => new Date().toISOString().split('T')[0];
    const toTitleCase = (str) => str.toLowerCase().replace(/(?:^|\s|-|\.)\S/g, (char) => char.toUpperCase());
    
    const validateEmailFormat = (email) => {
        const formatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formatRegex.test(email)) return false;
        const allowedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'live.com'];
        const domain = email.split('@')[1].toLowerCase();
        return allowedDomains.includes(domain);
    };

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/user/${id}`);
                const data = await res.json();
                if (res.ok) {
                    const currentAddr = data.currentAddress || initialAddressState;
                    const permanentAddr = data.permanentAddress || initialAddressState;
                    const isSame = JSON.stringify(currentAddr) === JSON.stringify(permanentAddr);
                    const g = data.guardian || { name: '', relationship: '', contactNumber: '' };
                    const med = data.medicalHistory || { allergies: '', conditions: [] };

                    const loadedData = {
                        firstName: data.name.first, middleName: data.name.middle, lastName: data.name.last,
                        birthdate: data.birthdate ? new Date(data.birthdate).toISOString().split('T')[0] : '',
                        email: data.email,
                        phone: data.contactNumber ? data.contactNumber.replace('+63', '') : '',
                        guardian: { ...g, contactNumber: g.contactNumber ? g.contactNumber.replace('+63', '') : '' },
                        medicalHistory: med,
                        currentAddress: currentAddr, permanentAddress: permanentAddr
                    };

                    setFormData(loadedData);
                    setInitialData(loadedData);
                    setProfileImage(data.profileImage);
                    setInitialImage(data.profileImage);
                    setIsSameAddress(isSame);
                    setIsMinor(calculateIsMinor(loadedData.birthdate));
                }
            } catch (err) { console.error(err); } finally { setIsLoading(false); }
        };
        fetchPatient();
    }, [id]);

    const hasChanges = () => {
        if (!initialData) return false;
        const formChanged = JSON.stringify(formData) !== JSON.stringify(initialData);
        const imageChanged = profileImage !== initialImage;
        return formChanged || imageChanged;
    };

    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        if(errors[name]) setErrors(prev=>{const n={...prev};delete n[name];return n;});

        if (['firstName', 'middleName', 'lastName'].includes(name)) {
            if (value===''||/^[a-zA-Z\s.-]+$/.test(value)) setFormData({...formData, [name]: toTitleCase(value)});
            return;
        }
        if (name === 'birthdate') {
            if(errors.birthdate) setErrors(prev=>{const n={...prev};delete n.birthdate;return n;});
            setIsMinor(calculateIsMinor(value));
        }
        setFormData({ ...formData, [name]: value });
    };

    const handlePhoneChange = (e) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        if(val.length>10) return;
        if(errors.phone) setErrors(prev=>{const n={...prev};delete n.phone;return n;});
        setFormData({...formData, phone: val});
    };

    const handleGuardianChange = (e) => {
        const { name, value } = e.target;
        const errorKey = name === 'name' ? 'guardianName' : name === 'relationship' ? 'guardianRel' : 'guardianPhone';
        if(errors[errorKey]) setErrors(prev=>{const n={...prev};delete n[errorKey];return n;});

        if (name === 'contactNumber') {
            const val = value.replace(/[^0-9]/g, '');
            if(val.length>10) return;
            setFormData(prev => ({ ...prev, guardian: { ...prev.guardian, [name]: val } }));
        } else if (name === 'name') {
             if (value===''||/^[a-zA-Z\s.-]+$/.test(value)) {
                setFormData(prev => ({ ...prev, guardian: { ...prev.guardian, [name]: toTitleCase(value) } }));
             }
        } else {
            setFormData(prev => ({ ...prev, guardian: { ...prev.guardian, [name]: value } }));
        }
    };

    const handleMedicalChange = (e) => {
        const { name, value, checked, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => {
                const currentConditions = prev.medicalHistory.conditions || [];
                let newConditions = checked ? [...currentConditions, value] : currentConditions.filter(c => c !== value);
                return { ...prev, medicalHistory: { ...prev.medicalHistory, conditions: newConditions } };
            });
        } else {
            setFormData(prev => ({ ...prev, medicalHistory: { ...prev.medicalHistory, [name]: value } }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let newError = "";
        switch (name) {
            case 'email': if (value && !validateEmailFormat(value)) newError = "Invalid email domain"; break; 
            case 'phone': if (value && (value.length !== 10 || value[0] !== '9')) newError = "Invalid format"; break;
            case 'firstName': case 'lastName': case 'birthdate': if (!value) newError = "Required"; break;
            default: break;
        }
        setErrors(prev => ({ ...prev, [name]: newError }));
    };

    // --- GET FORM ERRORS (Sync) ---
    const getFormErrors = () => {
        let newErrors = {};
        const required = ['firstName', 'lastName', 'birthdate', 'email'];
        required.forEach(f => { if(!formData[f]) newErrors[f] = "Required"; });
        
        if (formData.phone && (formData.phone.length !== 10 || formData.phone[0] !== '9')) newErrors.phone = "Invalid format";
        if (!formData.phone) newErrors.phone = "Required";
        if (formData.email && !validateEmailFormat(formData.email)) newErrors.email = "Invalid email domain";
        
        if(isMinor) {
            if(!formData.guardian.name) newErrors.guardianName="Required";
            if(!formData.guardian.relationship) newErrors.guardianRel="Required";
            if(!formData.guardian.contactNumber || formData.guardian.contactNumber.length!==10) newErrors.guardianPhone="Invalid phone";
        }
        return newErrors;
    };

    // --- SAVE LOGIC ---
    const handleSaveClick = async () => {
        // 1. Get Client Errors
        const currentErrors = getFormErrors();

        // 2. Check Duplicate Email (Server)
        if (formData.email && !currentErrors.email) {
            try {
                // Pass 'excludeId' to ignore current user's email
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
            let el = document.getElementsByName(firstKey)[0];
            if (firstKey === 'guardianName') el = document.getElementsByName('name')[0];
            if (firstKey === 'guardianRel') el = document.getElementsByName('relationship')[0];
            if (firstKey === 'guardianPhone') el = document.getElementsByName('contactNumber')[0];
            if(el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
            return;
        }

        setShowConfirmModal(true);
    };

    const handleConfirmSave = async () => {
        setShowConfirmModal(false);
        const finalData = {
            name: { first: formData.firstName, middle: formData.middleName, last: formData.lastName },
            email: formData.email,
            contactNumber: `+63${formData.phone}`,
            birthdate: formData.birthdate,
            profileImage,
            medicalHistory: formData.medicalHistory,
            currentAddress: formData.currentAddress,
            permanentAddress: isSameAddress ? formData.currentAddress : formData.permanentAddress,
            guardian: isMinor ? { ...formData.guardian, contactNumber: `+63${formData.guardian.contactNumber}` } : null
        };

        try {
            const res = await fetch(`http://localhost:5000/api/user/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData)
            });
            if(res.ok) setShowSuccessModal(true);
            else alert("Failed to update patient.");
        } catch (e) { console.error(e); }
    };

    const handleImageChange = (e) => { const f=e.target.files[0]; if(f){ const r=new FileReader(); r.onloadend=()=>setProfileImage(r.result); r.readAsDataURL(f); }};
    
    const handleAddressChange = (type, field, value) => {
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

    const renderAddressFields = (type, title, disabled = false) => {
        const addr = formData[type];
        return (
            <div className={styles.addressBlock}>
                <h3 className={styles.sectionTitle}>{title}</h3>
                <div className={styles.row}>
                    <div className={styles.formGroup}><label>Region</label><select className={styles.inputField} value={addr.region} onChange={(e)=>handleAddressChange(type,'region',e.target.value)} disabled={disabled}><option value="" hidden>Select</option>{regions.map(r=><option key={r.code} value={r.code}>{r.name}</option>)}</select></div>
                    <div className={styles.formGroup}><label>Province</label><select className={styles.inputField} value={addr.province} onChange={(e)=>handleAddressChange(type,'province',e.target.value)} disabled={disabled||!addr.region}><option value="" hidden>Select</option>{(provinces[addr.region]||[]).map(p=><option key={p.code} value={p.code}>{p.name}</option>)}</select></div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}><label>City</label><select className={styles.inputField} value={addr.city} onChange={(e)=>handleAddressChange(type,'city',e.target.value)} disabled={disabled||!addr.province}><option value="" hidden>Select</option>{(cities[addr.province]||[]).map(c=><option key={c.code} value={c.code}>{c.name}</option>)}</select></div>
                    <div className={styles.formGroup}><label>Barangay</label><select className={styles.inputField} value={addr.barangay} onChange={(e)=>handleAddressChange(type,'barangay',e.target.value)} disabled={disabled||!addr.city}><option value="" hidden>Select</option>{(barangays[addr.city]||[]).map(b=><option key={b} value={b}>{b}</option>)}</select></div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}><label>Street</label><input className={styles.inputField} value={addr.street} onChange={(e)=>handleAddressChange(type,'street',e.target.value)} disabled={disabled}/></div>
                    <div className={styles.formGroup}><label>House No.</label><input className={styles.inputField} value={addr.houseNumber} onChange={(e)=>handleAddressChange(type,'houseNumber',e.target.value)} disabled={disabled}/></div>
                </div>
            </div>
        );
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <div className={styles.header}><h2>Edit Patient</h2><p>Update information.</p></div>
                <div className={styles.uploadSection}><div className={styles.imageWrapper} onClick={()=>fileInputRef.current.click()}>{profileImage ? <img src={profileImage} className={styles.previewImage} alt="Profile"/> : "Upload"}</div><input type="file" ref={fileInputRef} style={{display:'none'}} onChange={handleImageChange} accept="image/*"/></div>

                <div className={styles.mainSectionTitle}>Personal Information</div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>First Name (Max 50) <span style={{color:'red'}}>*</span></label>
                        <input className={`${styles.inputField} ${errors.firstName?styles.errorBorder:''}`} name="firstName" value={formData.firstName} onChange={handlePersonalChange} onBlur={handleBlur} maxLength={50}/>
                        {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Middle Name (Max 20)</label>
                        <input className={styles.inputField} name="middleName" value={formData.middleName} onChange={handlePersonalChange} maxLength={20}/>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Last Name (Max 20) <span style={{color:'red'}}>*</span></label>
                        <input className={`${styles.inputField} ${errors.lastName?styles.errorBorder:''}`} name="lastName" value={formData.lastName} onChange={handlePersonalChange} onBlur={handleBlur} maxLength={20}/>
                        {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Birthdate <span style={{color:'red'}}>*</span></label>
                        <input type="date" className={`${styles.inputField} ${errors.birthdate?styles.errorBorder:''}`} name="birthdate" value={formData.birthdate} onChange={handlePersonalChange} onBlur={handleBlur} max={getTodayDate()}/>
                        {errors.birthdate && <span className={styles.errorText}>{errors.birthdate}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Phone Number <span style={{color:'red'}}>*</span></label>
                        <div className={`${styles.phoneInputGroup} ${errors.phone?styles.errorBorder:''}`}>
                            <span className={styles.phonePrefix}>+63</span>
                            <input className={styles.phoneField} name="phone" value={formData.phone} onChange={handlePhoneChange} onBlur={handleBlur} maxLength={10} placeholder="9xxxxxxxxx"/>
                        </div>
                        {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Email Address <span style={{color:'red'}}>*</span></label>
                        <input className={`${styles.inputField} ${errors.email?styles.errorBorder:''}`} name="email" value={formData.email} onChange={handlePersonalChange} onBlur={handleBlur}/>
                        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>
                </div>

                {isMinor && (
                    <div className={styles.guardianSection}>
                        <h3 className={styles.sectionTitle} style={{color: '#f57f17'}}>GUARDIAN INFO (Minor)</h3>
                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>Guardian Name (Max 50) <span style={{color:'red'}}>*</span></label>
                                <input className={`${styles.inputField} ${errors.guardianName?styles.errorBorder:''}`} name="name" value={formData.guardian.name} onChange={handleGuardianChange} maxLength={50}/>
                                {errors.guardianName && <span className={styles.errorText}>{errors.guardianName}</span>}
                            </div>
                            <div className={styles.formGroup}>
                                <label>Relationship <span style={{color:'red'}}>*</span></label>
                                <select className={`${styles.inputField} ${errors.guardianRel?styles.errorBorder:''}`} name="relationship" value={formData.guardian.relationship} onChange={handleGuardianChange}>
                                    <option value="" hidden>Select</option>
                                    {relationshipOptions.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                                {errors.guardianRel && <span className={styles.errorText}>{errors.guardianRel}</span>}
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>Guardian Phone <span style={{color:'red'}}>*</span></label>
                                <div className={`${styles.phoneInputGroup} ${errors.guardianPhone?styles.errorBorder:''}`}>
                                    <span className={styles.phonePrefix}>+63</span>
                                    <input className={styles.phoneField} name="contactNumber" value={formData.guardian.contactNumber} onChange={handleGuardianChange} maxLength={10} placeholder="9xxxxxxxxx"/>
                                </div>
                                {errors.guardianPhone && <span className={styles.errorText}>{errors.guardianPhone}</span>}
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.divider}></div>
                
                {/* MEDICAL HISTORY */}
                <div className={styles.medicalSection}>
                    <h3 className={styles.mainSectionTitle}>Medical History</h3>
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>ALLERGIES</label>
                            <input className={styles.inputField} name="allergies" value={formData.medicalHistory.allergies} onChange={handleMedicalChange} placeholder="e.g. Peanuts" />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label style={{marginBottom:'10px', display:'block'}}>MEDICAL CONDITIONS</label>
                        <div className={styles.checkboxGrid}>
                            {commonConditions.map(condition => (
                                <label key={condition} className={styles.checkboxItem}>
                                    <input type="checkbox" name="conditions" value={condition} checked={formData.medicalHistory.conditions.includes(condition)} onChange={handleMedicalChange} className={styles.checkboxInput}/>{condition}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <hr className={styles.divider}/>
                {renderAddressFields('currentAddress', 'Current Address')}
                <div style={{margin:'20px 0', display:'flex', alignItems:'center'}}><input type="checkbox" checked={isSameAddress} onChange={(e)=>{setIsSameAddress(e.target.checked); if(e.target.checked) setFormData(p=>({...p, permanentAddress: p.currentAddress}))}}/><label style={{marginLeft:'10px'}}>Same as Current</label></div>
                {renderAddressFields('permanentAddress', 'Permanent Address', isSameAddress)}

                <div className={styles.buttonGroup}>
                    <button className={`${styles.actionBtn} ${styles.backBtn}`} onClick={()=>navigate(-1)}>Cancel</button>
                    <button className={`${styles.actionBtn} ${styles.editBtn} ${!hasChanges()?styles.disabledBtn:''}`} onClick={handleSaveClick} disabled={!hasChanges()}>Save Changes</button>
                </div>
            </div>
            
            {showConfirmModal && <div className={styles.modalOverlay}><div className={styles.modalCard}><img src={warningIcon} className={styles.modalIcon}/><h3>Save Changes?</h3><div className={styles.modalActions}><button className={styles.modalCancelBtn} onClick={()=>setShowConfirmModal(false)}>No</button><button className={styles.modalDeleteBtn} style={{backgroundColor:'#005466'}} onClick={handleConfirmSave}>Yes</button></div></div></div>}
            {showSuccessModal && <div className={styles.modalOverlay}><div className={styles.modalCard}><img src={successIcon} className={styles.modalIcon}/><h3>Success!</h3><button className={styles.closeLink} onClick={()=>navigate(-1)}>Back</button></div></div>}
        </div>
    );
}