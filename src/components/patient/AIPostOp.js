import React, { useState } from 'react';
import styles from '../../styles/patient/AIPostOp.module.css';

export default function AIPostOp() {
    const [image, setImage] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setResult(null); // Reset result
            };
            reader.readAsDataURL(file);
        }
    };

    const runAIAnalysis = () => {
        setAnalyzing(true);
        // Simulate AI Delay
        setTimeout(() => {
            setAnalyzing(false);
            setResult({
                status: "Normal Healing",
                message: "Looking good! The clot formation is stable. Slight redness is normal at this stage.",
                advice: "Continue avoiding straws and hot food. Rinse gently with salt water.",
                confidence: "98%"
            });
        }, 2000);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>AI Post-Op Monitoring</h1>
                <p className={styles.subtitle}>Take a photo of your recovery site for instant AI analysis.</p>
            </header>

            <div className={styles.contentCard}>
                <div className={styles.uploadArea}>
                    {image ? (
                        <img src={image} alt="Upload" className={styles.preview} />
                    ) : (
                        <div className={styles.placeholder}>
                            <span style={{fontSize: '40px'}}>📸</span>
                            <p>Tap to Upload Photo</p>
                        </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleUpload} className={styles.fileInput} />
                </div>

                <div className={styles.actionArea}>
                    {!result && (
                        <button 
                            className={styles.analyzeBtn} 
                            onClick={runAIAnalysis} 
                            disabled={!image || analyzing}
                        >
                            {analyzing ? "AI is Analyzing..." : "Analyze Recovery"}
                        </button>
                    )}

                    {result && (
                        <div className={styles.resultBox}>
                            <div className={styles.statusBadge}>✅ {result.status}</div>
                            <p className={styles.aiMessage}>{result.message}</p>
                            <div className={styles.adviceBox}>
                                <strong>💡 AI Tip:</strong> {result.advice}
                            </div>
                            <span className={styles.confidence}>AI Confidence: {result.confidence}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}