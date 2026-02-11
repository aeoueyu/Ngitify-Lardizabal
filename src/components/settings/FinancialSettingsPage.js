import React from 'react';
import styles from '../../styles/settings/FinancialSettingsPage.module.css';

export default function FinancialSettingsPage() {
    // Sample data
    const paymentMethods = ['Cash', 'Credit Card', 'GCash', 'Insurance'];
    const taxRate = 12; // in percent

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Financial Settings</h1>
            </div>
            <p className={styles.subtitle}>Configure payment methods and tax settings.</p>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Accepted Payment Methods</h2>
                <div className={styles.paymentMethods}>
                    {paymentMethods.map(method => (
                        <div key={method} className={styles.methodTag}>
                            {method}
                            <button className={styles.removeButton}>&times;</button>
                        </div>
                    ))}
                    <input type="text" className={styles.addInput} placeholder="Add new method" />
                    <button className={styles.addButton}>Add</button>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Tax Settings</h2>
                <div className={styles.taxSetting}>
                    <label htmlFor="taxRate">Default Tax Rate (%)</label>
                    <input id="taxRate" type="number" className={styles.taxInput} defaultValue={taxRate} />
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.saveButton}>Save Changes</button>
            </div>
        </div>
    );
}
