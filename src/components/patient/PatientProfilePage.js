import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../styles/patient/PatientProfilePage.module.css';
import backIcon from '../../assets/button-icons/back.svg';
import addIcon from '../../assets/button-icons/add-white.svg';

import Odontogram from './Odontogram';
import XrayViewer from './XrayViewer';

// Mock data - will be replaced by API calls
const samplePatients = {
    1: { id: 1, name: 'John Doe', age: 34, gender: 'Male', lastVisit: '2023-10-15', status: 'Active', email: 'john.doe@email.com', phone: '09123456789', address: '123 Dental St, Toothville', medicalHistory: 'Hypertension, Allergic to Penicillin', treatmentNotes: [{date: '2023-10-15', note: 'Initial check-up, cleaning.'}, {date: '2023-11-01', note: 'Filling on tooth #14.'}], odontogramData: { 14: { id: 14, status: 'filling' } }, xrays: [] },
    2: { id: 2, name: 'Jane Smith', age: 28, gender: 'Female', lastVisit: '2023-11-01', status: 'Active', email: 'jane.smith@email.com', phone: '09987654321', address: '456 Molar Ave, Gumtown', medicalHistory: 'None', treatmentNotes: [{date: '2023-11-01', note: 'Wisdom tooth extraction consultation.'}], odontogramData: null, xrays: [] },
};

export default function PatientProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [patient, setPatient] = useState(null);
    const [activeTab, setActiveTab] = useState('info');

    useEffect(() => {
        // Simulate fetching data
        const foundPatient = samplePatients[id];
        if (foundPatient) {
            setPatient(foundPatient);
        }
    }, [id]);

    const handleAddNote = (newNote) => {
        const today = new Date().toISOString().split('T')[0];
        const updatedPatient = {
            ...patient,
            treatmentNotes: [...patient.treatmentNotes, { date: today, note: newNote }]
        };
        setPatient(updatedPatient);
        samplePatients[id] = updatedPatient; 
    };

    const handleUpdateNote = (index, updatedNote) => {
        const updatedNotes = [...patient.treatmentNotes];
        updatedNotes[index].note = updatedNote;
        const updatedPatient = { ...patient, treatmentNotes: updatedNotes };
        setPatient(updatedPatient);
        samplePatients[id] = updatedPatient;
    };

    const handleDeleteNote = (index) => {
        const updatedNotes = patient.treatmentNotes.filter((_, i) => i !== index);
        const updatedPatient = { ...patient, treatmentNotes: updatedNotes };
        setPatient(updatedPatient);
        samplePatients[id] = updatedPatient;
    };

    const handleOdontogramUpdate = (updatedOdontogramData) => {
        const updatedPatient = { ...patient, odontogramData: updatedOdontogramData };
        setPatient(updatedPatient);
        samplePatients[id] = updatedPatient;
    };

    const handleXrayUpdate = (updatedXrays) => {
        const updatedPatient = { ...patient, xrays: updatedXrays };
        setPatient(updatedPatient);
        samplePatients[id] = updatedPatient;
    };

    if (!patient) {
        return <div className={styles.container}><h2>Patient not found.</h2></div>;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'info':
                return <PersonalInfo patient={patient} />;
            case 'records':
                return <MedicalRecords patient={patient} onAddNote={handleAddNote} onUpdateNote={handleUpdateNote} onDeleteNote={handleDeleteNote} />;
            case 'odontogram':
                return <Odontogram patientData={patient.odontogramData} onUpdate={handleOdontogramUpdate} />;
            case 'xrays':
                return <XrayViewer initialXrays={patient.xrays} onUpdate={handleXrayUpdate} />;
            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
            <button className={styles.backButton} onClick={() => navigate('/owner/patient-records')}>
                <img src={backIcon} alt="Back" />
                Back to Patient List
            </button>

            <div className={styles.profileHeader}>
                <div className={styles.avatar}>{patient.name.charAt(0)}</div>
                <div className={styles.headerInfo}>
                    <h1>{patient.name}</h1>
                    <p>{patient.email}</p>
                </div>
            </div>

            <div className={styles.tabContainer}>
                <button className={activeTab === 'info' ? styles.activeTab : ''} onClick={() => setActiveTab('info')}>Personal Information</button>
                <button className={activeTab === 'records' ? styles.activeTab : ''} onClick={() => setActiveTab('records')}>Medical Records</button>
                <button className={activeTab === 'odontogram' ? styles.activeTab : ''} onClick={() => setActiveTab('odontogram')}>Odontogram</button>
                <button className={activeTab === 'xrays' ? styles.activeTab : ''} onClick={() => setActiveTab('xrays')}>X-Rays</button>
            </div>

            <div className={styles.contentContainer}>
                {renderContent()}
            </div>
        </div>
    );
}

