import React from 'react';
import styles from '../../../styles/owner/LeaveRequestSidebar.module.css';

const sampleLeaveRequests = [
    { id: 1, staff: 'Dr. Reyes', startDate: '2024-02-12', endDate: '2024-02-14', reason: 'Personal leave' },
    { id: 2, staff: 'Nurse Ana', startDate: '2024-03-01', endDate: '2024-03-02', reason: 'Family matter' },
];

export default function LeaveRequestSidebar({ onApprove, onDeny }) {
    return (
        <div className={styles.sidebarContainer}>
            <h3>Leave Requests</h3>
            {sampleLeaveRequests.length === 0 ? (
                <p className={styles.noRequests}>No pending requests.</p>
            ) : (
                <ul className={styles.requestList}>
                    {sampleLeaveRequests.map(request => (
                        <li key={request.id} className={styles.requestItem}>
                            <div className={styles.requestInfo}>
                                <strong>{request.staff}</strong>
                                <span>{request.startDate} to {request.endDate}</span>
                                <p>{request.reason}</p>
                            </div>
                            <div className={styles.actionButtons}>
                                <button onClick={() => onApprove(request.id)} className={styles.approveButton}>Approve</button>
                                <button onClick={() => onDeny(request.id)} className={styles.denyButton}>Deny</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
