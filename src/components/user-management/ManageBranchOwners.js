import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/user-management/ManageBranchOwners.module.css';
import addIcon from '../../assets/button-icons/add.svg';
import warningIcon from '../../assets/alert-icons/warning.svg';

export default function ManageBranchOwners() {
    const navigate = useNavigate();
    const [branchOwners, setBranchOwners] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Modal States
    const [statusModal, setStatusModal] = useState({ show: false, id: null, status: null });
    const [alertModal, setAlertModal] = useState({ show: false, message: '' });

    const fetchBranchOwners = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users?role=co-owner');
            const data = await response.json();
            if (response.ok) {
                const formattedData = data.map(user => ({
                    ...user,
                    name: user.name ? `${user.name.first} ${user.name.last}` : 'Unknown'
                }));
                setBranchOwners(formattedData);
            }
        } catch (error) {
            console.error("Error fetching branch owners:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBranchOwners();
    }, []);

    const filteredBranchOwners = branchOwners.filter(owner => 
        owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (owner.branch && owner.branch.toLowerCase().includes(searchTerm.toLowerCase()))
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
                fetchBranchOwners();
                setStatusModal({ show: false, id: null, status: null });
            } else {
                alert("Action failed.");
            }
        } catch(error) {
            console.error(error);
        }
    };

    const handleResendActivation = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/user/resend-activation/${userId}`, {
                method: 'POST',
            });
            const data = await response.json();
            if (response.ok) {
                setAlertModal({ show: true, message: data.message });
            } else {
                setAlertModal({ show: true, message: data.message || "Failed to resend activation email." });
            }
        } catch (error) {
            console.error("Error resending activation:", error);
            setAlertModal({ show: true, message: "Server error. Please try again later." });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Manage Branch Owners</h1>
                    <p className={styles.subTitle}>View and manage branch owners.</p>
                </div>
                <button className={styles.addButton} onClick={() => { /* Navigate to Add Branch Owner page */ }}>
                    <img src={addIcon} className={styles.addIcon} alt="Add" />
                    Add Branch Owner
                </button>
            </div>

            <div className={styles.controlsContainer}>
                <input 
                    type="text" 
                    className={styles.searchBar} 
                    placeholder="Search by name, email, or branch..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>NAME</th>
                            <th>BRANCH</th>
                            <th>STATUS</th>
                            <th className={styles.actionHeader}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{textAlign:'center', padding:'20px'}}>Loading...</td></tr>
                        ) : filteredBranchOwners.length > 0 ? (
                            filteredBranchOwners.map((owner) => {
                                const isInactive = owner.status === 'inactive';

                                return (
                                    <tr key={owner._id} style={{ opacity: isInactive ? 0.6 : 1 }}>
                                        <td className={styles.nameCell}>
                                            <div className={styles.avatarPlaceholder}>
                                                {owner.profileImage ? 
                                                    <img src={owner.profileImage} alt="Profile" className={styles.avatarImage}/> : 
                                                    owner.name.charAt(0)}
                                            </div>
                                            {owner.name}
                                        </td>
                                        <td>{owner.branch}</td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${owner.status === 'active' ? styles.active : styles.inactive}`}>
                                                {owner.status}
                                            </span>
                                        </td>
                                        <td className={styles.actionCell}>
                                            <button 
                                                className={styles.viewBtn} 
                                                onClick={() => { /* Navigate to View Branch Owner page */ }}
                                            >
                                                View
                                            </button>
                                            <button 
                                                className={styles.editBtn} 
                                                onClick={() => { /* Navigate to Edit Branch Owner page */ }}
                                            >
                                                Edit
                                            </button>
                                            {isInactive && !owner.isVerified ? (
                                                <button 
                                                    className={styles.resendBtn}
                                                    onClick={() => handleResendActivation(owner._id)}
                                                >
                                                    Resend Activation
                                                </button>
                                            ) : (
                                                <button 
                                                    className={styles.deleteBtn} 
                                                    onClick={() => handleToggleStatusClick(owner._id, owner.status)}
                                                    style={{ 
                                                        backgroundColor: owner.status === 'inactive' ? '#e8f5e9' : '#ffebee',
                                                        color: owner.status === 'inactive' ? '#2e7d32' : '#c62828',
                                                    }}
                                                >
                                                    {owner.status === 'inactive' ? 'Activate' : 'Deactivate'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan="4" className={styles.noData}>No branch owners found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {statusModal.show && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <h3 className={styles.modalTitle}>
                            {statusModal.status === 'active' ? 'Deactivate Branch Owner?' : 'Activate Branch Owner?'}
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

            {alertModal.show && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <img src={warningIcon} alt="Warning" className={styles.modalIcon} />
                        <h3 className={styles.modalTitle}>Alert</h3>
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
