import React, { useState, useEffect } from 'react';
import styles from '../../styles/add-user/AddDentistPage.module.css';
import { useNavigate } from 'react-router-dom';
import { regions, provinces, cities, barangays } from '../../utils/addressData'; // Import data

export default function AddDentistPage() {
    const navigate = useNavigate();
    
    // --- STATE MANAGEMENT ---
    const [isSameAddress, setIsSameAddress] = useState(false);

    // Initial State para sa Address
    const initialAddressState = {
        country: 'Philippines',
        region: '',
        province: '',
        city: '',
        barangay: '',
        houseNumber: '',
        street: ''
    };

    const [formData, setFormData] = useState({
        // Personal
        firstName: '', middleName: '', lastName: '',
        birthdate: '',
        
        // Contact
        email: '',
        phone: '', 
        licenseNumber: '',
        specialization: '',

        // Addresses
        currentAddress: { ...initialAddressState },
        permanentAddress: { ...initialAddressState }
    });

    // --- LOGIC: BIRTHDAY (21 Years Old Validation) ---
    const getMaxDate = () => {
        const today = new Date();
        today.setFullYear(today.getFullYear() - 21);
        return today.toISOString().split('T')[0]; 
    };

    // --- LOGIC: HANDLE INPUT CHANGE ---
    const handlePersonalChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Phone (Numbers only, max 10 chars)
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); 
        if (value.length <= 10) { 
            setFormData({ ...formData, phone: value });
        }
    };

    // --- LOGIC: ADDRESS HANDLING ---
    const handleAddressChange = (type, field, value) => {
        setFormData(prev => {
            const updatedAddress = { ...prev[type], [field]: value };
            
            // Cascading Reset Logic
            if (field === 'region') {
                updatedAddress.province = '';
                updatedAddress.city = '';
                updatedAddress.barangay = '';
            }
            else if (field === 'province') {
                updatedAddress.city = '';
                updatedAddress.barangay = '';
            }
            else if (field === 'city') {
                updatedAddress.barangay = '';
            }

            if (type === 'currentAddress' && isSameAddress) {
                return {
                    ...prev,
                    currentAddress: updatedAddress,
                    permanentAddress: updatedAddress
                };
            }

            return { ...prev, [type]: updatedAddress };
        });
    };

    const handleSameAddressToggle = (e) => {
        const isChecked = e.target.checked;
        setIsSameAddress(isChecked);

        if (isChecked) {
            setFormData(prev => ({
                ...prev,
                permanentAddress: { ...prev.currentAddress }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                permanentAddress: { ...initialAddressState }
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const finalData = {
            ...formData,
            phone: `+63${formData.phone}`
        };

        console.log("Submitting Data:", finalData);
        alert("Dentist Added Successfully!");
        navigate('/owner/manage-dentists');
    };

    // --- HELPER COMPONENT FOR ADDRESS FIELDS ---
    const renderAddressFields = (type, title, isDisabled = false) => {
        const address = formData[type];
        
        const availableProvinces = address.region ? provinces[address.region] || [] : [];
        const availableCities = address.province ? cities[address.province] || [] : [];
        const availableBarangays = address.city ? barangays[address.city] || [] : [];

        return (
            <div className={styles.addressSection}>
                <h3 className={styles.sectionTitle}>{title}</h3>
                
                {/* Row 1: Country & Region */}
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>COUNTRY</label>
                        <select 
                            className={styles.inputField} 
                            value={address.country} 
                            disabled={true} 
                        >
                            <option value="Philippines">Philippines</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>REGION</label>
                        <select 
                            className={styles.inputField}
                            value={address.region}
                            onChange={(e) => handleAddressChange(type, 'region', e.target.value)}
                            disabled={isDisabled}
                            required
                        >
                            {/* UPDATED: Added 'hidden' attribute */}
                            <option value="" disabled hidden>Select Region</option>
                            {regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* Row 2: Province & City */}
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>PROVINCE</label>
                        <select 
                            className={styles.inputField}
                            value={address.province}
                            onChange={(e) => handleAddressChange(type, 'province', e.target.value)}
                            disabled={isDisabled || !address.region} 
                            required
                        >
                            {/* UPDATED: Added 'hidden' attribute */}
                            <option value="" disabled hidden>Select Province</option>
                            {availableProvinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>CITY / MUNICIPALITY</label>
                        <select 
                            className={styles.inputField}
                            value={address.city}
                            onChange={(e) => handleAddressChange(type, 'city', e.target.value)}
                            disabled={isDisabled || !address.province}
                            required
                        >
                            {/* UPDATED: Added 'hidden' attribute */}
                            <option value="" disabled hidden>Select City</option>
                            {availableCities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* Row 3: Barangay */}
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>BARANGAY</label>
                        <select 
                            className={styles.inputField}
                            value={address.barangay}
                            onChange={(e) => handleAddressChange(type, 'barangay', e.target.value)}
                            disabled={isDisabled || !address.city}
                            required
                        >
                            {/* UPDATED: Added 'hidden' attribute */}
                            <option value="" disabled hidden>Select Barangay</option>
                            {availableBarangays.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                </div>

                {/* Row 4: Street & House No */}
                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>STREET NAME</label>
                        <input 
                            type="text"
                            className={styles.inputField}
                            value={address.street}
                            onChange={(e) => handleAddressChange(type, 'street', e.target.value)}
                            placeholder="Street Name"
                            disabled={isDisabled}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>HOUSE NUMBER</label>
                        <input 
                            type="text"
                            className={styles.inputField}
                            value={address.houseNumber}
                            onChange={(e) => handleAddressChange(type, 'houseNumber', e.target.value)}
                            placeholder="House / Unit No."
                            disabled={isDisabled}
                            required
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <div className={styles.header}>
                    <h2>Add New <span className={styles.highlight}>Dentist</span></h2>
                    <p>Enter the dentist's professional and personal details below.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* --- PERSONAL DETAILS --- */}
                    <h3 className={styles.mainSectionTitle}>Personal Information</h3>
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>FIRST NAME</label>
                            <input type="text" name="firstName" className={styles.inputField} placeholder="e.g. Juan" onChange={handlePersonalChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>MIDDLE NAME</label>
                            <input type="text" name="middleName" className={styles.inputField} placeholder="Optional" onChange={handlePersonalChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>LAST NAME</label>
                            <input type="text" name="lastName" className={styles.inputField} placeholder="e.g. Santos" onChange={handlePersonalChange} required />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>BIRTH DATE (Must be 21+)</label>
                            <input 
                                type="date" 
                                name="birthdate" 
                                className={styles.inputField} 
                                max={getMaxDate()} 
                                onChange={handlePersonalChange}
                                required 
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>SPECIALIZATION</label>
                            <select 
                                name="specialization" 
                                className={styles.inputField} 
                                onChange={handlePersonalChange} 
                                required
                                defaultValue=""
                            >
                                {/* UPDATED: Added 'hidden' attribute */}
                                <option value="" disabled hidden>Select Specialization</option>
                                <option value="General Dentistry">General Dentistry</option>
                                <option value="Orthodontics">Orthodontics</option>
                                <option value="Pediatric Dentistry">Pediatric Dentistry</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>PRC LICENSE NO.</label>
                            <input type="text" name="licenseNumber" className={styles.inputField} onChange={handlePersonalChange} required />
                        </div>
                    </div>

                    {/* --- CONTACT DETAILS --- */}
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>EMAIL ADDRESS</label>
                            <input type="email" name="email" className={styles.inputField} placeholder="e.g. doc@gmail.com" onChange={handlePersonalChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>PHONE NUMBER</label>
                            <div className={styles.phoneInputGroup}>
                                <span className={styles.phonePrefix}>+63</span>
                                <input 
                                    type="text" 
                                    name="phone" 
                                    className={styles.phoneField} 
                                    placeholder="9123456789" 
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                    required 
                                />
                            </div>
                        </div>
                    </div>

                    <hr className={styles.divider} />

                    {/* --- CURRENT ADDRESS --- */}
                    {renderAddressFields('currentAddress', 'Current Address')}

                    {/* --- PERMANENT ADDRESS --- */}
                    <div className={styles.permanentHeader}>
                        <h3 className={styles.sectionTitle}>Permanent Address</h3>
                        <div className={styles.checkboxContainer}>
                            <input 
                                type="checkbox" 
                                id="sameAddress" 
                                checked={isSameAddress}
                                onChange={handleSameAddressToggle}
                            />
                            <label htmlFor="sameAddress">Same as Current Address</label>
                        </div>
                    </div>

                    {isSameAddress ? (
                        <div className={styles.disabledOverlay}>
                            {renderAddressFields('permanentAddress', '', true)} 
                        </div>
                    ) : (
                        renderAddressFields('permanentAddress', '')
                    )}

                    {/* Buttons */}
                    <div className={styles.buttonGroup}>
                        <button type="button" className={styles.cancelBtn} onClick={() => navigate('/owner/manage-dentists')}>
                            CANCEL
                        </button>
                        <button type="submit" className={styles.submitBtn}>
                            CREATE ACCOUNT
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}