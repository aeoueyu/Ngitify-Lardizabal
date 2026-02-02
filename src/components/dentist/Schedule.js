import React from 'react';
import styles from '../../styles/dentist/Schedule.module.css';

export default function Schedule() {
    const weeklyShifts = [
        { day: "Monday", time: "09:00 AM - 05:00 PM", status: "On Duty" },
        { day: "Tuesday", time: "09:00 AM - 05:00 PM", status: "On Duty" },
        { day: "Wednesday", time: "09:00 AM - 05:00 PM", status: "On Duty" },
        { day: "Thursday", time: "OFF", status: "Rest Day" },
        { day: "Friday", time: "09:00 AM - 05:00 PM", status: "On Duty" },
        { day: "Saturday", time: "08:00 AM - 12:00 PM", status: "On Duty" },
        { day: "Sunday", time: "OFF", status: "Rest Day" },
    ];

    const upcomingHolidays = [
        { date: "Feb 25", name: "EDSA Revolution", type: "Special Non-Working" },
        { date: "Apr 09", name: "Araw ng Kagitingan", type: "Regular Holiday" },
    ];

    // MOCK SURGERIES (Appointment Basis Only)
    const todaysSurgeries = [
        { time: "10:00 AM", patient: "John Doe", procedure: "Odontectomy (Impacted #38)", status: "Confirmed" },
        { time: "02:00 PM", patient: "Maria Clara", procedure: "Multiple Extraction", status: "Pending Confirmation" },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerText}>
                    <h1 className={styles.title}>Duty Schedule</h1>
                    <p className={styles.subtitle}>Track your clinical shifts and upcoming surgical appointments.</p>
                </div>
                <button className={styles.requestBtn}>Request Time-Off</button>
            </header>

            <div className={styles.mainGrid}>
                {/* Left Side: Calendar and Holidays */}
                <div className={styles.leftColumn}>
                    <div className={styles.calendarCard}>
                        <div className={styles.calHeader}>
                            <h3>February 2026</h3>
                            <div className={styles.calNav}>
                                <span>&lt;</span>
                                <span>&gt;</span>
                            </div>
                        </div>
                        <div className={styles.calendarPlaceholder}>
                            <div className={styles.calGrid}>
                                {['S','M','T','W','T','F','S'].map(d => <div key={d} className={styles.dayHead}>{d}</div>)}
                                {[...Array(28)].map((_, i) => (
                                    <div key={i} className={`${styles.calDate} ${i+1 === 3 ? styles.today : ''}`}>
                                        {i + 1}
                                        {(i === 1 || i === 2 || i === 8) && <div className={styles.dutyDot}></div>}
                                        {/* Red dot for surgery day example */}
                                        {(i+1 === 3) && <div className={styles.surgeryDot} style={{backgroundColor: '#ef5350', width:'6px', height:'6px', borderRadius:'50%', position:'absolute', bottom:'5px', right:'5px'}}></div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className={styles.legend}>
                            <div className={styles.legendItem}><span className={styles.dotDuty}></span> On Duty</div>
                            <div className={styles.legendItem}><span className={styles.dotHoliday}></span> Holiday</div>
                            <div className={styles.legendItem}><span style={{display:'inline-block', width:'8px', height:'8px', borderRadius:'50%', background:'#ef5350', marginRight:'5px'}}></span> Surgery</div>
                        </div>
                    </div>

                    <div className={styles.holidayCard}>
                        <h3>Upcoming Holidays</h3>
                        <div className={styles.holidayList}>
                            {upcomingHolidays.map((h, i) => (
                                <div key={i} className={styles.holidayItem}>
                                    <div className={styles.hDate}>{h.date}</div>
                                    <div className={styles.hInfo}>
                                        <strong>{h.name}</strong>
                                        <span>{h.type}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Appointments & Roster */}
                <div className={styles.rightColumn}>
                    
                    {/* SURGERY APPOINTMENTS CARD */}
                    <div className={styles.shiftCard} style={{marginBottom: '20px', borderLeft: '5px solid #ef5350'}}>
                        <div style={{marginBottom: '15px'}}>
                            <h3 style={{color: '#c62828', margin: 0}}>Scheduled Surgeries (Today)</h3>
                            <p style={{fontSize: '12px', color: '#888', margin: '5px 0 0 0'}}>*Appointments required for surgeries only.</p>
                        </div>
                        
                        {todaysSurgeries.length > 0 ? (
                            <div className={styles.apptList}>
                                {todaysSurgeries.map((appt, i) => (
                                    <div key={i} className={styles.apptItem}>
                                        <div className={styles.apptTime} style={{color: '#c62828'}}>{appt.time}</div>
                                        <div className={styles.apptInfo}>
                                            <strong>{appt.patient}</strong>
                                            <span>{appt.procedure}</span>
                                        </div>
                                        <span className={styles.statusBadge} style={{
                                            backgroundColor: appt.status === 'Confirmed' ? '#e8f5e9' : '#fff3e0',
                                            color: appt.status === 'Confirmed' ? 'green' : '#ef6c00'
                                        }}>
                                            {appt.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{padding: '20px', textAlign: 'center', color: '#888', background: '#f9f9f9', borderRadius: '8px'}}>
                                No surgeries scheduled for today.
                            </div>
                        )}
                    </div>

                    <div className={styles.shiftCard}>
                        <h3>Weekly Roster</h3>
                        <div className={styles.shiftList}>
                            {weeklyShifts.map((s, i) => (
                                <div key={i} className={styles.shiftItem}>
                                    <div className={styles.dayInfo}>
                                        <strong>{s.day}</strong>
                                        <span>{s.time}</span>
                                    </div>
                                    <span className={s.status === 'On Duty' ? styles.statusOn : styles.statusOff}>
                                        {s.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}