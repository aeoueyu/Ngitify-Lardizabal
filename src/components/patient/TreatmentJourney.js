import React from 'react';
import styles from '../../styles/patient/TreatmentJourney.module.css';

export default function TreatmentJourney() {
    const journey = [
        { date: "Jan 15, 2026", title: "Initial Consultation", status: "Done" },
        { date: "Feb 02, 2026", title: "Scaling & Polishing", status: "Done" },
        { date: "Feb 10, 2026", title: "Teeth Whitening Session 1", status: "Upcoming" },
        { date: "Feb 24, 2026", title: "Final Checkup & Reveal", status: "Locked" },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>My Treatment Roadmap</h1>
                <p className={styles.subtitle}>Track your progress towards your perfect smile.</p>
            </header>

            <div className={styles.splitView}>
                {/* VISUAL ROADMAP (Simulator Mockup) */}
                <div className={styles.visualCard}>
                    <h3>✨ Your Smile Goal</h3>
                    <div className={styles.imageComparison}>
                        <div className={styles.imgBox}>
                            <span>Before</span>
                            {/* Placeholder color */}
                            <div style={{width:'100%', height:'150px', background:'#eee'}}></div>
                        </div>
                        <div className={styles.arrow}>➜</div>
                        <div className={styles.imgBox}>
                            <span>Target Result</span>
                            <div style={{width:'100%', height:'150px', background:'#e0f2f1'}}></div>
                        </div>
                    </div>
                    <p className={styles.goalText}>Target: 8 Shades Whiter</p>
                </div>

                {/* TIMELINE */}
                <div className={styles.timelineCard}>
                    <div className={styles.timeline}>
                        {journey.map((step, i) => (
                            <div key={i} className={`${styles.step} ${styles[step.status.toLowerCase()]}`}>
                                <div className={styles.marker}></div>
                                <div className={styles.content}>
                                    <span className={styles.date}>{step.date}</span>
                                    <h4>{step.title}</h4>
                                    <span className={styles.statusTag}>{step.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}