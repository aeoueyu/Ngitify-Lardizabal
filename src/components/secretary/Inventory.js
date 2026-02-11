import React, { useState } from 'react';
import styles from '../../styles/secretary/Inventory.module.css';

const sampleInventory = [
    { id: 1, name: 'Dental Gloves', category: 'Disposables', stock: 500, status: 'In Stock' },
    { id: 2, name: 'Anesthetic', category: 'Medications', stock: 50, status: 'In Stock' },
    { id: 3, name: 'Composite Resin', category: 'Restorative', stock: 10, status: 'Low Stock' },
    { id: 4, name: 'Surgical Masks', category: 'Disposables', stock: 1000, status: 'In Stock' },
    { id: 5, name: 'X-Ray Films', category: 'Equipment', stock: 0, status: 'Out of Stock' },
];

const Inventory = () => {
    const [inventory, setInventory] = useState(sampleInventory);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Inventory Management</h1>
                <div className={styles.headerActions}>
                    <input
                        type="text"
                        placeholder="Search items..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <button className={styles.addButton}>Update Stock</button>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Category</th>
                            <th>Stock Level</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInventory.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                <td>{item.stock}</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${
                                        item.status === 'In Stock' ? styles.inStock :
                                        item.status === 'Low Stock' ? styles.lowStock : styles.outOfStock
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventory;
