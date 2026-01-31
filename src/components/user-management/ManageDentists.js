import React, { useState, useEffect } from 'react';
import styles from '../../styles/user-management/ManageDentists.module.css';
import addIcon from '../../assets/button-icons/add.svg'; 
import { useNavigate } from 'react-router-dom';
import warningIcon from '../../assets/alert-icons/warning.svg'; 

export default function ManageDentists() {
    const navigate = useNavigate();
    
    // Data States
    const [dentists, setDentists] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Modal States
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [dentistToDelete, setDentistToDelete] = useState(null); 

    // FETCH DATA
    const fetchDentists = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/dentists');
            const data = await response.json();
            
            if (response.ok) {
                const formattedData = data.map(dentist => ({
                    id: dentist._id,
                    name: `Dr. ${dentist.name.first} ${dentist.name.last}`, 
                    license: dentist.licenseNumber || 'N/A',
                    email: dentist.email,
                    phone: dentist.contactNumber,
                    status: dentist.isVerified ? 'Active' : 'Pending',
                    image: dentist.profileImage
                }));
                setDentists(formattedData);
            }
        } catch (error) {
            console.error("Error connecting to server:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDentists();
    }, []);

    // --- DELETE LOGIC ---
    const initiateDelete = (id) => {
        setDentistToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!dentistToDelete) return;

        try {
            const response = await fetch(`http://localhost:5000/api/dentist/${dentistToDelete}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setDentists(dentists.filter(d => d.id !== dentistToDelete));
                setShowDeleteModal(false);
                setDentistToDelete(null);
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
        setDentistToDelete(null);
    };

    // Filter Logic
    const filteredDentists = dentists.filter(dentist => 
        dentist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dentist.license.includes(searchTerm)
    );

    const handleEdit = (id) => {
        navigate(`/owner/edit-dentist/${id}`);
    };
    
    const handleView = (id) => {
        navigate(`/owner/view-dentist/${id}`);
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Manage <span className={styles.highlight}>Dentists</span></h1>
                    <p className={styles.subTitle}>View and manage dentist accounts</p>
                </div>
                
                <button className={styles.addButton} onClick={() => navigate('/owner/add-dentist')}>
                    <img src={addIcon} alt="Add" className={styles.addIcon} />
                    ADD DENTIST
                </button>
            </div>

            <div className={styles.controlsContainer}>
                <input 
                    type="text" 
                    placeholder="Search by name or license no..." 
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
                            <th>LICENSE NO.</th>
                            <th>CONTACT INFO</th>
                            <th>STATUS</th>
                            <th className={styles.actionHeader}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className={styles.noData}>Loading dentists...</td></tr>
                        ) : filteredDentists.length > 0 ? (
                            filteredDentists.map((dentist) => (
                                <tr key={dentist.id}>
                                    <td className={styles.nameCell}>
                                        {dentist.image ? (
                                            <img src={dentist.image} alt="avatar" className={styles.avatarImage} />
                                        ) : (
                                            <div className={styles.avatarPlaceholder}>
                                                {dentist.name.split(' ')[1][0]}
                                            </div>
                                        )}
                                        {dentist.name}
                                    </td>
                                    <td>{dentist.license}</td>
                                    <td>
                                        <div className={styles.contactCell}>
                                            <span>{dentist.email}</span>
                                            <span className={styles.phoneText}>{dentist.phone}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${dentist.status === 'Active' ? styles.active : styles.inactive}`}>
                                            {dentist.status}
                                        </span>
                                    </td>
                                    <td className={styles.actionCell}>
                                        {/* AAYUSIN NATIN ITO: Dapat may () => arrow function */}
                                        <button className={styles.viewBtn} onClick={() => handleView(dentist.id)}>VIEW</button>
                                        <button className={styles.editBtn} onClick={() => handleEdit(dentist.id)}>EDIT</button>
                                        <button className={styles.deleteBtn} onClick={() => initiateDelete(dentist.id)}>DELETE</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className={styles.noData}>No dentists found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- DELETE CONFIRMATION MODAL --- */}
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