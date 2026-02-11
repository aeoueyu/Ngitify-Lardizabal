import React from 'react';
import styles from '../../styles/settings/BranchSettingsPage.module.css';

export default function BranchSettingsPage() {
    // Sample data
    const branches = [
        { id: 1, name: 'Main Clinic (Manila)', address: '123 Rizal Ave, Manila', contact: '0917-123-4567', operatingHours: '9:00 AM - 6:00 PM' },
        { id: 2, name: 'Cebu Branch', address: '456 Mango Ave, Cebu City', contact: '0918-765-4321', operatingHours: '10:00 AM - 7:00 PM' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Branch Settings</h1>
                <button className={styles.addButton}>Add New Branch</button>
            </div>
            <p className={styles.subtitle}>Manage your clinic branches and their details.</p>

            <div className={styles.cardContainer}>
                {branches.map(branch => (
                    <div key={branch.id} className={styles.branchCard}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.branchName}>{branch.name}</h2>
                            <div className={styles.actions}>
                                <button className={styles.editButton}>Edit</button>
                                <button className={styles.deleteButton}>Delete</button>
                            </div>
                        </div>
                        <div className={styles.cardBody}>
                            <p><strong>Address:</strong> {branch.address}</p>
                            <p><strong>Contact:</strong> {branch.contact}</p>
                            <p><strong>Operating Hours:</strong> {branch.operatingHours}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
