import React from 'react';
import styles from '../../styles/dentist/Odontogram.module.css';

export default function Odontogram() {
    return (
        <div className={styles.container}>
            <h3>Odontogram</h3>
            <div className={styles.chart}>
                <p>Interactive dental chart will be here.</p>
            </div>
        </div>
    );
}