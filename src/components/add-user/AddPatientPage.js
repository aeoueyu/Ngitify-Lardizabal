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

    const initialAddressState = { country: 'Philippines', region: '', province: '', city: '', barangay: '', houseNumber: '', street: '' };

    const [formData, setFormData] = useState({
        firstName: '', middleName: '', lastName: '', birthdate: '', email: '', phone: '',
        guardian: { name: '', relationship: '', contactNumber: '' },
        currentAddress: { ...initialAddressState },
        permanentAddress: { ...initialAddressState }
    });

    // Helpers
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const toTitleCase = (str) => str.toLowerCase().replace(/(?:^|\s|-|\.)\S/g, (char) => char.toUpperCase());

    // Handlers
    const handleImageChange = (e) => { const file=e.target.files[0]; if(file){ const r=new FileReader(); r.onloadend=()=>setProfileImage(r.result); r.readAsDataURL(file); }};
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

    const handleBirthdateChange = (e) => {
        const val = e.target.value;
        setFormData({ ...formData, birthdate: val });
        // Minor check (<18)
        const today = new Date();
        const birthDate = new Date(val);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        setIsMinor(age < 18);
    };

    const handleGuardianChange = (e) => {
        const { name, value } = e.target;
        const field = name.split('_')[1]; 
        setFormData(prev => ({ ...prev, guardian: { ...prev.guardian, [field]: value } }));
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length > 10) return;
        if (errors.phone) setErrors(prev => ({...prev, phone: ''}));
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

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;
        const required = ['firstName', 'lastName', 'birthdate', 'email'];
        required.forEach(f => { if(!formData[f]) { newErrors[f] = "Required"; isValid = false; }});

        if (isMinor) {
            if (!formData.guardian.name) { newErrors.guardian_name = "Required"; isValid = false; }
            if (!formData.guardian.relationship) { newErrors.guardian_relationship = "Required"; isValid = false; }
            if (!formData.guardian.contactNumber) { newErrors.guardian_contactNumber = "Required"; isValid = false; }
        }

        if(!formData.phone) { newErrors.phone="Required"; isValid=false; }
        else if(formData.phone.length!==10 || formData.phone[0]!=='9') { newErrors.phone="Invalid format"; isValid=false; }
        if(formData.email && !validateEmail(formData.email)) { newErrors.email="Invalid email"; isValid=false; }

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const finalData = {
            ...formData,
            name: { first: formData.firstName, middle: formData.middleName, last: formData.lastName },
            contactNumber: `+63${formData.phone}`,
            profileImage 
        };

        try {
            const response = await fetch('http://localhost:5000/api/add-patient', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            });

            const data = await response.json();

            if (response.ok) {
                setShowSuccessModal(true);
            } else {
                if (response.status === 409) {
                    setErrors(prev => ({ ...prev, [data.field]: data.message }));
                    const el = document.getElementsByName(data.field)[0];
                    if(el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
                } else {
                    alert(data.message || "Failed to add patient");
                }
            }
        } catch (error) { console.error("Error:", error); alert("Cannot connect to server."); }
    };

    // Render Helpers (Standard)
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
                            {availableProvinces.map(p=><option key={p.code} value={p.code}>{p.name}</option>)}
                        </select>
                        {getError('province') && <span className={styles.errorText}>{getError('province')}</span>}
                    </div>
                </div>
                {/* City, Brgy, Street, House (Copy from AddDentist/Secretary logic to save space here) */}
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>CITY / MUNICIPALITY <span style={{color:'red'}}>*</span></label>
                        <select name={`${prefix}_city`} className={`${styles.inputField} ${getErrorClass('city')}`} value={address.city} onChange={(e)=>handleAddressChange(type,'city',e.target.value)} disabled={isDisabled || !address.province}>
                            <option value="" hidden>Select City</option>
                            {availableCities.map(c=><option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                        {getError('city') && <span className={styles.errorText}>{getError('city')}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>BARANGAY <span style={{color:'red'}}>*</span></label>
                        <select name={`${prefix}_barangay`} className={`${styles.inputField} ${getErrorClass('barangay')}`} value={address.barangay} onChange={(e)=>handleAddressChange(type,'barangay',e.target.value)} disabled={isDisabled || !address.city}>
                            <option value="" hidden>Select Barangay</option>
                            {availableBarangays.map(b=><option key={b} value={b}>{b}</option>)}
                        </select>
                        {getError('barangay') && <span className={styles.errorText}>{getError('barangay')}</span>}
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>STREET <span style={{color:'red'}}>*</span></label>
                        <input name={`${prefix}_street`} className={`${styles.inputField} ${getErrorClass('street')}`} value={address.street} onChange={(e)=>handleAddressChange(type,'street',e.target.value)} disabled={isDisabled} maxLength={100}/>
                        {getError('street') && <span className={styles.errorText}>{getError('street')}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>HOUSE NO. <span style={{color:'red'}}>*</span></label>
                        <input name={`${prefix}_houseNumber`} className={`${styles.inputField} ${getErrorClass('houseNumber')}`} value={address.houseNumber} onChange={(e)=>handleAddressChange(type,'houseNumber',e.target.value)} disabled={isDisabled} maxLength={20}/>
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
                    <h2>Add New <span className={styles.highlight}>Patient</span></h2>
                    <p>Enter the patient's personal details below.</p>
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
                        <div className={styles.formGroup}><label>FIRST NAME <span style={{color:'red'}}>*</span></label><input className={`${styles.inputField} ${errors.firstName?styles.errorBorder:''}`} name="firstName" value={formData.firstName} onChange={handlePersonalChange} maxLength={50}/>{errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}</div>
                        <div className={styles.formGroup}><label>MIDDLE NAME</label><input className={styles.inputField} name="middleName" value={formData.middleName} onChange={handlePersonalChange} maxLength={50}/></div>
                        <div className={styles.formGroup}><label>LAST NAME <span style={{color:'red'}}>*</span></label><input className={`${styles.inputField} ${errors.lastName?styles.errorBorder:''}`} name="lastName" value={formData.lastName} onChange={handlePersonalChange} maxLength={50}/>{errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}</div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>BIRTHDATE <span style={{color:'red'}}>*</span></label>
                            <input type="date" className={`${styles.inputField} ${errors.birthdate?styles.errorBorder:''}`} name="birthdate" value={formData.birthdate} onChange={handleBirthdateChange}/>
                            {errors.birthdate && <span className={styles.errorText}>{errors.birthdate}</span>}
                            {isMinor && <span style={{color:'#f57f17',fontSize:'12px',fontWeight:'bold',marginTop:'5px'}}>Patient is under 18. Guardian details required.</span>}
                        </div>
                        <div className={styles.formGroup}><label>EMAIL ADDRESS <span style={{color:'red'}}>*</span></label><input type="email" className={`${styles.inputField} ${errors.email ? styles.errorBorder : ''}`} name="email" value={formData.email} onChange={handlePersonalChange} maxLength={100}/>{errors.email && <span className={styles.errorText}>{errors.email}</span>}</div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.formGroup}><label>PHONE NUMBER <span style={{color:'red'}}>*</span></label><div className={styles.phoneInputGroup}><span className={styles.phonePrefix}>+63</span><input className={`${styles.phoneField} ${errors.phone?styles.errorBorder:''}`} name="phone" value={formData.phone} onChange={handlePhoneChange} maxLength={10} placeholder="9xxxxxxxxx"/></div>{errors.phone && <span className={styles.errorText}>{errors.phone}</span>}</div>
                    </div>

                    {isMinor && (
                        <div style={{backgroundColor:'#fff8e1', padding:'15px', borderRadius:'8px', marginBottom:'20px', border:'1px solid #ffe082'}}>
                            <h4 style={{color:'#f57f17', margin:'0 0 15px 0'}}>Guardian Information</h4>
                            <div className={styles.row}>
                                <div className={styles.formGroup}><label>GUARDIAN NAME <span style={{color:'red'}}>*</span></label><input className={`${styles.inputField} ${errors.guardian_name?styles.errorBorder:''}`} name="guardian_name" value={formData.guardian.name} onChange={handleGuardianChange} maxLength={50}/>{errors.guardian_name && <span className={styles.errorText}>{errors.guardian_name}</span>}</div>
                                <div className={styles.formGroup}><label>RELATIONSHIP <span style={{color:'red'}}>*</span></label><input className={`${styles.inputField} ${errors.guardian_relationship?styles.errorBorder:''}`} name="guardian_relationship" value={formData.guardian.relationship} onChange={handleGuardianChange} maxLength={30}/>{errors.guardian_relationship && <span className={styles.errorText}>{errors.guardian_relationship}</span>}</div>
                                <div className={styles.formGroup}><label>CONTACT NO. <span style={{color:'red'}}>*</span></label><input className={`${styles.inputField} ${errors.guardian_contactNumber?styles.errorBorder:''}`} name="guardian_contactNumber" value={formData.guardian.contactNumber} onChange={handleGuardianChange} maxLength={15}/>{errors.guardian_contactNumber && <span className={styles.errorText}>{errors.guardian_contactNumber}</span>}</div>
                            </div>
                        </div>
                    )}

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
                        <p className={styles.modalMessage}>An email with the temporary password has been sent.</p>
                        <button className={styles.closeLink} onClick={() => navigate('/owner/manage-patients')}>Back to List</button>
                    </div>
                </div>
            )}
        </div>
    );
}