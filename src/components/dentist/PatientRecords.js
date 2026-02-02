import React, { useState } from 'react';
import styles from '../../styles/dentist/PatientRecords.module.css';

export default function PatientRecords() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('overview'); // Tabs: overview, history, files

    // Mock Patient Data
    const patient = { 
        id: "P-2026-001", 
        name: "Alice Gupta", 
        age: 28,
        gender: "Female",
        lastVisit: "02 Feb 2026",
        allergies: "Penicillin",
        alerts: ["Hypertension", "Anxiety"]
    };

    // Helper: Render Teeth for Odontogram
    const renderTooth = (num, status) => {
        // Status Colors: null (healthy), 'caries' (red), 'filling' (blue), 'missing' (grey)
        let statusColor = 'white';
        let borderColor = '#ddd';
        
        if (status === 'caries') { statusColor = '#ffebee'; borderColor = '#ef5350'; }
        if (status === 'filling') { statusColor = '#e3f2fd'; borderColor = '#42a5f5'; }
        if (status === 'missing') { statusColor = '#eee'; borderColor = '#bdbdbd'; }

        return (
            <div key={num} className={styles.toothContainer}>
                <div className={styles.toothBox} style={{ backgroundColor: statusColor, borderColor: borderColor }}>
                    <span className={styles.toothNum}>{num}</span>
                    <div className={styles.toothShape}></div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerText}>
                    <h1 className={styles.title}>Clinical EMR</h1>
                    <p className={styles.subtitle}>Digital charting, AI diagnostics, and treatment simulation.</p>
                </div>
                <div className={styles.patientBadge}>
                    <div className={styles.pAvatar}>AG</div>
                    <div className={styles.pInfo}>
                        <h3>{patient.name}</h3>
                        <span>ID: {patient.id} | {patient.age}yo</span>
                    </div>
                </div>
            </header>

            <div className={styles.mainGrid}>
                {/* LEFT SIDE: LIST & SEARCH */}
                <div className={styles.listCard}>
                    <div className={styles.listHeader}>
                        <input 
                            type="text" 
                            placeholder="Search Patient..." 
                            className={styles.searchBar} 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className={styles.patientList}>
                        <div className={`${styles.patientItem} ${styles.activeItem}`}>
                            <strong>Alice Gupta</strong>
                            <span>P-2026-001</span>
                        </div>
                        <div className={styles.patientItem}>
                            <strong>Mark Tuan</strong>
                            <span>P-2026-002</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: PATIENT DETAILS */}
                <div className={styles.contentArea}>
                    
                    {/* TABS */}
                    <div className={styles.tabMenu}>
                        <button className={activeTab === 'overview' ? styles.activeTab : ''} onClick={() => setActiveTab('overview')}>Overview & Charting</button>
                        <button className={activeTab === 'radiology' ? styles.activeTab : ''} onClick={() => setActiveTab('radiology')}>AI Radiology</button>
                        <button className={activeTab === 'history' ? styles.activeTab : ''} onClick={() => setActiveTab('history')}>Treatment History</button>
                    </div>

                    {/* TAB CONTENT */}
                    <div className={styles.tabContent}>
                        
                        {/* 1. OVERVIEW & CHARTING */}
                        {activeTab === 'overview' && (
                            <>
                                <div className={styles.alertBox}>
                                    <strong>⚠️ Medical Alerts:</strong> Allergic to {patient.allergies}
                                </div>

                                <div className={styles.chartingView}>
                                    <div className={styles.sectionHeader}>
                                        <h3>Digital Odontogram</h3>
                                        <div className={styles.legend}>
                                            <span style={{color:'#ef5350'}}>● Caries</span>
                                            <span style={{color:'#42a5f5'}}>● Filling</span>
                                            <span style={{color:'#bdbdbd'}}>● Missing</span>
                                        </div>
                                    </div>
                                    
                                    <div className={styles.mouthGrid}>
                                        <div className={styles.archRow}>
                                            {renderTooth(18, null)} {renderTooth(17, null)} {renderTooth(16, 'caries')} {renderTooth(15, null)} 
                                            {renderTooth(14, 'filling')} {renderTooth(13, null)} {renderTooth(12, null)} {renderTooth(11, null)}
                                            <div className={styles.gap}>|</div>
                                            {renderTooth(21, null)} {renderTooth(22, null)} {renderTooth(23, null)} {renderTooth(24, null)} 
                                            {renderTooth(25, null)} {renderTooth(26, 'filling')} {renderTooth(27, null)} {renderTooth(28, 'missing')}
                                        </div>
                                        <div className={styles.archRow}>
                                            {renderTooth(48, 'missing')} {renderTooth(47, null)} {renderTooth(46, null)} {renderTooth(45, null)} 
                                            {renderTooth(44, null)} {renderTooth(43, null)} {renderTooth(42, null)} {renderTooth(41, null)}
                                            <div className={styles.gap}>|</div>
                                            {renderTooth(31, null)} {renderTooth(32, null)} {renderTooth(33, null)} {renderTooth(34, null)} 
                                            {renderTooth(35, 'caries')} {renderTooth(36, null)} {renderTooth(37, null)} {renderTooth(38, null)}
                                        </div>
                                    </div>

                                    <div className={styles.diagnosisBox}>
                                        <h4>Pending Treatments</h4>
                                        <p>• <strong>Tooth #16:</strong> Distal Caries (Needs Composite Filling)</p>
                                        <p>• <strong>Tooth #35:</strong> Buccal Pit Caries</p>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* 2. AI RADIOLOGY */}
                        {activeTab === 'radiology' && (
                            <div className={styles.aiView}>
                                <div className={styles.sectionHeader}>
                                    <h3>AI-Powered X-Ray Analysis</h3>
                                    <span className={styles.aiBadge}>AI Confidence: 98%</span>
                                </div>
                                <div className={styles.xrayPlaceholder}>
                                    [ Panoramic X-Ray Image ]
                                    <div className={styles.aiBox} style={{top: '40%', left: '20%', borderColor: 'red'}}><span>Cyst</span></div>
                                    <div className={styles.aiBox} style={{top: '60%', right: '15%', borderColor: 'blue'}}><span>Impacted</span></div>
                                </div>
                                <div className={styles.aiFindings}>
                                    <p>• <strong>Impacted Tooth #38:</strong> Horizontal impaction detected.</p>
                                    <p>• <strong>Radiolucency on #46:</strong> Suggestive of periapical cyst.</p>
                                </div>
                            </div>
                        )}

                        {/* 3. HISTORY */}
                        {activeTab === 'history' && (
                            <ul className={styles.historyList}>
                                <li>
                                    <div className={styles.hDate}>Feb 02, 2026</div>
                                    <div className={styles.hDetail}>
                                        <h4>Root Canal Treatment (Tooth #14)</h4>
                                        <p>Cleaned and shaped canals. Obturated with Gutta Percha.</p>
                                    </div>
                                    <span className={styles.doneBadge}>Completed</span>
                                </li>
                                <li>
                                    <div className={styles.hDate}>Jan 15, 2026</div>
                                    <div className={styles.hDetail}>
                                        <h4>Comprehensive Exam & Cleaning</h4>
                                        <p>Heavy calculus removed. Prophylaxis done.</p>
                                    </div>
                                    <span className={styles.doneBadge}>Completed</span>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}