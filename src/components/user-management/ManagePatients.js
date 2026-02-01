import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../styles/user-management/ManagePatients.module.css';
import addIcon from '../../assets/button-icons/add.svg';
import warningIcon from '../../assets/alert-icons/warning.svg';

export default function ManagePatients() {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname.split('/')[1]; 

    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const [statusModal, setStatusModal] = useState({ show: false, id: null, status: null });
    const [alertModal, setAlertModal] = useState({ show: false, message: '' }); // NEW

    const fetchPatients = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users?role=patient');
            const data = await response.json();
            if (response.ok) {
                const formattedData = data.map(user => ({
                    ...user,
                    name: user.name ? `${user.name.first} ${user.name.last}` : 'Unknown'
                }));
                setPatients(formattedData);
            }
        } catch (error) { console.error(error); } 
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(pt => 
        pt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pt.email.toLowerCase().includes(searchTerm.toLowerCase())
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
                fetchPatients();
                setStatusModal({ show: false, id: null, status: null });
            } else { alert("Action failed."); }
        } catch(error) { console.error(error); }
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Manage <span className={styles.highlight}>Patients</span></h1>
                    <p className={styles.subTitle}>View and manage patient records.</p>
                </div>
                <button className={styles.addButton} onClick={() => navigate(`/${currentPath}/add-patient`)}>
                    <img src={addIcon} className={styles.addIcon} alt="Add" />
                    Add Patient
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
                            <tr><td colSpan="5" style={{textAlign:'center'}}>Loading...</td></tr>
                        ) : filteredPatients.length > 0 ? (
                            filteredPatients.map((pt) => {
                                const isUnverified = !pt.isVerified;
                                const isInactive = pt.status === 'inactive';
                                const isViewEditDisabled = isUnverified || isInactive;

                                return (
                                    <tr key={pt._id} style={{ opacity: isInactive ? 0.6 : 1 }}>
                                        <td className={styles.nameCell}>
                                            <div className={styles.avatarPlaceholder}>
                                                {pt.profileImage ? <img src={pt.profileImage} alt="Profile" className={styles.avatarImage}/> : pt.name.charAt(0)}
                                            </div>
                                            {pt.name}
                                        </td>
                                        <td>{pt.email}</td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${pt.status === 'active' ? styles.active : styles.inactive}`}>
                                                {pt.status || 'active'}
                                            </span>
                                        </td>
                                        <td className={styles.actionCell}>
                                            <button 
                                                className={styles.viewBtn} 
                                                onClick={() => navigate(`/${currentPath}/view-patient/${pt._id}`)}
                                                disabled={isViewEditDisabled}
                                                style={{ cursor: isViewEditDisabled ? 'not-allowed' : 'pointer', opacity: isViewEditDisabled ? 0.5 : 1 }}
                                            >
                                                View
                                            </button>
                                            <button 
                                                className={styles.editBtn} 
                                                onClick={() => navigate(`/${currentPath}/edit-patient/${pt._id}`)}
                                                disabled={isViewEditDisabled}
                                                style={{ cursor: isViewEditDisabled ? 'not-allowed' : 'pointer', opacity: isViewEditDisabled ? 0.5 : 1 }}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className={styles.deleteBtn} 
                                                onClick={() => handleToggleStatusClick(pt._id, pt.status || 'active', pt.isVerified)}
                                                style={{ 
                                                    backgroundColor: pt.status === 'inactive' ? '#e8f5e9' : '#ffebee',
                                                    color: pt.status === 'inactive' ? '#2e7d32' : '#c62828',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {pt.status === 'inactive' ? 'Activate' : 'Deactivate'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan="5" className={styles.noData}>No patients found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODALS */}
            {statusModal.show && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <img src={warningIcon} alt="Warning" className={styles.modalIcon} />
                        <h3 className={styles.modalTitle}>
                            {statusModal.status === 'active' ? 'Deactivate Patient?' : 'Activate Patient?'}
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