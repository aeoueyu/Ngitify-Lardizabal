import React, { useState } from 'react';
import styles from '../../../styles/owner/Surgery.module.css';

// Sample data for a single surgery, assuming we get this from a prop or API call
const sampleSurgeryDetails = {
    id: 1,
    patient: 'Juan Dela Cruz',
    procedure: 'Wisdom Tooth Extraction',
    date: '2024-08-15',
    time: '10:00 AM',
    surgeon: 'Dr. Reyes',
    branch: 'Main Clinic, Quezon City',
    status: 'Completed',
    fee: 5000.00,
    paymentStatus: 'Paid',
    notes: [
        { id: 1, author: 'Dr. Reyes', text: 'Procedure was successful with no complications. Patient was prescribed pain relievers.', timestamp: '2024-08-15 11:30 AM' },
        { id: 2, author: 'Dr. Garcia (Owner)', text: 'Reviewed post-op. Patient healing well.', timestamp: '2024-08-16 09:00 AM' }
    ]
};

export default function ViewSurgeryDetails() {
    const [surgery, setSurgery] = useState(sampleSurgeryDetails);
    const [newNote, setNewNote] = useState('');

    const handleAddNote = () => {
        if (newNote.trim() === '') return;

        const noteToAdd = {
            id: surgery.notes.length + 1,
            author: 'Dr. Garcia (Owner)', // Assuming the current user is the owner
            text: newNote,
            timestamp: new Date().toLocaleString()
        };

        setSurgery(prev => ({
            ...prev,
            notes: [...prev.notes, noteToAdd]
        }));
        setNewNote('');
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>{surgery.procedure}</h1>
                    <p className={styles.subTitle}>Patient: <strong>{surgery.patient}</strong></p>
                </div>
            </div>

            {/* Details Grid */}
            <div className={styles.detailsGrid}>
                {/* Left Card: Surgery Info */}
                <div className={styles.infoCard}>
                    <h3 className={styles.cardTitle}>Surgery Information</h3>
                    <div className={styles.infoGroup}>
                        <span className={styles.label}>Date & Time</span>
                        <span className={styles.value}>{new Date(surgery.date).toLocaleDateString()} at {surgery.time}</span>
                    </div>
                    <div className={styles.infoGroup}>
                        <span className={styles.label}>Assigned Surgeon</span>
                        <span className={styles.value}>{surgery.surgeon}</span>
                    </div>
                    <div className={styles.infoGroup}>
                        <span className={styles.label}>Branch</span>
                        <span className={styles.value}>{surgery.branch}</span>
                    </div>
                    <div className={styles.infoGroup}>
                        <span className={styles.label}>Status</span>
                        <span className={`${styles.statusBadge} ${styles[surgery.status.toLowerCase()]}`}>{surgery.status}</span>
                    </div>
                </div>

                {/* Right Card: Financial Info */}
                <div className={styles.infoCard}>
                    <h3 className={styles.cardTitle}>Financials</h3>
                    <div className={styles.infoGroup}>
                        <span className={styles.label}>Procedure Fee</span>
                        <span className={styles.value}>₱ {surgery.fee.toFixed(2)}</span>
                    </div>
                    <div className={styles.infoGroup}>
                        <span className={styles.label}>Payment Status</span>
                        <span className={styles.value}>{surgery.paymentStatus}</span>
                    </div>
                </div>
            </div>

            {/* Post-Surgery Notes Section */}
            <div className={styles.notesSection}>
                <h3 className={styles.cardTitle}>Post-Surgery Notes</h3>
                <div className={styles.notesList}>
                    {surgery.notes.map(note => (
                        <div key={note.id} className={styles.noteItem}>
                            <p className={styles.noteText}>"{note.text}"</p>
                            <span className={styles.noteMeta}>- <strong>{note.author}</strong> on {note.timestamp}</span>
                        </div>
                    ))}
                </div>
                <div className={styles.addNoteForm}>
                    <textarea
                        className={styles.noteTextarea}
                        placeholder="Add a new note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                    />
                    <button className={styles.addNoteButton} onClick={handleAddNote}>Add Note</button>
                </div>
            </div>
        </div>
    );
}
