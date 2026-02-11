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

    // Sample Data
    const sampleData = [
        {
            _id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            branch: 'Main Branch',
            status: 'active',
            isVerified: true,
            profileImage: ''
        },
        {
            _id: '2',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            branch: 'Second Branch',
            status: 'inactive',
            isVerified: true,
            profileImage: ''
        },
        {
            _id: '3',
            name: 'Peter Jones',
            email: 'peter.jones@example.com',
            branch: 'Main Branch',
            status: 'active',
            isVerified: false,
            profileImage: ''
        }
    ];

    useEffect(() => {
        // Simulate fetching data
        setBranchOwners(sampleData);
        setLoading(false);
    }, []);

    const filteredBranchOwners = branchOwners.filter(owner => 
        owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.branch.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleStatusClick = (id, currentStatus) => {
        setStatusModal({ show: true, id, status: currentStatus });
    };

    const confirmStatusChange = () => {
        const { id, status } = statusModal;
        const newStatus = status === 'active' ? 'inactive' : 'active';
        
        setBranchOwners(prevOwners => 
            prevOwners.map(owner => 
                owner._id === id ? { ...owner, status: newStatus } : owner
            )
        );
        setStatusModal({ show: false, id: null, status: null });
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
        </div>
    );
}
