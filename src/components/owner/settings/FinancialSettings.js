import React from 'react';
import styles from '../../../styles/user-management/ManageDentists.module.css'; // Re-use the same style
import customStyles from '../../../styles/settings/FinancialSettingsPage.module.css'; // Custom styles for form elements

export default function FinancialSettingsPage() {
    // Sample data
    const paymentMethods = ['Cash', 'Credit Card', 'GCash', 'Insurance'];
    const taxRate = 12; // in percent

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Financial Settings</h1>
                    <p className={styles.subTitle}>Configure payment methods and tax settings.</p>
                </div>
            </div>

            <div className={customStyles.section}>
                <h2 className={customStyles.sectionTitle}>Accepted Payment Methods</h2>
                <div className={customStyles.paymentMethods}>
                    {paymentMethods.map(method => (
                        <div key={method} className={customStyles.methodTag}>
                            {method}
                            <button className={customStyles.removeButton}>&times;</button>
                        </div>
                    ))}
                    <input type="text" className={customStyles.addInput} placeholder="Add new method" />
                    <button className={customStyles.addButton}>Add</button>
                </div>
            </div>

            <div className={customStyles.section}>
                <h2 className={customStyles.sectionTitle}>Tax Settings</h2>
                <div className={customStyles.taxSetting}>
                    <label htmlFor="taxRate">Default Tax Rate (%)</label>
                    <input id="taxRate" type="number" className={customStyles.taxInput} defaultValue={taxRate} />
                </div>
            </div>

            <div className={customStyles.actions}>
                <button className={customStyles.saveButton}>Save Changes</button>
            </div>
        </div>
    );
}