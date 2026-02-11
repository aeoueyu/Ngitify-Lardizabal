import React, { useState } from 'react';
import styles from '../../../styles/user-management/ManageDentists.module.css'; // Re-use the same style
import addIcon from '../../../assets/sidebar-icons/add-icon.svg';

export default function BranchSettingsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    // Sample data
    const branches = [
        { id: 1, name: 'Main Clinic (Manila)', address: '123 Rizal Ave, Manila', contact: '0917-123-4567', operatingHours: '9:00 AM - 6:00 PM' },
        { id: 2, name: 'Cebu Branch', address: '456 Mango Ave, Cebu City', contact: '0918-765-4321', operatingHours: '10:00 AM - 7:00 PM' },
    ];

    const filteredBranches = branches.filter(branch =>
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Branch Settings</h1>
                    <p className={styles.subTitle}>Manage your clinic branches and their details.</p>
                </div>
                <button className={styles.addButton}>
                    <img src={addIcon} alt="Add" className={styles.addIcon} />
                    Add New Branch
                </button>
            </div>

            <div className={styles.controlsContainer}>
                <input
                    type="text"
                    placeholder="Search by branch name or address..."
                    className={styles.searchBar}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Branch Name</th>
                            <th>Address</th>
                            <th>Contact</th>
                            <th>Operating Hours</th>
                            <th className={styles.actionHeader}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBranches.length > 0 ? (
                            filteredBranches.map(branch => (
                                <tr key={branch.id}>
                                    <td className={styles.nameCell}>{branch.name}</td>
                                    <td>{branch.address}</td>
                                    <td>{branch.contact}</td>
                                    <td>{branch.operatingHours}</td>
                                    <td className={styles.actionCell}>
                                        <button className={styles.viewBtn}>View</button>
                                        <button className={styles.editBtn}>Edit</button>
                                        <button className={styles.deleteBtn}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className={styles.noData}>No branches found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}