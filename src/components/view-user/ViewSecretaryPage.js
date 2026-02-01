import React, { useState, useEffect } from 'react';
import styles from '../../styles/view-user/ViewSecretaryPage.module.css'; // Reuse CSS
import { useNavigate, useParams } from 'react-router-dom';

export default function ViewSecretaryPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [secretary, setSecretary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSecretary = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/user/${id}`);
                const data = await response.json();
                if (response.ok) setSecretary(data);
                else alert("Failed to load secretary data.");
            } catch (error) { console.error("Error:", error); } finally { setLoading(false); }
        };
        fetchSecretary();
    }, [id]);

    if (loading) return <div className={styles.container}>Loading...</div>;
    if (!secretary) return <div className={styles.container}>Secretary not found.</div>;

    const currentAddr = secretary.currentAddress || {};
    const permAddr = secretary.permanentAddress || {};

    const formatAddress = (addr) => {
        return `${addr.street || ''} ${addr.houseNumber || ''}, ${addr.brgy || addr.barangay || ''}, ${addr.city || ''}, ${addr.province || ''}, ${addr.region || ''}`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.profileSection}>
                        <div className={styles.avatarLarge}>
                            {secretary.profileImage ? <img src={secretary.profileImage} alt="Profile" className={styles.profileImg} /> : secretary.name.first[0]}
                        </div>
                        <div className={styles.nameSection}>
                            <h1 className={styles.fullName}>{secretary.name.first} {secretary.name.middle} {secretary.name.last}</h1>
                            <p className={styles.roleLabel}>Secretary</p>
                            <span className={`${styles.statusBadge} ${secretary.isVerified ? styles.active : styles.inactive}`}>
                                {secretary.isVerified ? 'Active' : 'Pending'}
                            </span>
                        </div>
                    </div>
                    <button className={styles.editBtn} onClick={() => navigate(`/owner/edit-secretary/${id}`)}>EDIT PROFILE</button>
                </div>

                <div className={styles.gridContainer}>
                    <div className={styles.infoGroup}>
                        <label>EMAIL ADDRESS</label>
                        <p>{secretary.email}</p>
                    </div>
                    <div className={styles.infoGroup}>
                        <label>PHONE NUMBER</label>
                        <p>{secretary.contactNumber}</p>
                    </div>
                    <div className={styles.infoGroup}>
                        <label>BIRTHDATE</label>
                        <p>{new Date(secretary.birthdate).toLocaleDateString()}</p>
                    </div>
                </div>

                <hr className={styles.divider} />

                <div className={styles.gridContainer}>
                    <div className={styles.infoGroup} style={{gridColumn: '1 / -1'}}>
                        <label>CURRENT ADDRESS</label>
                        <p>{formatAddress(currentAddr)}</p>
                    </div>
                    <div className={styles.infoGroup} style={{gridColumn: '1 / -1'}}>
                        <label>PERMANENT ADDRESS</label>
                        <p>{formatAddress(permAddr)}</p>
                    </div>
                </div>

                <button className={styles.backBtn} onClick={() => navigate('/owner/manage-secretaries')}>Back to List</button>
            </div>
        </div>
    );
}