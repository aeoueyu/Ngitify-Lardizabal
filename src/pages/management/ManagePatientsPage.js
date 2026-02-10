import React, { useState, useEffect } from 'react';
import PatientTable from '../../components/management/PatientTable';
import styles from '../../styles/management/ManagePages.module.css';
import { useNavigate } from 'react-router-dom';

const ManagePatientsPage = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/users?role=patient');
                if (!response.ok) {
                    throw new Error('Failed to fetch patients');
                }
                const data = await response.json();
                setPatients(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Manage Patients</h1>
                <button className={styles.addButton} onClick={() => navigate('/add-patient')}>
                    Add New Patient
                </button>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && <PatientTable patients={patients} />}
        </div>
    );
};

export default ManagePatientsPage;
