import React, { useState, useEffect } from 'react';
import styles from '../../styles/owner/DashboardAlerts.module.css';
import { FaCalendarTimes, FaFileInvoiceDollar, FaBoxOpen } from 'react-icons/fa';

const DashboardAlerts = () => {
    const [alerts, setAlerts] = useState({
        pendingLeaves: [
            { _id: '1', user: { name: { first: 'John', last: 'Doe' } }, startDate: '2026-02-15', endDate: '2026-02-17' }
        ],
        unpaidBills: [
            { _id: '1', patient: { name: { first: 'Jane', last: 'Smith' } }, fee: 5000, procedure: 'Wisdom Tooth Extraction' }
        ],
        lowInventory: [
            { _id: '1', itemName: 'Anesthetics', quantity: 5, unit: 'bottles', reorderLevel: 10 }
        ]
    });
    const [loading, setLoading] = useState(false);



    return (
        <div className={styles.alertsContainer}>
            <h2>Alerts</h2>
            <div className={styles.alertSection}>
                <h3><FaCalendarTimes /> Pending Leave Requests ({alerts.pendingLeaves.length})</h3>
                {alerts.pendingLeaves.length > 0 ? (
                    <ul>
                        {alerts.pendingLeaves.map(leave => (
                            <li key={leave._id}>
                                <span>{leave.user.name.first} {leave.user.name.last} requests leave: {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</span>
                            </li>
                        ))}
                    </ul>
                ) : <p>No pending leave requests.</p>}
            </div>

            <div className={styles.alertSection}>
                <h3><FaFileInvoiceDollar /> Unpaid Bills ({alerts.unpaidBills.length})</h3>
                {alerts.unpaidBills.length > 0 ? (
                    <ul>
                        {alerts.unpaidBills.map(bill => (
                            <li key={bill._id}>
                                <span>Patient: {bill.patient?.name?.first} {bill.patient?.name?.last} - ₱{bill.fee.toLocaleString()} for {bill.procedure}</span>
                            </li>
                        ))}
                    </ul>
                ) : <p>No unpaid bills.</p>}
            </div>

            <div className={styles.alertSection}>
                <h3><FaBoxOpen /> Low Inventory ({alerts.lowInventory.length})</h3>
                {alerts.lowInventory.length > 0 ? (
                    <ul>
                        {alerts.lowInventory.map(item => (
                            <li key={item._id}>
                                <span>{item.itemName} is low ({item.quantity} {item.unit} left). Reorder level is {item.reorderLevel}.</span>
                            </li>
                        ))}
                    </ul>
                ) : <p>Inventory levels are sufficient.</p>}
            </div>
        </div>
    );
};

export default DashboardAlerts;
