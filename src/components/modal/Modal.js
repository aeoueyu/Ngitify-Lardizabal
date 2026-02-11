import React from 'react';
import styles from '../../styles/modal/Modal.module.css';

const Modal = ({ icon, title, body, primaryButtonText, secondaryButtonText, onPrimaryClick, onSecondaryClick, onClose, modalType }) => {
    const primaryButtonClass = `${styles.primaryButton} ${modalType ? styles[modalType] : ''}`;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {icon && <img src={icon} alt="icon" className={styles.modalIcon} />}
                <h2 className={styles.modalTitle}>{title}</h2>
                <p className={styles.modalMessage}>{body}</p>
                <div className={styles.modalActions}>
                    {secondaryButtonText && <button onClick={onSecondaryClick} className={styles.secondaryButton}>{secondaryButtonText}</button>}
                    <button onClick={onPrimaryClick} className={primaryButtonClass}>{primaryButtonText}</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
