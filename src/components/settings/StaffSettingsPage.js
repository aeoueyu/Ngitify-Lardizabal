import React from 'react';
import styles from '../../styles/settings/StaffSettingsPage.module.css';

export default function StaffSettingsPage() {
    // Sample data
    const staff = [
        { id: 1, name: 'Dr. Jose Rizal', role: 'Dentist', email: 'jose.rizal@ngitify.com', status: 'Active' },
        { id: 2, name: 'Maria Clara', role: 'Receptionist', email: 'maria.clara@ngitify.com', status: 'Active' },
        { id: 3, name: 'Andres Bonifacio', role: 'Dental Assistant', email: 'andres.bonifacio@ngitify.com', status: 'Inactive' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Staff Settings</h1>
                <button className={styles.addButton}>Add New Staff</button>
            </div>
            <p className={styles.subtitle}>Manage your clinic staff and their roles.</p>

            <div className={styles.tableContainer}>
                <table className={styles.staffTable}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map(member => (
                            <tr key={member.id}>
                                <td>{member.name}</td>
                                <td>{member.role}</td>
                                <td>{member.email}</td>
                                <td>
                                    <span className={`${styles.status} ${member.status === 'Active' ? styles.active : styles.inactive}`}>
                                        {member.status}
                                    </span>
                                </td>
                                <td className={styles.actions}>
                                    <button className={styles.editButton}>Edit</button>
                                    <button className={styles.deleteButton}>Deactivate</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
