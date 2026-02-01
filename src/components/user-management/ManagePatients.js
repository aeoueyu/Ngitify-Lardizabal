import React, { useState, useEffect } from 'react';
import styles from '../../styles/user-management/ManagePatients.module.css'; // Reuse Dentist Styles
import addIcon from '../../assets/button-icons/add.svg'; 
import { useNavigate } from 'react-router-dom';
import warningIcon from '../../assets/alert-icons/warning.svg'; 

export default function ManagePatients() {
    const navigate = useNavigate();
    
    // Data States
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Modal States
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState(null); 

    // FETCH DATA
    const fetchPatients = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users?role=patient'); 
            const data = await response.json();
            
            if (response.ok) {
                const formattedData = data.map(pat => ({
                    id: pat._id,
                    name: `${pat.name.first} ${pat.name.last}`, 
                    email: pat.email,
                    phone: pat.contactNumber,
                    status: pat.isVerified ? 'Active' : 'Pending',
                    image: pat.profileImage
                }));
                setPatients(formattedData);
            }
        } catch (error) {
            console.error("Error connecting to server:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    // --- DELETE LOGIC ---
    const initiateDelete = (id) => {
        setPatientToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!patientToDelete) return;

        try {
            const response = await fetch(`http://localhost:5000/api/user/${patientToDelete}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setPatients(patients.filter(p => p.id !== patientToDelete));
                setShowDeleteModal(false);
                setPatientToDelete(null);
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
        setPatientToDelete(null);
    };

    // Filter Logic
    const filteredPatients = patients.filter(pat => 
        pat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // NAVIGATION HANDLERS
    const handleEdit = (id) => navigate(`/owner/edit-patient/${id}`);
    const handleView = (id) => navigate(`/owner/view-patient/${id}`);

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Manage <span className={styles.highlight}>Patients</span></h1>
                    <p className={styles.subTitle}>View and manage patient accounts</p>
                </div>
                
                <button className={styles.addButton} onClick={() => navigate('/owner/add-patient')}>
                    <img src={addIcon} alt="Add" className={styles.addIcon} />
                    ADD PATIENT
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
                            <th>EMAIL</th>
                            <th>STATUS</th>
                            <th className={styles.actionHeader}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className={styles.noData}>Loading patients...</td></tr>
                        ) : filteredPatients.length > 0 ? (
                            filteredPatients.map((pat) => (
                                <tr key={pat.id}>
                                    <td className={styles.nameCell}>
                                        {pat.image ? (
                                            <img src={pat.image} alt="avatar" className={styles.avatarImage} />
                                        ) : (
                                            <div className={styles.avatarPlaceholder}>
                                                {pat.name.split(' ')[0][0]}
                                            </div>
                                        )}
                                        {pat.name}
                                    </td>
                                    <td>{pat.email}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${pat.status === 'Active' ? styles.active : styles.inactive}`}>
                                            {pat.status}
                                        </span>
                                    </td>
                                    <td className={styles.actionCell}>
                                        <button className={styles.viewBtn} onClick={() => handleView(pat.id)}>VIEW</button>
                                        <button className={styles.editBtn} onClick={() => handleEdit(pat.id)}>EDIT</button>
                                        <button className={styles.deleteBtn} onClick={() => initiateDelete(pat.id)}>DELETE</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className={styles.noData}>No patients found.</td></tr>
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