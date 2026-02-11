import React from 'react';
import styles from '../../../styles/dentist/settings/Settings.module.css';

export default function RevenueSettings() {
    return (
        <div>
            <h2 className={styles.subHeader}>Commission Rules</h2>
            <p>These rules are set by the Owner-Dentist and are read-only.</p>
            
            <div className={styles.rulesContainer}>
                <ul>
                    <li><strong>Standard Procedure:</strong> 30% of total fee</li>
                    <li><strong>Major Surgery:</strong> 40% of total fee</li>
                    <li><strong>Cosmetic Procedure:</strong> 35% of total fee</li>
                    <li><strong>Consultation:</strong> Fixed rate of PHP 500 per session</li>
                </ul>
            </div>

            <div className={styles.divider}></div>

            <h2 className={styles.subHeader}>Export Commission Report</h2>
            <div className={styles.exportContainer}>
                <p>Export a detailed report of your personal commissions for accounting purposes.</p>
                <button className={styles.secondaryButton}>Export as PDF</button>
            </div>
        </div>
    );
}