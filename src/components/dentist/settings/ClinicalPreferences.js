import React from 'react';
import styles from '../../../styles/dentist/settings/Settings.module.css';

export default function ClinicalPreferences() {
    return (
        <div>
            <h2 className={styles.subHeader}>Odontogram Settings</h2>
            <div className={styles.formGroup}>
                <label>Default Odontogram View</label>
                <div className={styles.radioGroup}>
                    <label>
                        <input type="radio" name="odontogramView" value="simplified" defaultChecked />
                        Simplified Chart
                    </label>
                    <label>
                        <input type="radio" name="odontogramView" value="detailed" />
                        Detailed Chart
                    </label>
                </div>
            </div>

            <div className={styles.divider}></div>

            <h2 className={styles.subHeader}>X-Ray Viewer Settings</h2>
            <div className={styles.formGroup}>
                <label htmlFor="thumbnailSize">Thumbnail Size</label>
                <select id="thumbnailSize" defaultValue="medium">
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                </select>
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="defaultZoom">Default Zoom Level</label>
                <select id="defaultZoom" defaultValue="100">
                    <option value="50">50%</option>
                    <option value="100">100% (Fit to screen)</option>
                    <option value="150">150%</option>
                </select>
            </div>

            <div className={styles.divider}></div>

            <h2 className={styles.subHeader}>Note Templates</h2>
            <div className={styles.formGroup}>
                <label>Manage your custom note templates.</label>
                <textarea rows="5" placeholder="e.g., Post-surgery recovery instructions..."></textarea>
            </div>
            <button className={styles.saveButton}>Save Preferences</button>
        </div>
    );
}