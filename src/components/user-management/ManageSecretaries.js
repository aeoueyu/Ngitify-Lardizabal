import React, { useState, useEffect } from 'react';
import styles from '../../styles/user-management/ManageSecretaries.module.css'; // Reuse Dentist Styles
import addIcon from '../../assets/button-icons/add.svg'; 
import { useNavigate } from 'react-router-dom';
import warningIcon from '../../assets/alert-icons/warning.svg'; 

export default function ManageSecretaries() {
    const navigate = useNavigate();
    
    // Data States
    const [secretaries, setSecretaries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Modal States
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [secretaryToDelete, setSecretaryToDelete] = useState(null); 

    // FETCH DATA
    const fetchSecretaries = async () => {
        try {
            // NOTE: Make sure you have this endpoint in server.js that filters by role: 'secretary'
            const response = await fetch('http://localhost:5000/api/users?role=secretary'); 
            const data = await response.json();
            
            if (response.ok) {
                const formattedData = data.map(sec => ({
                    id: sec._id,
                    name: `${sec.name.first} ${sec.name.last}`, 
                    email: sec.email,
                    phone: sec.contactNumber,
                    status: sec.isVerified ? 'Active' : 'Pending',
                    image: sec.profileImage
                }));
                setSecretaries(formattedData);
            }
        } catch (error) {
            console.error("Error connecting to server:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSecretaries();
    }, []);

    // --- DELETE LOGIC ---
    const initiateDelete = (id) => {
        setSecretaryToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!secretaryToDelete) return;

        try {
            const response = await fetch(`http://localhost:5000/api/user/${secretaryToDelete}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setSecretaries(secretaries.filter(s => s.id !== secretaryToDelete));
                setShowDeleteModal(false);
                setSecretaryToDelete(null);
            } else {
                alert("Failed to delete user.");
            }
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Server error.");
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setSecretaryToDelete(null);
    };

    // Filter Logic
    const filteredSecretaries = secretaries.filter(sec => 
        sec.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // NAVIGATION HANDLERS
    const handleEdit = (id) => navigate(`/owner/edit-secretary/${id}`);
    const handleView = (id) => navigate(`/owner/view-secretary/${id}`);

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Manage <span className={styles.highlight}>Secretaries</span></h1>
                    <p className={styles.subTitle}>View and manage secretary accounts</p>
                </div>
                
                <button className={styles.addButton} onClick={() => navigate('/owner/add-secretary')}>
                    <img src={addIcon} alt="Add" className={styles.addIcon} />
                    ADD SECRETARY
                </button>
            </div>

            <div className={styles.controlsContainer}>
                <input 
                    type="text" 
                    placeholder="Search by name..." 
                    className={styles.searchBar}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>NAME</th>
                            <th>EMAIL</th> {/* Replaced License No with Email for Secretaries */}
                            <th>STATUS</th>
                            <th className={styles.actionHeader}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className={styles.noData}>Loading secretaries...</td></tr>
                        ) : filteredSecretaries.length > 0 ? (
                            filteredSecretaries.map((sec) => (
                                <tr key={sec.id}>
                                    <td className={styles.nameCell}>
                                        {sec.image ? (
                                            <img src={sec.image} alt="avatar" className={styles.avatarImage} />
                                        ) : (
                                            <div className={styles.avatarPlaceholder}>
                                                {sec.name.split(' ')[0][0]}
                                            </div>
                                        )}
                                        {sec.name}
                                    </td>
                                    <td>{sec.email}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${sec.status === 'Active' ? styles.active : styles.inactive}`}>
                                            {sec.status}
                                        </span>
                                    </td>
                                    <td className={styles.actionCell}>
                                        <button className={styles.viewBtn} onClick={() => handleView(sec.id)}>VIEW</button>
                                        <button className={styles.editBtn} onClick={() => handleEdit(sec.id)}>EDIT</button>
                                        <button className={styles.deleteBtn} onClick={() => initiateDelete(sec.id)}>DELETE</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className={styles.noData}>No secretaries found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- DELETE MODAL --- */}
            {showDeleteModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <img src={warningIcon} alt="Warning" className={styles.modalIcon} />
                        <h3 className={styles.modalTitle}>Delete User?</h3>
                        <p className={styles.modalMessage}>Are you sure you want to delete this user? This action cannot be undone.</p>
                        <div className={styles.modalActions}>
                            <button className={styles.modalCancelBtn} onClick={cancelDelete}>Cancel</button>
                            <button className={styles.modalDeleteBtn} onClick={confirmDelete}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}