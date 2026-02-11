import React, { useState } from 'react';
import styles from '../../styles/owner/Surgery.module.css';
import Modal from '../modal/Modal';

const Surgeries = () => {
    const [surgeries, setSurgeries] = useState([
        { id: 1, patientName: 'John Doe', procedure: 'Wisdom Tooth Extraction', date: '2024-07-15', time: '10:00 AM', status: 'Completed', commission: 500, notes: 'Patient tolerated the procedure well. Prescribed antibiotics and painkillers.' },
        { id: 2, patientName: 'Jane Smith', procedure: 'Root Canal', date: '2024-07-16', time: '02:00 PM', status: 'Confirmed', commission: 800, notes: '' },
        { id: 3, patientName: 'Peter Jones', procedure: 'Dental Implant', date: '2024-07-17', time: '09:00 AM', status: 'Pending', commission: 1500, notes: '' },
        { id: 4, patientName: 'Mary Johnson', procedure: 'Teeth Whitening', date: '2024-07-18', time: '01:00 PM', status: 'Cancelled', commission: 300, notes: 'Patient experienced some sensitivity post-procedure.' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [selectedSurgery, setSelectedSurgery] = useState(null);
    const [currentNotes, setCurrentNotes] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleViewNotes = (surgery) => {
        setSelectedSurgery(surgery);
        setCurrentNotes(surgery.notes);
        setShowNotesModal(true);
    };

    const handleSaveNotes = () => {
        const updatedSurgeries = surgeries.map(s =>
            s.id === selectedSurgery.id ? { ...s, notes: currentNotes } : s
        );
        setSurgeries(updatedSurgeries);
        setShowNotesModal(false);
    };

    const filteredSurgeries = surgeries.filter(surgery =>
        surgery.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surgery.procedure.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Surgeries</h1>
                    <p className={styles.subTitle}>View and manage your assigned surgeries.</p>
                </div>
            </div>

            <div className={styles.controlsContainer}>
                <input
                    type="text"
                    className={styles.searchBar}
                    placeholder="Search by patient or procedure..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>PATIENT</th>
                            <th>PROCEDURE</th>
                            <th>DATE & TIME</th>
                            <th>STATUS</th>
                            <th>COMMISSION</th>
                            <th className={styles.actionHeader}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSurgeries.map(surgery => (
                            <tr key={surgery.id}>
                                <td className={styles.nameCell}>
                                    <div className={styles.avatarPlaceholder}>
                                        {surgery.patientName.charAt(0)}
                                    </div>
                                    {surgery.patientName}
                                </td>
                                <td>{surgery.procedure}</td>
                                <td>{surgery.date} - {surgery.time}</td>
                                <td><span className={`${styles.statusBadge} ${styles[surgery.status.toLowerCase()]}`}>{surgery.status}</span></td>
                                <td>₱{surgery.commission}</td>
                                <td className={styles.actionCell}>
                                    <button onClick={() => handleViewNotes(surgery)} className={styles.editBtn}>
                                        {surgery.notes ? 'View/Edit Notes' : 'Add Notes'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showNotesModal && (
                <Modal onClose={() => setShowNotesModal(false)}>
                    <h2>Post-Surgery Notes</h2>
                    <p><strong>Patient:</strong> {selectedSurgery.patientName}</p>
                    <p><strong>Procedure:</strong> {selectedSurgery.procedure}</p>
                    <textarea
                        value={currentNotes}
                        onChange={(e) => setCurrentNotes(e.target.value)}
                        placeholder="Enter complications, recovery instructions, etc."
                        rows="10"
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                    <div style={{ marginTop: '20px', textAlign: 'right' }}>
                        <button onClick={handleSaveNotes} className={styles.button} style={{ marginRight: '10px' }}>Save</button>
                        <button onClick={() => setShowNotesModal(false)} className={`${styles.button} ${styles.cancelButton}`}>Cancel</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Surgeries;
