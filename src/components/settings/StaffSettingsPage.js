import React, { useState, useEffect } from 'react';
import styles from '../../styles/settings/StaffSettingsPage.module.css';

export default function StaffSettingsPage() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/users');
                const data = await res.json();
                if (res.ok) {
                    // Filter for dentists and secretaries
                    const filteredStaff = data.filter(user => user.role === 'dentist' || user.role === 'secretary');
                    setStaff(filteredStaff);
                }
            } catch (error) {
                console.error("Error fetching staff:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Staff Management</h1>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{textAlign:'center', padding:'20px'}}>Loading staff...</td></tr>
                        ) : staff.length > 0 ? (
                            staff.map(member => (
                                <tr key={member._id}>
                                    <td>{`${member.name.first} ${member.name.last}`}</td>
                                    <td>{member.email}</td>
                                    <td style={{textTransform: 'capitalize'}}>{member.role}</td>
                                    <td>
                                        <span className={`${styles.status} ${styles[member.status]}`}>
                                            {member.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className={styles.noData}>No staff found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
