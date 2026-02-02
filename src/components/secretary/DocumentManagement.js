import React from 'react';
import styles from '../../styles/secretary/DocumentManagement.module.css';

export default function DocumentManagement() {
    const documents = [
        { id: 1, name: "Cardio Clearance Form", patient: "Alice Gupta", type: "Clearance", date: "Feb 01, 2026" },
        { id: 2, name: "Panoramic X-Ray", patient: "Mark Tuan", type: "Radiograph", date: "Jan 28, 2026" },
        { id: 3, name: "Consent for Surgery", patient: "Alice Gupta", type: "Legal", date: "Feb 02, 2026" },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Document Management</h1>
                    <p className={styles.subtitle}>Digital filing cabinet for external patient paperwork.</p>
                </div>
                <button className={styles.uploadBtn}>Upload Document</button>
            </header>

            <div className={styles.grid}>
                {documents.map(doc => (
                    <div key={doc.id} className={styles.docCard}>
                        <div className={styles.iconBox}>📄</div>
                        <div className={styles.docInfo}>
                            <h4 className={styles.docName}>{doc.name}</h4>
                            <span className={styles.docMeta}>{doc.patient} • {doc.type}</span>
                            <span className={styles.docDate}>Uploaded: {doc.date}</span>
                        </div>
                        <button className={styles.viewBtn}>View</button>
                    </div>
                ))}
            </div>
        </div>
    );
}