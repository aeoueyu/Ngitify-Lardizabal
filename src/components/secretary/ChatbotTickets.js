import React, { useState } from 'react';
import styles from '../../styles/secretary/ChatbotTickets.module.css';

const sampleTickets = [
    { id: 1, patient: 'Maria Clara', concern: 'Reschedule appointment', status: 'Pending', timestamp: '2 hours ago' },
    { id: 2, patient: 'Jose Rizal', concern: 'Billing inquiry', status: 'In Progress', timestamp: '1 day ago' },
    { id: 3, patient: 'Andres Bonifacio', concern: 'Pain after procedure', status: 'Resolved', timestamp: '3 days ago' },
];

const ChatbotTickets = () => {
    const [tickets, setTickets] = useState(sampleTickets);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Chatbot Tickets</h1>
            </div>

            <div className={styles.ticketsContainer}>
                {tickets.map(ticket => (
                    <div key={ticket.id} className={styles.ticketCard}>
                        <div className={styles.cardHeader}>
                            <span className={styles.patientName}>{ticket.patient}</span>
                            <span className={`${styles.statusBadge} ${
                                ticket.status === 'Pending' ? styles.pending :
                                ticket.status === 'In Progress' ? styles.inProgress : styles.resolved
                            }`}>
                                {ticket.status}
                            </span>
                        </div>
                        <p className={styles.concern}>{ticket.concern}</p>
                        <div className={styles.cardFooter}>
                            <span className={styles.timestamp}>{ticket.timestamp}</span>
                            <button className={styles.actionButton}>Take Ticket</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatbotTickets;
