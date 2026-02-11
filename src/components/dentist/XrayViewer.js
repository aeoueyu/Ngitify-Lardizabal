import React from 'react';
import styles from '../../styles/dentist/XrayViewer.module.css';

export default function XrayViewer() {
    return (
        <div className={styles.container}>
            <h3>X-ray Viewer</h3>
            <button className={styles.uploadBtn}>Upload X-ray</button>
            <div className={styles.viewer}>
                <p>X-ray images will be displayed here.</p>
            </div>
        </div>
    );
}