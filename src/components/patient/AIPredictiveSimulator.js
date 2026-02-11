import React, { useState } from 'react';
import styles from '../../styles/patient/AIPredictiveSimulator.module.css';

const AIPredictiveSimulator = () => {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [simulatedImage, setSimulatedImage] = useState(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result);
                // Simulate AI processing and show a result after a delay
                setTimeout(() => {
                    setSimulatedImage('/sample-after-braces.png'); // Static simulated image
                }, 1500);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        alert('Simulation saved to your records!');
    };

    const handleDiscard = () => {
        setUploadedImage(null);
        setSimulatedImage(null);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>AI Predictive Outcome Simulator 🦷✨</h1>
            <p className={styles.subtitle}>
                Curious about how braces could transform your smile? Upload a photo of your teeth to see a simulated "after" image.
            </p>

            {!uploadedImage ? (
                <div className={styles.uploadArea}>
                    <h3>Upload Your Current Teeth Photo</h3>
                    <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} />
                    <label htmlFor="imageUpload" className={styles.uploadLabel}>Choose File</label>
                </div>
            ) : (
                <div className={styles.comparisonArea}>
                    <div className={styles.imagePanel}>
                        <h3>Your Photo</h3>
                        <img src={uploadedImage} alt="User uploaded teeth" />
                    </div>
                    <div className={styles.imagePanel}>
                        <h3>Simulated Outcome</h3>
                        {simulatedImage ? (
                            <img src={simulatedImage} alt="Simulated after braces" />
                        ) : (
                            <div className={styles.loading}>
                                <p>Generating simulation...</p>
                                <div className={styles.spinner}></div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {simulatedImage && (
                <div className={styles.actions}>
                    <button onClick={handleSave} className={styles.btn}>Save to My Records</button>
                    <button onClick={handleDiscard} className={`${styles.btn} ${styles.btnDiscard}`}>Discard</button>
                </div>
            )}
        </div>
    );
};

export default AIPredictiveSimulator;
