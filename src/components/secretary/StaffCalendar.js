import React from 'react';
import styles from '../../styles/secretary/StaffCalendar.module.css';

const sampleEvents = [
    { day: 3, staff: 'Dr. Reyes', status: 'on-duty' },
    { day: 3, staff: 'Sec. Anna', status: 'on-duty' },
    { day: 4, staff: 'Dr. Santos', status: 'on-duty' },
    { day: 5, staff: 'Dr. Reyes', status: 'leave' },
    { day: 12, staff: 'National Heroes Day', status: 'holiday' },
    { day: 17, staff: 'Dr. Santos', status: 'on-duty' },
    { day: 18, staff: 'Sec. Anna', status: 'leave' },
];

const StaffCalendar = () => {
    const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Staff Calendar</h1>
                <div className={styles.legend}>
                    <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.onDuty}`}></span> On Duty</div>
                    <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.leave}`}></span> Leave</div>
                    <div className={styles.legendItem}><span className={`${styles.legendDot} ${styles.holiday}`}></span> Holiday</div>
                </div>
            </div>
            <div className={styles.calendarGrid}>
                {daysInMonth.map(day => (
                    <div key={day} className={styles.calendarDay}>
                        <div className={styles.dayNumber}>{day}</div>
                        <div className={styles.events}>
                            {sampleEvents.filter(e => e.day === day).map((event, index) => (
                                <div key={index} className={`${styles.event} ${styles[event.status.replace('-', '')]}`}>
                                    {event.staff}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StaffCalendar;