// --- Sub-components for Tabs ---

const PersonalInfo = ({ patient }) => (
    <div className={styles.card}>
        <div className={styles.cardHeader}>
            <h3>Patient Details</h3>
        </div>
        <div className={styles.infoGrid}>
            <div><label>Full Name</label><p>{patient.name}</p></div>
            <div><label>Age</label><p>{patient.age}</p></div>
            <div><label>Gender</label><p>{patient.gender}</p></div>
            <div><label>Email</label><p>{patient.email}</p></div>
            <div><label>Phone</label><p>{patient.phone}</p></div>
            <div className={styles.fullWidth}><label>Address</label><p>{patient.address}</p></div>
        </div>
    </div>
);

const MedicalRecords = ({ patient, onAddNote, onUpdateNote, onDeleteNote }) => {
    const [showForm, setShowForm] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [editingNote, setEditingNote] = useState(null); // { index, text }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingNote) {
            if (newNote.trim()) {
                onUpdateNote(editingNote.index, newNote);
            }
        } else {
            if (newNote.trim()) {
                onAddNote(newNote);
            }
        }
        resetForm();
    };

    const handleEdit = (index, text) => {
        setEditingNote({ index, text });
        setNewNote(text);
        setShowForm(true);
    };

    const handleDelete = (index) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            onDeleteNote(index);
        }
    };

    const resetForm = () => {
        setNewNote('');
        setEditingNote(null);
        setShowForm(false);
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h3>EMR / Treatment Notes</h3>
                <button className={styles.addNoteButton} onClick={() => { setShowForm(true); setEditingNote(null); setNewNote(''); }}>
                    <img src={addIcon} alt="Add"/>
                    Add Note
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className={styles.addNoteForm}>
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Write a new treatment note..."
                        rows="4"
                    />
                    <div className={styles.formActions}>
                        <button type="button" onClick={resetForm} className={styles.cancelButton}>Cancel</button>
                        <button type="submit" className={styles.saveButton}>{editingNote ? 'Update Note' : 'Save Note'}</button>
                    </div>
                </form>
            )}

            <div className={styles.recordSection}>
                <h4>Medical History</h4>
                <p>{patient.medicalHistory || 'No significant medical history provided.'}</p>
            </div>
            <div className={styles.recordSection}>
                <h4>Treatment Journey</h4>
                <ul className={styles.notesList}>
                    {[...patient.treatmentNotes].reverse().map((note, revIndex) => {
                        const originalIndex = patient.treatmentNotes.length - 1 - revIndex;
                        return (
                            <li key={originalIndex}>
                                <div className={styles.noteHeader}>
                                    <div className={styles.noteDate}>{note.date}</div>
                                    <div className={styles.noteActions}>
                                        <button onClick={() => handleEdit(originalIndex, note.note)} className={styles.actionButton}>Edit</button>
                                        <button onClick={() => handleDelete(originalIndex)} className={styles.actionButton}>Delete</button>
                                    </div>
                                </div>
                                <div className={styles.noteContent}>{note.note}</div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};
