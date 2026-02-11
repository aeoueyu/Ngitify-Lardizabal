import React, { useState } from 'react';
import styles from '../../../styles/owner/LeaveRequestForm.module.css';

export default function LeaveRequestForm({ onSubmit }) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ startDate, endDate, reason });
        setStartDate('');
        setEndDate('');
        setReason('');
    };

    return (
        <div className={styles.formContainer}>
            <h3>Submit Leave Request</h3>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="startDate">Start Date</label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="endDate">End Date</label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="reason">Reason</label>
                    <textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows="3"
                        required
                    ></textarea>
                </div>
                <button type="submit" className={styles.submitButton}>Submit Request</button>
            </form>
        </div>
    );
}
