import React, { useState } from 'react';
import styles from '../../styles/patient/PatientDashboard.module.css';
import { useNavigate } from 'react-router-dom';

export default function PatientDashboard() {
    const navigate = useNavigate();

    // MOCK DATA: Patient Health Status
    const patientStatus = {
        name: "Alice",
        lastVisitDays: 12, // Subukan mong baguhin ito sa > 180 (6 months) para makita ang "Sad" avatar
        nextAppt: "Feb 10, 2026 (Cleaning)",
        streak: 5 // Days of brushing logged
    };

    // Avatar Logic
    const isHealthy = patientStatus.lastVisitDays < 180;
    const avatarMood = isHealthy ? "Happy" : "Sad";
    const avatarMessage = isHealthy 
        ? "I feel fresh and shiny! Thanks for taking care of me! ✨" 
        : "I feel a bit icky... We haven't seen the dentist in a while. 🦠";

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Hello, {patientStatus.name}!</h1>
                    <p className={styles.subtitle}>Welcome to your personal dental hub.</p>
                </div>
                <div className={styles.streakBadge}>🔥 {patientStatus.streak} Day Streak</div>
            </header>

            <div className={styles.mainGrid}>
                {/* GAMIFIED AVATAR CARD */}
                <div className={`${styles.avatarCard} ${isHealthy ? styles.bgHappy : styles.bgSad}`}>
                    <div className={styles.avatarWrapper}>
                        {/* Placeholder for Animated Tooth SVG/GIF */}
                        <div className={styles.toothCharacter}>
                            {isHealthy ? '🦷✨😎' : '🦷🤢🪰'}
                        </div>
                    </div>
                    <div className={styles.avatarText}>
                        <h2>My Tooth Buddy</h2>
                        <p>"{avatarMessage}"</p>
                        {!isHealthy && <button className={styles.bookBtn}>Book a Cleaning Now</button>}
                    </div>
                </div>

                {/* QUICK ACTIONS */}
                <div className={styles.actionsGrid}>
                    <div className={styles.actionCard} onClick={() => navigate('/patient/aipost-op')}>
                        <div className={styles.iconBox}>📸</div>
                        <h3>AI Checkup</h3>
                        <p>Scan your teeth</p>
                    </div>
                    <div className={styles.actionCard} onClick={() => navigate('/patient/treatment-journey')}>
                        <div className={styles.iconBox}>🗺️</div>
                        <h3>My Journey</h3>
                        <p>Track progress</p>
                    </div>
                    <div className={styles.actionCard} onClick={() => navigate('/patient/my-finances')}>
                        <div className={styles.iconBox}>🧾</div>
                        <h3>Invoices</h3>
                        <p>View receipts</p>
                    </div>
                </div>
            </div>

            {/* UPCOMING APPOINTMENT */}
            <div className={styles.apptBanner}>
                <div className={styles.apptInfo}>
                    <span className={styles.label}>Next Appointment</span>
                    <strong>{patientStatus.nextAppt}</strong>
                </div>
                <button className={styles.reschedBtn}>Reschedule</button>
            </div>
        </div>
    );
}