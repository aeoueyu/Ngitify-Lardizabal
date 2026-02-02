import React, { useState, useRef } from 'react';
import styles from '../../styles/add-user/AddPatientPage.module.css';
import { useNavigate } from 'react-router-dom';
import { regions, provinces, cities, barangays } from '../../utils/addressData';
import successIcon from '../../assets/alert-icons/success.svg';

export default function AddPatientPage() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    const [isSameAddress, setIsSameAddress] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isMinor, setIsMinor] = useState(false);
    const [errors, setErrors] = useState({});

    // Medical Conditions List
    const commonConditions = [
        "High Blood Pressure", "Diabetes", "Asthma", "Heart Disease", 
        "Bleeding Disorders", "Epilepsy/Seizures", "None"
    ];

    const initialAddressState = { country: 'Philippines', region: '', province: '', city: '', barangay: '', houseNumber: '', street: '' };

    const [formData, setFormData] = useState({
        firstName: '', middleName: '', lastName: '', birthdate: '', email: '', phone: '',
        guardian: { name: '', relationship: '', contactNumber: '' },
        medicalHistory: { allergies: '', conditions: [] },
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
    const getTodayDate = () => new Date().toISOString().split('T')[0];

    const calculateIsMinor = (dateString) => {
        if (!dateString) return false;
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age < 18;
    };

    // --- HANDLERS ---
    const handleImageChange = (e) => { const file=e.target.files[0]; if(file){ const r=new FileReader(); r.onloadend=()=>setProfileImage(r.result); r.readAsDataURL(file); }};
    const triggerFileInput = () => fileInputRef.current.click();

    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        // Clear Error Real-time
        if (errors[name]) setErrors(prev => { const n={...prev}; delete n[name]; return n; });

        if (['firstName', 'middleName', 'lastName'].includes(name)) {
            if (value===''||/^[a-zA-Z\s.-]+$/.test(value)) setFormData({...formData, [name]: toTitleCase(value)});
            return;
        }

        if (name === 'birthdate') {
            if (errors.birthdate) setErrors(prev => { const n={...prev}; delete n.birthdate; return n; });
            const isNowMinor = calculateIsMinor(value);
            setIsMinor(isNowMinor);
            if (!isNowMinor) {
                setFormData(prev => ({ ...prev, birthdate: value, guardian: { name: '', relationship: '', contactNumber: '' } }));
                return;
            }
        }
        setFormData({ ...formData, [name]: value });
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length > 10) return;
        if (errors.phone) setErrors(prev => { const n={...prev}; delete n.phone; return n; });
        setFormData({ ...formData, phone: value });
    };

    const handleGuardianChange = (e) => {
        const { name, value } = e.target;
        // Clear specific guardian error
        const errorKey = name === 'name' ? 'guardianName' : name === 'relationship' ? 'guardianRel' : 'guardianPhone';
        if(errors[errorKey]) setErrors(prev=>{const n={...prev};delete n[errorKey];return n;});

        if (name === 'contactNumber') {
            const val = value.replace(/[^0-9]/g, '');
            if (val.length > 10) return;
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
                const currentConditions = prev.medicalHistory.conditions;
                let newConditions = checked ? [...currentConditions, value] : currentConditions.filter(c => c !== value);
                return { ...prev, medicalHistory: { ...prev.medicalHistory, conditions: newConditions } };
            });
        } else {
            setFormData(prev => ({ ...prev, medicalHistory: { ...prev.medicalHistory, [name]: value } }));
        }
    };

    // --- REAL-TIME VALIDATION (Format Only) ---
    const handleBlur = (e) => {
        const { name, value } = e.target;
        let newError = "";

        switch (name) {
            case 'email':
                if (value && !validateEmailFormat(value)) newError = "Invalid email domain (e.g. gmail.com)";
                break; 
            case 'phone':
                if (value && (value.length !== 10 || value[0] !== '9')) newError = "Invalid format";
                break;
            case 'firstName':
            case 'lastName':
            case 'birthdate':
                if (!value) newError = "Required";
                break;
            default: break;
        }
        if (newError) setErrors(prev => ({ ...prev, [name]: newError }));
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
        if(checked) setFormData(prev => ({...prev, permanentAddress: {...prev.currentAddress}}));
        else setFormData(prev => ({...prev, permanentAddress: {...initialAddressState}}));
    };

    // --- MAIN VALIDATION LOGIC ---
    // Returns an object containing all errors found
    const getFormErrors = () => {
        let newErrors = {};
        
        // Required Fields
        const required = ['firstName', 'lastName', 'birthdate', 'email', 'phone'];
        required.forEach(f => { if(!formData[f]) newErrors[f] = "Required"; });

        // Format Checks
        if(formData.phone && (formData.phone.length!==10 || formData.phone[0]!=='9')) { newErrors.phone="Invalid format"; }
        if(formData.email && !validateEmailFormat(formData.email)) { newErrors.email="Invalid domain"; }

        // Guardian Checks
        if (isMinor) {
            if (!formData.guardian.name) newErrors.guardianName = "Required";
            if (!formData.guardian.relationship) newErrors.guardianRel = "Required";
            if (!formData.guardian.contactNumber || formData.guardian.contactNumber.length !== 10) { 
                newErrors.guardianPhone = "Invalid phone"; 
            }
        }

        // Address Checks
        const checkAddr = (addr, prefix) => {
            ['region', 'province', 'city', 'barangay', 'street', 'houseNumber'].forEach(f => {
                if(!addr[f]) newErrors[`${prefix}_${f}`] = "Required";
            });
        };
        checkAddr(formData.currentAddress, 'current');
        if(!isSameAddress) checkAddr(formData.permanentAddress, 'permanent');

        return newErrors;
    };

    // --- SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Get Client-Side Errors
        const currentErrors = getFormErrors();

        // 2. Check Duplicate Email (Only if email has valid format)
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

        // 3. Set Errors State
        setErrors(currentErrors);

        // 4. If Errors Exist -> Stop & Scroll
        if (Object.keys(currentErrors).length > 0) {
            const firstKey = Object.keys(currentErrors)[0];
            let el = document.getElementsByName(firstKey)[0];
            // Mapping for special fields
            if (firstKey === 'guardianName') el = document.getElementsByName('name')[0];
            if (firstKey === 'guardianRel') el = document.getElementsByName('relationship')[0];
            if (firstKey === 'guardianPhone') el = document.getElementsByName('contactNumber')[0];
            
            if(el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
            return;
        }

        // 5. Proceed to Save (No Errors)
        const finalData = {
            name: { first: formData.firstName, middle: formData.middleName, last: formData.lastName },
            email: formData.email,
            contactNumber: `+63${formData.phone}`,
            birthdate: formData.birthdate,
            role: 'patient',
            profileImage: profileImage,
            medicalHistory: formData.medicalHistory,
            currentAddress: formData.currentAddress,
            permanentAddress: isSameAddress ? formData.currentAddress : formData.permanentAddress,
            guardian: isMinor ? {
                name: formData.guardian.name,
                relationship: formData.guardian.relationship,
                contactNumber: `+63${formData.guardian.contactNumber}`
            } : null
        };

        try {
            const response = await fetch('http://localhost:5000/api/add-patient', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            });
            const data = await response.json();
            if (response.ok) setShowSuccessModal(true);
            else {
                // Fallback catch (should be caught by pre-check mostly)
                if (response.status === 409) setErrors(prev => ({ ...prev, [data.field]: data.message }));
                else alert(data.message || "Failed to add patient");
            }
        } catch (error) { console.error(error); alert("Cannot connect to server."); }
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
                    <div className={styles.formGroup}><label>REGION <span style={{color:'red'}}>*</span></label><select name={`${prefix}_region`} className={`${styles.inputField} ${getErrorClass('region')}`} value={address.region} onChange={(e)=>handleAddressChange(type,'region',e.target.value)} disabled={isDisabled}><option value="" hidden>Select Region</option>{regions.map(r=><option key={r.code} value={r.code}>{r.name}</option>)}</select></div>
                    <div className={styles.formGroup}><label>PROVINCE <span style={{color:'red'}}>*</span></label><select name={`${prefix}_province`} className={`${styles.inputField} ${getErrorClass('province')}`} value={address.province} onChange={(e)=>handleAddressChange(type,'province',e.target.value)} disabled={isDisabled || !address.region}><option value="" hidden>Select Province</option>{availProvinces.map(p=><option key={p.code} value={p.code}>{p.name}</option>)}</select></div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}><label>CITY / MUNICIPALITY <span style={{color:'red'}}>*</span></label><select name={`${prefix}_city`} className={`${styles.inputField} ${getErrorClass('city')}`} value={address.city} onChange={(e)=>handleAddressChange(type,'city',e.target.value)} disabled={isDisabled || !address.province}><option value="" hidden>Select City</option>{availCities.map(c=><option key={c.code} value={c.code}>{c.name}</option>)}</select></div>
                    <div className={styles.formGroup}><label>BARANGAY <span style={{color:'red'}}>*</span></label><select name={`${prefix}_barangay`} className={`${styles.inputField} ${getErrorClass('barangay')}`} value={address.barangay} onChange={(e)=>handleAddressChange(type,'barangay',e.target.value)} disabled={isDisabled || !address.city}><option value="" hidden>Select Barangay</option>{availBarangays.map(b=><option key={b} value={b}>{b}</option>)}</select></div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}><label>STREET <span style={{color:'red'}}>*</span></label><input name={`${prefix}_street`} className={`${styles.inputField} ${getErrorClass('street')}`} value={address.street} onChange={(e)=>handleAddressChange(type,'street',e.target.value)} disabled={isDisabled}/></div>
                    <div className={styles.formGroup}><label>HOUSE NO. <span style={{color:'red'}}>*</span></label><input name={`${prefix}_houseNumber`} className={`${styles.inputField} ${getErrorClass('houseNumber')}`} value={address.houseNumber} onChange={(e)=>handleAddressChange(type,'houseNumber',e.target.value)} disabled={isDisabled}/></div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <div className={styles.header}>
                    <h2>Add New <span className={styles.highlight}>Patient</span></h2>
                    <p>Enter patient details. Guardian information is required for minors.</p>
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
                        <div className={styles.formGroup}><label>FIRST NAME <span style={{color:'red'}}>*</span></label><input className={`${styles.inputField} ${errors.firstName?styles.errorBorder:''}`} name="firstName" value={formData.firstName} onChange={handlePersonalChange} onBlur={handleBlur} maxLength={50}/>{errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}</div>
                        <div className={styles.formGroup}><label>MIDDLE NAME</label><input className={styles.inputField} name="middleName" value={formData.middleName} onChange={handlePersonalChange} maxLength={20}/></div>
                        <div className={styles.formGroup}><label>LAST NAME <span style={{color:'red'}}>*</span></label><input className={`${styles.inputField} ${errors.lastName?styles.errorBorder:''}`} name="lastName" value={formData.lastName} onChange={handlePersonalChange} onBlur={handleBlur} maxLength={20}/>{errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}</div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>BIRTHDATE <span style={{color:'red'}}>*</span></label>
                            <input type="date" className={`${styles.inputField} ${errors.birthdate?styles.errorBorder:''}`} name="birthdate" value={formData.birthdate} onChange={handlePersonalChange} onBlur={handleBlur} max={getTodayDate()}/>
                            {errors.birthdate && <span className={styles.errorText}>{errors.birthdate}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <label>PHONE NUMBER <span style={{color:'red'}}>*</span></label>
                            <div className={`${styles.phoneInputGroup} ${errors.phone?styles.errorBorder:''}`}>
                                <span className={styles.phonePrefix}>+63</span>
                                <input className={styles.phoneField} name="phone" value={formData.phone} onChange={handlePhoneChange} onBlur={handleBlur} maxLength={10} placeholder="9xxxxxxxxx"/>
                            </div>
                            {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>EMAIL ADDRESS <span style={{color:'red'}}>*</span></label>
                            <input type="email" className={`${styles.inputField} ${errors.email?styles.errorBorder:''}`} name="email" value={formData.email} onChange={handlePersonalChange} onBlur={handleBlur}/>
                            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                        </div>
                    </div>

                    {isMinor && (
                        <div className={styles.guardianSection} style={{marginTop: '20px', padding: '20px', border: '1px solid #ffe082', borderRadius: '12px', backgroundColor: '#fff8e1'}}>
                            <h3 className={styles.sectionTitle} style={{color: '#f57f17'}}>GUARDIAN INFORMATION (Required for Minors)</h3>
                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>GUARDIAN NAME (Max 50) <span style={{color:'red'}}>*</span></label>
                                    <input 
                                        className={`${styles.inputField} ${errors.guardianName?styles.errorBorder:''}`} 
                                        name="name" 
                                        value={formData.guardian.name} 
                                        onChange={handleGuardianChange} 
                                        maxLength={50}
                                    />
                                    {errors.guardianName && <span className={styles.errorText}>{errors.guardianName}</span>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>RELATIONSHIP <span style={{color:'red'}}>*</span></label>
                                    <select 
                                        className={`${styles.inputField} ${errors.guardianRel?styles.errorBorder:''}`} 
                                        name="relationship" 
                                        value={formData.guardian.relationship} 
                                        onChange={handleGuardianChange}
                                    >
                                        <option value="" hidden>Select Relationship</option>
                                        {["Parent", "Sibling", "Spouse", "Relative", "Guardian", "Other"].map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                    {errors.guardianRel && <span className={styles.errorText}>{errors.guardianRel}</span>}
                                </div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>GUARDIAN PHONE <span style={{color:'red'}}>*</span></label>
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

                    <div className={styles.medicalSection}>
                        <h3 className={styles.mainSectionTitle}>Medical History</h3>
                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>ALLERGIES (Food, Medication, etc.)</label>
                                <input className={styles.inputField} name="allergies" value={formData.medicalHistory.allergies} onChange={handleMedicalChange} placeholder="e.g. Peanuts, Penicillin (Leave blank if none)" />
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

                    <hr className={styles.divider} />
                    {renderAddressFields('currentAddress', 'Current Address')}
                    <div className={styles.permanentHeader}><h3 className={styles.sectionTitle}>Permanent Address</h3><div className={styles.checkboxContainer}><input type="checkbox" id="sameAddress" checked={isSameAddress} onChange={handleSameAddressToggle} /><label htmlFor="sameAddress">Same as Current Address</label></div></div>
                    {isSameAddress ? <div className={styles.disabledOverlay}>{renderAddressFields('permanentAddress', '', true)}</div> : renderAddressFields('permanentAddress', '')}

                    <div className={styles.buttonGroup}>
                        <button type="button" className={styles.cancelBtn} onClick={() => navigate('/owner/manage-patients')}>CANCEL</button>
                        <button type="submit" className={styles.submitBtn}>ADD PATIENT</button>
                    </div>
                </form>
            </div>
            {showSuccessModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <img src={successIcon} alt="Success" className={styles.modalIcon} />
                        <h3 className={styles.modalTitle}>Patient Added Successfully!</h3>
                        <p className={styles.modalMessage}>Account created. Verify email to activate.</p>
                        <button className={styles.closeLink} onClick={() => navigate('/owner/manage-patients')}>Back to List</button>
                    </div>
                </div>
            )}
        </div>
    );
}