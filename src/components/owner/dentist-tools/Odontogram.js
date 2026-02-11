import React from 'react';
import styles from '../../../styles/owner/dentist-tools/Odontogram.module.css';

const sampleXrays = [
    { id: 1, url: 'https://via.placeholder.com/150', caption: 'Periapical - Tooth #14' },
    { id: 2, url: 'https://via.placeholder.com/150', caption: 'Bitewing - Right Side' },
    { id: 3, url: 'https://via.placeholder.com/150', caption: 'Panoramic X-ray' },
    { id: 4, url: 'https://via.placeholder.com/150', caption: 'Occlusal - Upper Arch' },
];

export default function Odontogram() {
    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Odontogram & X-Ray Records</h1>
                    <p className={styles.subTitle}>Access patient's odontogram and view X-ray history.</p>
                </div>
            </div>

            <div className={styles.mainGrid}>
                <div className={styles.odontogramContainer}>
                    <h2 className={styles.cardTitle}>Odontogram</h2>
                    <div className={styles.odontogramPlaceholder}>
                        <p>Interactive odontogram will be displayed here.</p>
                    </div>
                </div>

                <div className={styles.xrayContainer}>
                    <h2 className={styles.cardTitle}>X-Ray Gallery</h2>
                    <div className={styles.xrayGallery}>
                        {sampleXrays.map(xray => (
                            <div key={xray.id} className={styles.xrayItem}>
                                <img src={xray.url} alt={xray.caption} className={styles.xrayImage} />
                                <p className={styles.xrayCaption}>{xray.caption}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
