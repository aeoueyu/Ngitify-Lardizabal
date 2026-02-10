import React, { useState, useRef } from 'react';
import styles from '../../styles/patient/XrayViewer.module.css';
import uploadIcon from '../../assets/button-icons/upload.svg';
import closeIcon from '../../assets/button-icons/close.svg';

const XrayViewer = ({ initialXrays = [], onUpdate }) => {
    const [xrays, setXrays] = useState(initialXrays);
    const [selectedXray, setSelectedXray] = useState(null);
    const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' or 'ai'
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const newXrays = files.map(file => ({
            id: Date.now() + Math.random(),
            url: URL.createObjectURL(file),
            name: file.name,
            date: new Date().toLocaleDateString(),
        }));
        
        const updatedXrays = [...xrays, ...newXrays];
        setXrays(updatedXrays);
        if (onUpdate) {
            onUpdate(updatedXrays);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this X-ray?')) {
            const updatedXrays = xrays.filter(xray => xray.id !== id);
            setXrays(updatedXrays);
            // Close modal if the deleted xray was selected
            if (selectedXray && selectedXray.id === id) {
                setSelectedXray(null);
            }
            if (onUpdate) {
                onUpdate(updatedXrays);
            }
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className={styles.xrayContainer}>
            <div className={styles.header}>
                <h3>X-Ray & Imaging</h3>
                <div className={styles.headerControls}>
                    <button className={styles.uploadButton} onClick={triggerFileInput}>
                        <img src={uploadIcon} alt="Upload" />
                        Upload X-Ray
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                </div>
            </div>

            <div className={styles.tabMenu}>
                <button className={activeTab === 'gallery' ? styles.activeTab : ''} onClick={() => setActiveTab('gallery')}>Image Gallery</button>
                <button className={activeTab === 'ai' ? styles.activeTab : ''} onClick={() => setActiveTab('ai')}>AI Radiology Analysis</button>
            </div>

            <div className={styles.tabContent}>
                {activeTab === 'gallery' && (
                    <div className={styles.gallery}>
                        {xrays.length === 0 ? (
                            <p className={styles.emptyMessage}>No X-rays uploaded yet.</p>
                        ) : (
                            xrays.map(xray => (
                                <div key={xray.id} className={styles.thumbnail} onClick={() => setSelectedXray(xray)}>
                                    <img src={xray.url} alt={xray.name} />
                                    <div className={styles.thumbOverlay}>
                                        <p>{xray.name}</p>
                                        <span>{xray.date}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'ai' && (
                    <div className={styles.aiView}>
                        <div className={styles.sectionHeader}>
                            <h4>AI-Powered X-Ray Analysis</h4>
                            <span className={styles.aiBadge}>AI Confidence: 98%</span>
                        </div>
                        <div className={styles.xrayPlaceholder}>
                            <p>AI analysis requires an uploaded panoramic X-ray.</p>
                            <div className={styles.aiBox} style={{top: '40%', left: '20%', borderColor: '#ef5350'}}><span>Potential Cyst</span></div>
                            <div className={styles.aiBox} style={{top: '60%', right: '15%', borderColor: '#42a5f5'}}><span>Impacted Molar</span></div>
                        </div>
                        <div className={styles.aiFindings}>
                            <p>• <strong>Impacted Tooth #38:</strong> Horizontal impaction detected. Recommend surgical extraction.</p>
                            <p>• <strong>Radiolucency on #46:</strong> Suggestive of a periapical cyst. Recommend CBCT for confirmation.</p>
                        </div>
                    </div>
                )}
            </div>

            {selectedXray && (
                <div className={styles.modal} onClick={() => setSelectedXray(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={() => setSelectedXray(null)}>
                            <img src={closeIcon} alt="Close" />
                        </button>
                        <img src={selectedXray.url} alt={selectedXray.name} className={styles.modalImage} />
                        <div className={styles.modalFooter}>
                            <h4>{selectedXray.name}</h4>
                            <button className={styles.deleteButton} onClick={() => handleDelete(selectedXray.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default XrayViewer;
