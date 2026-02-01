import React, { useState, useRef, useEffect } from 'react';
import styles from '../../styles/edit-user/EditDentistPage.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { regions, provinces, cities, barangays } from '../../utils/addressData';

// Icons
import successIcon from '../../assets/alert-icons/success.svg';
import warningIcon from '../../assets/alert-icons/warning.svg';

export default function EditDentistPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const fileInputRef = useRef(null);
    
    // --- STATES ---
    const [isLoading, setIsLoading] = useState(true);
    const [isSameAddress, setIsSameAddress] = useState(false);
    
    // Image States
    const [profileImage, setProfileImage] = useState(null);
    const [initialImage, setInitialImage] = useState(null); // Pang-compare sa image change

    // Modals
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("Dentist details updated successfully.");
    
    const [errors, setErrors] = useState({});

    // Options
    const specializationOptions = [
        "General Dentist", "Orthodontist", "Pediatric Dentist (Pedodontist)", 
        "Periodontist", "Endodontist", "Oral & Maxillofacial Surgeon", 
        "Prosthodontist", "Cosmetic Dentist"
    ];

    const initialAddressState = { country: 'Philippines', region: '', province: '', city: '', barangay: '', houseNumber: '', street: '' };

    // Form Data States
    const [formData, setFormData] = useState({
        firstName: '', middleName: '', lastName: '', birthdate: '',
        licenseNumber: '', specialization: '', email: '', phone: '',
        currentAddress: { ...initialAddressState },
        permanentAddress: { ...initialAddressState }
    });

    // Reference for comparison (Original Data)
    const [initialData, setInitialData] = useState(null);

    // --- HELPERS ---
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const toTitleCase = (str) => str.toLowerCase().replace(/(?:^|\s|-|\.)\S/g, (char) => char.toUpperCase());
    const getAge = (dateString) => {
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) age--;
        return age;
    };

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchDentist = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/user/${id}`);
                const data = await response.json();
                
                if (response.ok) {
                    const currentAddr = data.currentAddress || {};
                    const permAddr = data.permanentAddress || {};

                    // Check if addresses are effectively same
                    const cleanAddr = (addr) => { const { _id, ...rest } = addr; return JSON.stringify(rest); };
                    const isSame = cleanAddr(currentAddr) === cleanAddr(permAddr);
                    setIsSameAddress(isSame);

                    const processedData = {
                        firstName: data.name?.first || '',
                        middleName: data.name?.middle || '',
                        lastName: data.name?.last || '',
                        birthdate: data.birthdate ? new Date(data.birthdate).toISOString().split('T')[0] : '',
                        licenseNumber: data.licenseNumber || '',
                        specialization: data.specialization || '',
                        email: data.email || '',
                        phone: data.contactNumber ? data.contactNumber.replace('+63', '') : '',
                        currentAddress: { ...initialAddressState, ...currentAddr },
                        permanentAddress: { ...initialAddressState, ...permAddr }
                    };

                    setFormData(processedData);
                    setInitialData(processedData); // Save original state
                    
                    setProfileImage(data.profileImage);
                    setInitialImage(data.profileImage); // Save original image
                }
            } catch (error) { console.error("Error:", error); } 
            finally { setIsLoading(false); }
        };
        fetchDentist();
    }, [id]);

    // --- CHANGE DETECTION LOGIC ---
    // Check if form or image is different from initial state
    const hasChanges = () => {
        if (!initialData) return false;
        const formChanged = JSON.stringify(formData) !== JSON.stringify(initialData);
        const imageChanged = profileImage !== initialImage;
        return formChanged || imageChanged;
    };

    // --- HANDLERS ---
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
        }
    };

    // --- SUBMIT LOGIC ---
    const validateForm = () => {
        let newErrors = {};
        let isValid = true;
        
        const required = ['firstName', 'lastName', 'birthdate', 'licenseNumber', 'specialization', 'email'];
        required.forEach(f => { if(!formData[f]) { newErrors[f] = "Required"; isValid = false; }});

        if (!formData.phone) { newErrors.phone = "Required"; isValid = false; }
        else if (formData.phone.length !== 10 || formData.phone[0] !== '9') { newErrors.phone = "Invalid format"; isValid = false; }
        
        if (formData.email && !validateEmail(formData.email)) { newErrors.email = "Invalid email"; isValid = false; }
        if (formData.birthdate && getAge(formData.birthdate) < 21) { newErrors.birthdate = "Min age 21"; isValid = false; }

        const validateAddr = (addr, prefix) => {
            ['region', 'province', 'city', 'barangay', 'street', 'houseNumber'].forEach(f => {
                if (!addr[f]) { newErrors[`${prefix}_${f}`] = "Required"; isValid = false; }
            });
        };
        validateAddr(formData.currentAddress, 'current');
        if (!isSameAddress) validateAddr(formData.permanentAddress, 'permanent');

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!hasChanges()) return; // Prevent if no changes
        if (!validateForm()) return;
        setShowConfirmModal(true); 
    };

    const handleConfirmSave = async () => {
        setShowConfirmModal(false);

        const finalData = { 
            ...formData, 
            name: { first: formData.firstName, middle: formData.middleName, last: formData.lastName },
            contactNumber: `+63${formData.phone}`, 
            profileImage,
            permanentAddress: isSameAddress ? formData.currentAddress : formData.permanentAddress
        };

        try {
            const response = await fetch(`http://localhost:5000/api/user/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            });
            
            const data = await response.json();

            if (response.ok) {
                if (data.message && data.message.includes("Re-activation")) {
                    setModalMessage("Email updated! A new activation link has been sent.");
                } else {
                    setModalMessage("Dentist details updated successfully.");
                }
                setShowSuccessModal(true);
            }
            else {
                alert(data.message || "Failed to update.");
            }
        } catch (error) { console.error("Error:", error); }
    };

    // --- RENDER HELPERS ---
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
                    </div>
                    <div className={styles.formGroup}>
                        <label>PROVINCE <span style={{color: 'red'}}>*</span></label>
                        <select name={`${prefix}_province`} className={`${styles.inputField} ${getErrorClass('province')}`} value={address.province} onChange={(e) => handleAddressChange(type, 'province', e.target.value)} disabled={isDisabled || !address.region}>
                            <option value="" disabled hidden>Select Province</option>
                            {availableProvinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>CITY / MUNICIPALITY <span style={{color: 'red'}}>*</span></label>
                        <select name={`${prefix}_city`} className={`${styles.inputField} ${getErrorClass('city')}`} value={address.city} onChange={(e) => handleAddressChange(type, 'city', e.target.value)} disabled={isDisabled || !address.province}>
                            <option value="" disabled hidden>Select City</option>
                            {availableCities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>BARANGAY <span style={{color: 'red'}}>*</span></label>
                        <select name={`${prefix}_barangay`} className={`${styles.inputField} ${getErrorClass('barangay')}`} value={address.barangay} onChange={(e) => handleAddressChange(type, 'barangay', e.target.value)} disabled={isDisabled || !address.city}>
                            <option value="" disabled hidden>Select Barangay</option>
                            {availableBarangays.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                </div>
                 <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>STREET <span style={{color: 'red'}}>*</span></label>
                        <input name={`${prefix}_street`} className={`${styles.inputField} ${getErrorClass('street')}`} value={address.street} onChange={(e) => handleAddressChange(type, 'street', e.target.value)} disabled={isDisabled} maxLength={100}/>
                    </div>
                    <div className={styles.formGroup}>
                        <label>HOUSE NO. <span style={{color: 'red'}}>*</span></label>
                        <input name={`${prefix}_houseNumber`} className={`${styles.inputField} ${getErrorClass('houseNumber')}`} value={address.houseNumber} onChange={(e) => handleAddressChange(type, 'houseNumber', e.target.value)} disabled={isDisabled} maxLength={20}/>
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading) return <div className={styles.container}><p>Loading...</p></div>;

    // Check changes for button state
    const isFormDirty = hasChanges();

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <div className={styles.header}>
                    <h2>Edit <span className={styles.highlight}>Dentist</span></h2>
                    <p>Update dentist account details.</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    {/* IMAGE */}
                    <div className={styles.uploadSection}>
                        <div className={styles.imageWrapper} onClick={triggerFileInput}>
                            {profileImage ? <img src={profileImage} alt="Profile" className={styles.previewImage} /> : <div className={styles.uploadPlaceholder}><span>No Image</span></div>}
                        </div>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
                        <p className={styles.uploadHint}>Click to change photo.</p>
                    </div>

                    {/* PERSONAL INFO */}
                     <h3 className={styles.mainSectionTitle}>Personal Information</h3>
                     <div className={styles.row}>
                        <div className={styles.formGroup}><label>FIRST NAME</label><input className={`${styles.inputField} ${errors.firstName ? styles.errorBorder : ''}`} name="firstName" value={formData.firstName} onChange={handlePersonalChange}/></div>
                        <div className={styles.formGroup}><label>MIDDLE NAME</label><input className={styles.inputField} name="middleName" value={formData.middleName} onChange={handlePersonalChange}/></div>
                        <div className={styles.formGroup}><label>LAST NAME</label><input className={`${styles.inputField} ${errors.lastName ? styles.errorBorder : ''}`} name="lastName" value={formData.lastName} onChange={handlePersonalChange}/></div>
                    </div>
                    <div className={styles.row}>
                         <div className={styles.formGroup}><label>BIRTHDATE</label><input type="date" className={`${styles.inputField} ${errors.birthdate ? styles.errorBorder : ''}`} name="birthdate" value={formData.birthdate} onChange={handlePersonalChange}/></div>
                         <div className={styles.formGroup}><label>LICENSE NO.</label><input className={`${styles.inputField} ${errors.licenseNumber ? styles.errorBorder : ''}`} name="licenseNumber" value={formData.licenseNumber} onChange={handlePersonalChange}/></div>
                         <div className={styles.formGroup}><label>SPECIALIZATION</label>
                            <select name="specialization" className={`${styles.inputField} ${errors.specialization ? styles.errorBorder : ''}`} value={formData.specialization} onChange={handlePersonalChange}>
                                {specializationOptions.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                         </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.formGroup}><label>EMAIL (Changing this resets account)</label><input type="email" className={`${styles.inputField} ${errors.email ? styles.errorBorder : ''}`} name="email" value={formData.email} onChange={handlePersonalChange}/></div>
                        <div className={styles.formGroup}><label>PHONE</label><div className={styles.phoneInputGroup}><span className={styles.phonePrefix}>+63</span><input className={`${styles.phoneField} ${errors.phone ? styles.errorBorder : ''}`} name="phone" value={formData.phone} onChange={handlePhoneChange}/></div></div>
                    </div>

                    <hr className={styles.divider} />
                    
                    {/* ADDRESSES */}
                    {renderAddressFields('currentAddress', 'Current Address')}
                    <div className={styles.permanentHeader}>
                        <h3 className={styles.sectionTitle}>Permanent Address</h3>
                        <div className={styles.checkboxContainer}>
                            <input type="checkbox" id="sameAddress" checked={isSameAddress} onChange={handleSameAddressToggle} />
                            <label htmlFor="sameAddress">Same as Current</label>
                        </div>
                    </div>
                    {isSameAddress ? <div className={styles.disabledOverlay}>{renderAddressFields('permanentAddress', '', true)}</div> : renderAddressFields('permanentAddress', '')}

                    {/* BUTTONS */}
                    <div className={styles.buttonGroup}>
                        <button type="button" className={styles.cancelBtn} onClick={() => navigate('/owner/manage-dentists')}>CANCEL</button>
                        
                        {/* DISABLED LOGIC HERE */}
                        <button 
                            type="submit" 
                            className={isFormDirty ? styles.submitBtn : styles.disabledBtn}
                            disabled={!isFormDirty}
                        >
                            SAVE CHANGES
                        </button>
                    </div>
                </form>
            </div>

            {/* CONFIRM MODAL */}
            {showConfirmModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <h3 className={styles.modalTitle}>Save Changes?</h3>
                        <p className={styles.modalMessage}>Are you sure you want to save these changes?</p>
                        <div className={styles.modalActions}>
                            <button className={styles.modalCancelBtn} onClick={() => setShowConfirmModal(false)}>Cancel</button>
                            <button className={styles.modalSubmitBtn} style={{margin: 0}} onClick={handleConfirmSave}>Yes, Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* SUCCESS MODAL */}
            {showSuccessModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <img src={successIcon} alt="Success" className={styles.modalIcon} />
                        <h3 className={styles.modalTitle}>Success!</h3>
                        <p className={styles.modalMessage}>{modalMessage}</p>
                        <button className={styles.closeLink} onClick={() => navigate('/owner/manage-dentists')}>Back to List</button>
                    </div>
                </div>
            )}
        </div>
    );
}