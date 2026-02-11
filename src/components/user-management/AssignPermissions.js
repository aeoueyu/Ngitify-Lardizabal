import React, { useState } from 'react';
import styles from '../../styles/user-management/AssignPermissions.module.css';

export default function AssignPermissions() {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([
        { id: 1, name: 'Dr. Emily Carter', role: 'Dentist', permissions: { 'manage-appointments': true, 'view-records': true, 'edit-billing': false } },
        { id: 2, name: 'Michael Chen', role: 'Secretary', permissions: { 'manage-appointments': true, 'view-records': false, 'edit-billing': true } },
        { id: 3, name: 'Sarah Rodriguez', role: 'Branch Owner', permissions: { 'manage-appointments': true, 'view-records': true, 'edit-billing': true } },
    ]);

    const handlePermissionChange = (userId, permission) => {
        setUsers(users.map(user => 
            user.id === userId 
                ? { ...user, permissions: { ...user.permissions, [permission]: !user.permissions[permission] } }
                : user
        ));
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Assign Permissions</h1>
                    <p className={styles.subTitle}>Manage user roles and permissions.</p>
                </div>
            </div>

            <div className={styles.controlsContainer}>
                <input
                    type="text"
                    className={styles.searchBar}
                    placeholder="Search by name or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>USER</th>
                            <th>ROLE</th>
                            <th>MANAGE APPOINTMENTS</th>
                            <th>VIEW RECORDS</th>
                            <th>EDIT BILLING</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td className={styles.nameCell}>{user.name}</td>
                                <td>{user.role}</td>
                                <td>
                                    <input 
                                        type="checkbox" 
                                        checked={user.permissions['manage-appointments']} 
                                        onChange={() => handlePermissionChange(user.id, 'manage-appointments')}
                                    />
                                </td>
                                <td>
                                    <input 
                                        type="checkbox" 
                                        checked={user.permissions['view-records']} 
                                        onChange={() => handlePermissionChange(user.id, 'view-records')}
                                    />
                                </td>
                                <td>
                                    <input 
                                        type="checkbox" 
                                        checked={user.permissions['edit-billing']} 
                                        onChange={() => handlePermissionChange(user.id, 'edit-billing')}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
