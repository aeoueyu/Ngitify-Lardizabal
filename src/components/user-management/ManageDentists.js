import React, { useState } from 'react';
import styles from '../../styles/user-management/ManageDentists.module.css';
import addIcon from '../../assets/button-icons/add.svg'; 
import { useNavigate } from 'react-router-dom';

// MOCK DATA: Yung una may picture (sample URL), yung iba wala (null)
const INITIAL_DATA = [
    { 
        id: 1, 
        name: 'Dr. Juan Dela Cruz', 
        license: '1234567', 
        email: 'juan@gmail.com', 
        phone: '+639123456789', 
        status: 'Active',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=100&q=80' // Sample image
    },
    { 
        id: 2, 
        name: 'Dr. Maria Santos', 
        license: '7654321', 
        email: 'maria@yahoo.com', 
        phone: '+639987654321', 
        status: 'Inactive',
        image: null // Wala siyang image, dapat letter 'M' lumabas
    },
    { 
        id: 3, 
        name: 'Dr. Jose Rizal', 
        license: '1112223', 
        email: 'pepe@gmail.com', 
        phone: '+639111111111', 
        status: 'Active',
        image: null 
    },
];

export default function ManageDentists() {
    const navigate = useNavigate();
    const [dentists, setDentists] = useState(INITIAL_DATA);
    const [searchTerm, setSearchTerm] = useState('');

    const handleEdit = (id) => alert(`Edit Dentist ID: ${id}`);
    const handleView = (dentist) => alert(`Profile: ${dentist.name}`);
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this dentist?")) {
            setDentists(dentists.filter(d => d.id !== id));
        }
    };

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
                        {filteredDentists.length > 0 ? (
                            filteredDentists.map((dentist) => (
                                <tr key={dentist.id}>
                                    <td className={styles.nameCell}>
                                        {/* LOGIC: Show Image OR Letter */}
                                        {dentist.image ? (
                                            <img 
                                                src={dentist.image} 
                                                alt="avatar" 
                                                className={styles.avatarImage} 
                                            />
                                        ) : (
                                            <div className={styles.avatarPlaceholder}>
                                                {dentist.name.charAt(4)} {/* Assuming 'Dr. ' prefix, charAt(4) is the name start */}
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
                                        <button className={styles.viewBtn} onClick={() => handleView(dentist)}>VIEW</button>
                                        <button className={styles.editBtn} onClick={() => handleEdit(dentist.id)}>EDIT</button>
                                        <button className={styles.deleteBtn} onClick={() => handleDelete(dentist.id)}>DELETE</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className={styles.noData}>No dentists found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}