import React, { useState } from 'react';
import styles from '../../styles/dentist/TreatmentNotes.module.css';

export default function TreatmentNotes() {
    const [notes, setNotes] = useState([
        { text: 'Initial consultation. Patient complains of toothache in the upper right molar.', date: new Date('2023-10-26T10:00:00Z') },
        { text: 'Performed X-ray. Confirmed cavity in tooth #3. Scheduled for filling.', date: new Date('2023-10-26T10:30:00Z') },
    ]);
    const [newNote, setNewNote] = useState('');

    const handleAddNote = () => {
        if (newNote.trim()) {
            setNotes([...notes, { text: newNote, date: new Date() }]);
            setNewNote('');
        }
    };

    return (
        <div className={styles.container}>
            <h3>Treatment Notes</h3>
            <div className={styles.addNoteForm}>
                <textarea 
                    value={newNote} 
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a new note..."
                />
                <button onClick={handleAddNote}>Add Note</button>
            </div>
            <ul className={styles.notesList}>
                {notes.map((note, index) => (
                    <li key={index} className={styles.noteItem}>
                        <p>{note.text}</p>
                        <small className={styles.noteDate}>{note.date.toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}