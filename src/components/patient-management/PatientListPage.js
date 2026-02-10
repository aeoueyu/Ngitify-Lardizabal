import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../styles/user-management/ManagePatients.module.css';
import addIcon from '../../assets/button-icons/add.svg';

export default function PatientListPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname.split('/')[1]; 

    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchPatients = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/patients');
            const data = await response.json();
            if (response.ok) {
                const formattedData = data.map(patient => ({
                    ...patient,
                    name: patient.name ? `${patient.name.first} ${patient.name.last}` : 'Unknown'
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

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Patient Records</h1>
                    <p className={styles.subTitle}>Browse, add, or update patient records.</p>
                </div>
                <button className={styles.addButton} onClick={() => navigate('/patient-management/add')}>
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
                            <th>CONTACT NUMBER</th>
                            <th className={styles.actionHeader}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{textAlign:'center'}}>Loading...</td></tr>
                        ) : filteredPatients.length > 0 ? (
                            filteredPatients.map((pt) => (
                                <tr key={pt._id}>
                                    <td className={styles.nameCell}>
                                        <div className={styles.avatarPlaceholder}>
                                            {pt.name.charAt(0)}
                                        </div>
                                        {pt.name}
                                    </td>
                                    <td>{pt.email}</td>
                                    <td>{pt.contactNumber}</td>
                                    <td className={styles.actionCell}>
                                        <button 
                                            className={styles.viewBtn} 
                                            onClick={() => navigate(`/patient-management/view/${pt._id}`)}
                                        >
                                            View
                                        </button>
                                        <button 
                                            className={styles.editBtn} 
                                            onClick={() => navigate(`/patient-management/edit/${pt._id}`)}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className={styles.noData}>No patients found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
