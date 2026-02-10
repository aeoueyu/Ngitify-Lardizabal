import React, { useState, useCallback } from 'react';
import styles from '../../styles/patient/Odontogram.module.css';

const initialTeeth = {
    18: { id: 18, status: 'healthy' }, 17: { id: 17, status: 'healthy' }, 16: { id: 16, status: 'healthy' }, 15: { id: 15, status: 'healthy' }, 14: { id: 14, status: 'healthy' }, 13: { id: 13, status: 'healthy' }, 12: { id: 12, status: 'healthy' }, 11: { id: 11, status: 'healthy' },
    21: { id: 21, status: 'healthy' }, 22: { id: 22, status: 'healthy' }, 23: { id: 23, status: 'healthy' }, 24: { id: 24, status: 'healthy' }, 25: { id: 25, status: 'healthy' }, 26: { id: 26, status: 'healthy' }, 27: { id: 27, status: 'healthy' }, 28: { id: 28, status: 'healthy' },
    48: { id: 48, status: 'healthy' }, 47: { id: 47, status: 'healthy' }, 46: { id: 46, status: 'healthy' }, 45: { id: 45, status: 'healthy' }, 44: { id: 44, status: 'healthy' }, 43: { id: 43, status: 'healthy' }, 42: { id: 42, status: 'healthy' }, 41: { id: 41, status: 'healthy' },
    31: { id: 31, status: 'healthy' }, 32: { id: 32, status: 'healthy' }, 33: { id: 33, status: 'healthy' }, 34: { id: 34, status: 'healthy' }, 35: { id: 35, status: 'healthy' }, 36: { id: 36, status: 'healthy' }, 37: { id: 37, status: 'healthy' }, 38: { id: 38, status: 'healthy' },
};

const conditions = {
    'healthy': { name: 'Healthy', color: 'white', borderColor: '#ddd' },
    'caries': { name: 'Caries', color: '#ffebee', borderColor: '#ef5350' },
    'filling': { name: 'Filling', color: '#e3f2fd', borderColor: '#42a5f5' },
    'missing': { name: 'Missing', color: '#eee', borderColor: '#bdbdbd' },
    'crown': { name: 'Crown', color: '#fffde7', borderColor: '#fdd835' },
};

const Tooth = ({ id, status, onClick }) => {
    const { color, borderColor } = conditions[status] || conditions['healthy'];
    return (
        <div className={styles.toothContainer} onClick={() => onClick(id)}>
            <div className={styles.toothBox} style={{ backgroundColor: color, borderColor: borderColor }}>
                <span className={styles.toothNum}>{id}</span>
                <div className={styles.toothShape}></div>
            </div>
        </div>
    );
};

const Odontogram = ({ patientData, onUpdate }) => {
    const [teeth, setTeeth] = useState(patientData || initialTeeth);
    const [selectedCondition, setSelectedCondition] = useState('caries');

    const handleToothClick = useCallback((toothId) => {
        const currentTooth = teeth[toothId];
        const newStatus = currentTooth.status === selectedCondition ? 'healthy' : selectedCondition;
        
        const updatedTeeth = {
            ...teeth,
            [toothId]: { ...currentTooth, status: newStatus }
        };
        
        setTeeth(updatedTeeth);
        if (onUpdate) {
            onUpdate(updatedTeeth);
        }
    }, [teeth, selectedCondition, onUpdate]);

    const getPendingTreatments = () => {
        return Object.values(teeth).filter(tooth => tooth.status === 'caries');
    };

    const maxillaryRight = [18, 17, 16, 15, 14, 13, 12, 11];
    const maxillaryLeft = [21, 22, 23, 24, 25, 26, 27, 28];
    const mandibularRight = [48, 47, 46, 45, 44, 43, 42, 41];
    const mandibularLeft = [31, 32, 33, 34, 35, 36, 37, 38];
    const pendingTreatments = getPendingTreatments();

    return (
        <div className={styles.chartingView}>
            <div className={styles.sectionHeader}>
                <h3>Digital Odontogram</h3>
                <div className={styles.legend}>
                    {Object.entries(conditions).map(([key, { name, borderColor }]) => (
                        key !== 'healthy' && <span key={key} style={{ color: borderColor }}>● {name}</span>
                    ))}
                </div>
            </div>

            <div className={styles.palette}>
                {Object.entries(conditions).map(([id, { name, color, borderColor }]) => (
                    <button
                        key={id}
                        className={`${styles.paletteButton} ${selectedCondition === id ? styles.active : ''}`}
                        style={{ backgroundColor: color, borderColor: borderColor, color: id === 'healthy' || id === 'missing' ? '#333' : borderColor }}
                        onClick={() => setSelectedCondition(id)}
                    >
                        {name}
                    </button>
                ))}
            </div>
            
            <div className={styles.mouthGrid}>
                <div className={styles.archRow}>
                    {maxillaryRight.map(id => <Tooth key={id} id={id} status={teeth[id]?.status || 'healthy'} onClick={handleToothClick} />)}
                    <div className={styles.gap}>|</div>
                    {maxillaryLeft.map(id => <Tooth key={id} id={id} status={teeth[id]?.status || 'healthy'} onClick={handleToothClick} />)}
                </div>
                <div className={styles.archRow}>
                    {mandibularRight.map(id => <Tooth key={id} id={id} status={teeth[id]?.status || 'healthy'} onClick={handleToothClick} />)}
                    <div className={styles.gap}>|</div>
                    {mandibularLeft.map(id => <Tooth key={id} id={id} status={teeth[id]?.status || 'healthy'} onClick={handleToothClick} />)}
                </div>
            </div>

            {pendingTreatments.length > 0 && (
                <div className={styles.diagnosisBox}>
                    <h4>Pending Treatments</h4>
                    {pendingTreatments.map(tooth => (
                        <p key={tooth.id}>• <strong>Tooth #{tooth.id}:</strong> Caries detected. Needs evaluation.</p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Odontogram;
