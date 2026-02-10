import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/user-management/ManageDentists.module.css';
import addIcon from '../../assets/button-icons/add.svg';
import warningIcon from '../../assets/alert-icons/warning.svg';

export default function ManageDentists() {
    const navigate = useNavigate();
    const [dentists, setDentists] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Modal States
    const [statusModal, setStatusModal] = useState({ show: false, id: null, status: null });
    const [alertModal, setAlertModal] = useState({ show: false, message: '' }); // NEW: Alert Modal

    const fetchDentists = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users?role=dentist');
            const data = await response.json();
            if (response.ok) {
                const formattedData = data.map(user => ({
                    ...user,
                    name: user.name ? `${user.name.first} ${user.name.last}` : 'Unknown'
                }));
                setDentists(formattedData);
            }
        } catch (error) {
            console.error("Error fetching dentists:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDentists();
    }, []);

    const filteredDentists = dentists.filter(dentist => 
        dentist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dentist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dentist.licenseNumber && dentist.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // --- BUTTON HANDLERS ---

    const handleToggleStatusClick = (id, currentStatus, isVerified) => {
        // 1. Check if Unverified -> SHOW ALERT MODAL
        if (currentStatus === 'inactive' && !isVerified) {
            setAlertModal({ 
                show: true, 
                message: "Cannot activate this account. The user has not verified their email yet." 
            });
            return; 
        }
        // 2. Else -> SHOW CONFIRMATION MODAL
        setStatusModal({ show: true, id, status: currentStatus });
    };

    const confirmStatusChange = async () => {
        const { id, status } = statusModal;
        const newStatus = status === 'active' ? 'inactive' : 'active';
        
        try {
            const res = await fetch(`http://localhost:5000/api/user/toggle-status/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if(res.ok) {
                fetchDentists(); 
                setStatusModal({ show: false, id: null, status: null }); 
            } else {
                alert("Action failed.");
            }
        } catch(error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Manage Dentists</h1>
                    <p className={styles.subTitle}>View and manage clinic dentists.</p>
                </div>
                <button className={styles.addButton} onClick={() => navigate('/owner/add-dentist')}>
                    <img src={addIcon} className={styles.addIcon} alt="Add" />
                    Add Dentist
                </button>
            </div>

            <div className={styles.controlsContainer}>
                <input 
                    type="text" 
                    className={styles.searchBar} 
                    placeholder="Search by name, email, or license..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>NAME</th>
                            <th>LICENSE NO.</th>
                            <th>STATUS</th>
                            <th className={styles.actionHeader}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{textAlign:'center', padding:'20px'}}>Loading...</td></tr>
                        ) : filteredDentists.length > 0 ? (
                            filteredDentists.map((dentist) => {
                                const isUnverified = !dentist.isVerified;
                                const isInactive = dentist.status === 'inactive';
                                const isViewEditDisabled = isUnverified || isInactive;

                                return (
                                    <tr key={dentist._id} style={{ opacity: isInactive ? 0.6 : 1 }}>
                                        <td className={styles.nameCell}>
                                            <div className={styles.avatarPlaceholder}>
                                                {dentist.profileImage ? 
                                                    <img src={dentist.profileImage} alt="Profile" className={styles.avatarImage}/> : 
                                                    dentist.name.charAt(0)}
                                            </div>
                                            {dentist.name}
                                        </td>
                                        <td>{dentist.licenseNumber || 'N/A'}</td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${dentist.status === 'active' ? styles.active : styles.inactive}`}>
                                                {dentist.status || 'active'}
                                            </span>
                                        </td>
                                        <td className={styles.actionCell}>
                                            <button 
                                                className={styles.viewBtn} 
                                                onClick={() => navigate(`/owner/view-dentist/${dentist._id}`)}
                                                disabled={isViewEditDisabled} 
                                                style={{ cursor: isViewEditDisabled ? 'not-allowed' : 'pointer', opacity: isViewEditDisabled ? 0.5 : 1 }}
                                            >
                                                View
                                            </button>
                                            <button 
                                                className={styles.editBtn} 
                                                onClick={() => navigate(`/owner/edit-dentist/${dentist._id}`)}
                                                disabled={isViewEditDisabled}
                                                style={{ cursor: isViewEditDisabled ? 'not-allowed' : 'pointer', opacity: isViewEditDisabled ? 0.5 : 1 }}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className={styles.deleteBtn} 
                                                onClick={() => handleToggleStatusClick(dentist._id, dentist.status || 'inactive', dentist.isVerified)}
                                                style={{ 
                                                    backgroundColor: dentist.status === 'inactive' ? '#e8f5e9' : '#ffebee',
                                                    color: dentist.status === 'inactive' ? '#2e7d32' : '#c62828',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {dentist.status === 'inactive' ? 'Activate' : 'Deactivate'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan="5" className={styles.noData}>No dentists found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* CONFIRMATION MODAL */}
            {statusModal.show && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <h3 className={styles.modalTitle}>
                            {statusModal.status === 'active' ? 'Deactivate Dentist?' : 'Activate Dentist?'}
                        </h3>
                        <p className={styles.modalMessage}>
                            Are you sure you want to {statusModal.status === 'active' ? 'deactivate' : 'activate'} this account?
                        </p>
                        <div className={styles.modalActions}>
                            <button className={styles.modalCancelBtn} onClick={() => setStatusModal({ show: false, id: null, status: null })}>Cancel</button>
                            <button 
                                className={styles.modalDeleteBtn} 
                                onClick={confirmStatusChange}
                                style={{ backgroundColor: statusModal.status === 'active' ? '#c62828' : '#2e7d32' }}
                            >
                                Yes, {statusModal.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ALERT MODAL (NEW) */}
            {alertModal.show && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <img src={warningIcon} alt="Warning" className={styles.modalIcon} />
                        <h3 className={styles.modalTitle}>Cannot Activate</h3>
                        <p className={styles.modalMessage}>{alertModal.message}</p>
                        <button 
                            onClick={() => setAlertModal({ show: false, message: '' })}
                            style={{ 
                                marginTop: '20px', 
                                background: 'none', 
                                border: 'none', 
                                color: '#555', 
                                fontWeight: 'bold', 
                                cursor: 'pointer',
                                fontSize: '14px',
                                textDecoration: 'underline'
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}