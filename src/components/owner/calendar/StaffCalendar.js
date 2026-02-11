import React, { useState } from 'react';
import styles from '../../../styles/owner/Calendar.module.css';
import LeaveRequestForm from './LeaveRequestForm';
import LeaveRequestSidebar from './LeaveRequestSidebar';

const sampleShifts = {
    '2024-02-12': { type: 'leave', staff: 'Dr. Reyes' },
    '2024-02-13': { type: 'leave', staff: 'Dr. Reyes' },
    '2024-02-14': { type: 'leave', staff: 'Dr. Reyes' },
    '2024-02-25': { type: 'holiday', name: 'People Power Anniversary' },
};

const generateCalendarDays = (date) => {
    const days = [];
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    for (let i = 0; i < firstDay.getDay(); i++) {
        days.push(<div key={`empty-${i}`} className={`${styles.day} ${styles.empty}`}></div>);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
        const dayDate = new Date(date.getFullYear(), date.getMonth(), i);
        const dateString = dayDate.toISOString().split('T')[0];
        const shift = sampleShifts[dateString];
        
        let dayClass = styles.day;
        if (shift) {
            dayClass = `${styles.day} ${styles[shift.type]}`;
        }

        days.push(
            <div key={i} className={dayClass}>
                <span>{i}</span>
                {shift && <div className={styles.shiftInfo}>{shift.name || shift.staff}</div>}
            </div>
        );
    }

    return days;
};

export default function StaffCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleLeaveSubmit = (leaveData) => {
        console.log('Leave Request Submitted:', leaveData);
        // Here you would typically handle the leave request, e.g., send to a server
    };

    const handleApprove = (id) => {
        console.log('Approved leave request:', id);
    };

    const handleDeny = (id) => {
        console.log('Denied leave request:', id);
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.titleSection}>
                    <h1 className={styles.pageTitle}>Staff Calendar</h1>
                    <p className={styles.subTitle}>View and manage staff shifts, holidays, and leaves.</p>
                </div>
            </div>
            <div className={styles.mainContent}>
                <div className={styles.calendarWrapper}>
                    <div className={styles.calendarContainer}>
                        <div className={styles.calendarHeader}>
                            <button onClick={handlePrevMonth}>&lt;</button>
                            <h2>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                            <button onClick={handleNextMonth}>&gt;</button>
                        </div>
                        <div className={styles.calendarGrid}>
                            <div className={styles.dayName}>Sun</div>
                            <div className={styles.dayName}>Mon</div>
                            <div className={styles.dayName}>Tue</div>
                            <div className={styles.dayName}>Wed</div>
                            <div className={styles.dayName}>Thu</div>
                            <div className={styles.dayName}>Fri</div>
                            <div className={styles.dayName}>Sat</div>
                            {generateCalendarDays(currentDate)}
                        </div>
                    </div>
                    <LeaveRequestForm onSubmit={handleLeaveSubmit} />
                </div>
                <div className={styles.sidebarWrapper}>
                    <LeaveRequestSidebar onApprove={handleApprove} onDeny={handleDeny} />
                </div>
            </div>
        </div>
    );
}
