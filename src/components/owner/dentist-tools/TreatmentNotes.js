import React, { useState } from 'react';
import styles from '../../../styles/owner/dentist-tools/TreatmentNotes.module.css';

const samplePatients = [
    { id: 1, name: 'Juan Dela Cruz' },
    { id: 2, name: 'Maria Clara' },
    { id: 3, name: 'Jose Rizal' },
    { id: 4, name: 'Andres Bonifacio' },
];

export default function TreatmentNotes() {
    const [selectedPatient, setSelectedPatient] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            patientId: selectedPatient,
            notes,
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Add Treatment Notes</h1>
                    <p className={styles.subTitle}>Create and save new treatment notes for a patient.</p>
                </div>
            </div>

            <div className={styles.formContainer}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="patient-select">Select Patient</label>
                        <select
                            id="patient-select"
                            className={styles.select}
                            value={selectedPatient}
                            onChange={(e) => setSelectedPatient(e.target.value)}
                        >
                            <option value="">--Please choose a patient--</option>
                            {samplePatients.map(patient => (
                                <option key={patient.id} value={patient.id}>
                                    {patient.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="notes">Treatment Notes</label>
                        <textarea
                            id="notes"
                            className={styles.textarea}
                            rows="10"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Enter detailed treatment notes here..."
                        ></textarea>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="attachment">Attach Files (e.g., X-rays, lab results)</label>
                        <input type="file" id="attachment" className={styles.input} />
                    </div>
                    <div className={styles.buttonContainer}>
                        <button type="submit" className={styles.submitButton}>Save Notes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
