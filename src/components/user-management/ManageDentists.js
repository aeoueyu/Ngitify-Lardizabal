import React, { useState, useEffect } from 'react';
import styles from '../../styles/user-management/ManageDentists.module.css';
import addIcon from '../../assets/button-icons/add.svg'; 
import { useNavigate } from 'react-router-dom';

export default function ManageDentists() {
    const navigate = useNavigate();
    
    // Wala na tayong INITIAL_DATA, empty array muna
    const [dentists, setDentists] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true); // Loading state

    // FETCH DATA FROM SERVER
    const fetchDentists = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/dentists');
            const data = await response.json();
            
            if (response.ok) {
                // I-map natin ang data galing backend papunta sa format ng table
                const formattedData = data.map(dentist => ({
                    id: dentist._id, // MongoDB ID
                    // Pagsamahin ang pangalan
                    name: `Dr. ${dentist.name.first} ${dentist.name.last}`, 
                    license: dentist.licenseNumber || 'N/A',
                    email: dentist.email,
                    phone: dentist.contactNumber,
                    // Gamitin ang isVerified bilang status (o pwede ring magdagdag ng status field sa DB later)
                    status: dentist.isVerified ? 'Active' : 'Pending',
                    image: dentist.profileImage // Base64 Image
                }));
                setDentists(formattedData);
            } else {
                console.error("Failed to fetch dentists");
            }
        } catch (error) {
            console.error("Error connecting to server:", error);
        } finally {
            setLoading(false);
        }
    };

    // Tawagin ang fetch sa pag-load ng page
    useEffect(() => {
        fetchDentists();
    }, []);

    // ... (ACTIONS: Delete Logic Updated for API)
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this dentist?")) {
            // Note: Wala pa tayong DELETE endpoint sa backend, pero sa UI pwede natin alisin muna
            // Sa susunod, gagawan natin ito ng app.delete('/api/user/:id')
            setDentists(dentists.filter(d => d.id !== id));
        }
    };

    // Filter Logic
    const filteredDentists = dentists.filter(dentist => 
        dentist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dentist.license.includes(searchTerm)
    );

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Manage <span className={styles.highlight}>Dentists</span></h1>
                    <p className={styles.subTitle}>View and manage dentist accounts</p>
                </div>
                
                <button 
                    className={styles.addButton} 
                    onClick={() => navigate('/owner/add-dentist')}
                >
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
                                                {/* Kunin ang first letter ng First Name (skip "Dr. ") */}
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
                                        <button className={styles.viewBtn}>VIEW</button>
                                        <button className={styles.editBtn}>EDIT</button>
                                        <button className={styles.deleteBtn} onClick={() => handleDelete(dentist.id)}>DELETE</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className={styles.noData}>No dentists found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}