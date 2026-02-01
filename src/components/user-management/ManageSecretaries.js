import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/user-management/ManageSecretaries.module.css';
import addIcon from '../../assets/button-icons/add.svg';
import warningIcon from '../../assets/alert-icons/warning.svg';

export default function ManageSecretaries() {
    const navigate = useNavigate();
    const [secretaries, setSecretaries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const [statusModal, setStatusModal] = useState({ show: false, id: null, status: null });
    const [alertModal, setAlertModal] = useState({ show: false, message: '' }); // NEW

    const fetchSecretaries = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users?role=secretary');
            const data = await response.json();
            if (response.ok) {
                const formattedData = data.map(user => ({
                    ...user,
                    name: user.name ? `${user.name.first} ${user.name.last}` : 'Unknown'
                }));
                setSecretaries(formattedData);
            }
        } catch (error) {
            console.error("Error fetching secretaries:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSecretaries();
    }, []);

    const filteredSecretaries = secretaries.filter(sec => 
        sec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sec.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleStatusClick = (id, currentStatus, isVerified) => {
        if (currentStatus === 'inactive' && !isVerified) {
            setAlertModal({ 
                show: true, 
                message: "Cannot activate this account. The user has not verified their email yet." 
            });
            return;
        }
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
                fetchSecretaries();
                setStatusModal({ show: false, id: null, status: null });
            } else {
                alert("Action failed.");
            }
        } catch(error) { console.error(error); }
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Manage <span className={styles.highlight}>Secretaries</span></h1>
                    <p className={styles.subTitle}>View and manage clinic staff.</p>
                </div>
                <button className={styles.addButton} onClick={() => navigate('/owner/add-secretary')}>
                    <img src={addIcon} className={styles.addIcon} alt="Add" />
                    Add Secretary
                </button>
            </div>

            <div className={styles.controlsContainer}>
                <input 
                    type="text" 
                    className={styles.searchBar} 
                    placeholder="Search by name or email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>STATUS</th>
                            <th className={styles.actionHeader}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{textAlign:'center', padding:'20px'}}>Loading...</td></tr>
                        ) : filteredSecretaries.length > 0 ? (
                            filteredSecretaries.map((sec) => {
                                const isUnverified = !sec.isVerified;
                                const isInactive = sec.status === 'inactive';
                                const isViewEditDisabled = isUnverified || isInactive;

                                return (
                                    <tr key={sec._id} style={{ opacity: isInactive ? 0.6 : 1 }}>
                                        <td className={styles.nameCell}>
                                            <div className={styles.avatarPlaceholder}>
                                                {sec.profileImage ? <img src={sec.profileImage} alt="Profile" className={styles.avatarImage}/> : sec.name.charAt(0)}
                                            </div>
                                            {sec.name}
                                        </td>
                                        <td>{sec.email}</td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${sec.status === 'active' ? styles.active : styles.inactive}`}>
                                                {sec.status || 'active'}
                                            </span>
                                        </td>
                                        <td className={styles.actionCell}>
                                            <button 
                                                className={styles.viewBtn} 
                                                onClick={() => navigate(`/owner/view-secretary/${sec._id}`)}
                                                disabled={isViewEditDisabled}
                                                style={{ cursor: isViewEditDisabled ? 'not-allowed' : 'pointer', opacity: isViewEditDisabled ? 0.5 : 1 }}
                                            >
                                                View
                                            </button>
                                            <button 
                                                className={styles.editBtn} 
                                                onClick={() => navigate(`/owner/edit-secretary/${sec._id}`)}
                                                disabled={isViewEditDisabled}
                                                style={{ cursor: isViewEditDisabled ? 'not-allowed' : 'pointer', opacity: isViewEditDisabled ? 0.5 : 1 }}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className={styles.deleteBtn} 
                                                onClick={() => handleToggleStatusClick(sec._id, sec.status || 'active', sec.isVerified)}
                                                style={{ 
                                                    backgroundColor: sec.status === 'inactive' ? '#e8f5e9' : '#ffebee',
                                                    color: sec.status === 'inactive' ? '#2e7d32' : '#c62828',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {sec.status === 'inactive' ? 'Activate' : 'Deactivate'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan="5" className={styles.noData}>No secretaries found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* CONFIRMATION MODAL */}
            {statusModal.show && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <img src={warningIcon} alt="Warning" className={styles.modalIcon} />
                        <h3 className={styles.modalTitle}>
                            {statusModal.status === 'active' ? 'Deactivate Secretary?' : 'Activate Secretary?'}
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

            {/* ALERT MODAL */}
            {alertModal.show && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <img src={warningIcon} alt="Warning" className={styles.modalIcon} />
                        <h3 className={styles.modalTitle}>Cannot Activate</h3>
                        <p className={styles.modalMessage}>{alertModal.message}</p>
                        <button 
                            onClick={() => setAlertModal({ show: false, message: '' })}
                            style={{ marginTop: '20px', background: 'none', border: 'none', color: '#555', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}