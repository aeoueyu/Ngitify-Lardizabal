import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styles/settings/SettingsPage.module.css'; // Gagawa tayo nito sa baba
import { useNavigate } from 'react-router-dom';
import warningIcon from '../../assets/alert-icons/warning.svg';

export default function SettingsPage() {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId'); // Kunin mula sa login
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole')); 
    const [activeTab, setActiveTab] = useState('personal'); // 'personal' or 'security'
    
    // Data States
    const [userData, setUserData] = useState({});
    const [initialData, setInitialData] = useState({});
    const [profileImage, setProfileImage] = useState(null);
    const fileInputRef = useRef(null);

    // Password States
    const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });
    const [isTempPassword, setIsTempPassword] = useState(false); // Para sa warning banner

    // UI States
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState({ type: '', message: '' }); // 'confirm', 'success'

    // Fetch User Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/user/${userId}`);
                const data = await res.json();
                
                // Flatten data for easier handling (similar to Edit pages)
                const processed = {
                    firstName: data.name?.first || '',
                    lastName: data.name?.last || '',
                    email: data.email || '',
                    phone: data.contactNumber?.replace('+63', '') || '',
                    role: data.role
                };
                
                setUserData(processed);
                setInitialData(processed);
                setProfileImage(data.profileImage);
                setIsTempPassword(!data.isPasswordChanged); // Check if temp pass pa
            } catch (err) { console.error(err); } finally { setIsLoading(false); }
        };
        fetchData();
    }, [userId]);

    // --- HANDLERS (Personal) ---
    const handleInfoChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value });
    
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfileImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const hasChanges = () => {
        return JSON.stringify(userData) !== JSON.stringify(initialData) || profileImage !== initialData.profileImage; // Simplistic image check
    };

    const savePersonalInfo = async () => {
        setShowModal(null); // Close confirm modal
        // Add API Call here to update user info (re-use update logic)
        // ... (Implementation similar to EditDentistPage but purely for self-update)
        alert("Feature to save personal info is ready to be connected to API!"); 
    };

    // --- HANDLERS (Security) ---
    const handlePassChange = (e) => setPassData({ ...passData, [e.target.name]: e.target.value });

    // Password Rules Check
    const checkPasswordStrength = (pass) => {
        return {
            length: pass.length >= 8,
            upper: /[A-Z]/.test(pass),
            lower: /[a-z]/.test(pass),
            number: /\d/.test(pass),
            special: /[!@#$%^&*]/.test(pass)
        };
    };
    const passStrength = checkPasswordStrength(passData.new);
    const isPassValid = Object.values(passStrength).every(Boolean) && passData.new === passData.confirm;

    const savePassword = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, currentPassword: passData.current, newPassword: passData.new })
            });
            const data = await res.json();
            if (res.ok) {
                setShowModal({ type: 'success', message: 'Password updated successfully!' });
                setPassData({ current: '', new: '', confirm: '' });
                setIsTempPassword(false);
            } else {
                alert(data.message);
            }
        } catch (err) { alert("Server Error"); }
    };

    if (isLoading) return <div className={styles.container}>Loading...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>Settings</h1>

            <div className={styles.tabs}>
                <button className={`${styles.tabBtn} ${activeTab==='personal' && styles.active}`} onClick={()=>setActiveTab('personal')}>Personal Details</button>
                <button className={`${styles.tabBtn} ${activeTab==='security' && styles.active}`} onClick={()=>setActiveTab('security')}>Password & Security</button>
            </div>

            <div className={styles.contentCard}>
                {/* --- PERSONAL DETAILS TAB --- */}
                {activeTab === 'personal' && (
                    <div className={styles.tabContent}>
                        <div className={styles.profileSection}>
                            <div className={styles.imgWrapper} onClick={()=>fileInputRef.current.click()}>
                                {profileImage ? <img src={profileImage} className={styles.profileImg} /> : <div className={styles.placeholder}>Photo</div>}
                            </div>
                            <input type="file" ref={fileInputRef} style={{display:'none'}} onChange={handleImageUpload}/>
                            <p className={styles.roleLabel}>{userData.role}</p>
                        </div>

                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}><label>First Name</label><input className={styles.input} name="firstName" value={userData.firstName} onChange={handleInfoChange}/></div>
                            <div className={styles.formGroup}><label>Last Name</label><input className={styles.input} name="lastName" value={userData.lastName} onChange={handleInfoChange}/></div>
                            <div className={styles.formGroup}><label>Email</label><input className={styles.input} name="email" value={userData.email} disabled style={{opacity:0.7, cursor:'not-allowed'}}/></div>
                            <div className={styles.formGroup}><label>Phone</label><input className={styles.input} name="phone" value={userData.phone} onChange={handleInfoChange}/></div>
                        </div>

                        <button className={styles.saveBtn} disabled={!hasChanges()} onClick={()=>setShowModal({type:'confirm', message:'Save changes to profile?'})}>
                            Save Changes
                        </button>
                    </div>
                )}

                {/* --- SECURITY TAB --- */}
                {activeTab === 'security' && (
                    <div className={styles.tabContent}>
                        {isTempPassword && (
                            <div className={styles.warningBox}>
                                <img src={warningIcon} style={{width:'20px'}}/>
                                <span>You are using a temporary password. Please change it immediately for security.</span>
                            </div>
                        )}

                        <form onSubmit={savePassword}>
                            <div className={styles.formGroup}>
                                <label>Current Password</label>
                                <input type="password" className={styles.input} name="current" value={passData.current} onChange={handlePassChange} required/>
                            </div>
                            
                            <div className={styles.divider}></div>

                            <div className={styles.formGroup}>
                                <label>New Password</label>
                                <input type="password" className={styles.input} name="new" value={passData.new} onChange={handlePassChange} required/>
                            </div>

                            {/* Password Rules Checklist */}
                            <div className={styles.rulesList}>
                                <span className={passStrength.length ? styles.valid : styles.invalid}>• 8+ Characters</span>
                                <span className={passStrength.upper ? styles.valid : styles.invalid}>• Uppercase</span>
                                <span className={passStrength.lower ? styles.valid : styles.invalid}>• Lowercase</span>
                                <span className={passStrength.number ? styles.valid : styles.invalid}>• Number</span>
                                <span className={passStrength.special ? styles.valid : styles.invalid}>• Special Symbol</span>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Confirm New Password</label>
                                <input type="password" className={styles.input} name="confirm" value={passData.confirm} onChange={handlePassChange} required/>
                                {passData.confirm && passData.new !== passData.confirm && <span className={styles.errorText}>Passwords do not match</span>}
                            </div>

                            <button type="submit" className={styles.saveBtn} disabled={!isPassValid}>
                                Update Password
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <h3>{showModal.type === 'confirm' ? 'Confirm Save' : 'Success'}</h3>
                        <p>{showModal.message}</p>
                        <div className={styles.modalActions}>
                            {showModal.type === 'confirm' ? (
                                <>
                                    <button onClick={()=>setShowModal(null)} className={styles.cancelBtn}>Cancel</button>
                                    <button onClick={savePersonalInfo} className={styles.saveBtn}>Yes, Save</button>
                                </>
                            ) : (
                                <button onClick={()=>setShowModal(null)} className={styles.saveBtn}>Close</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}