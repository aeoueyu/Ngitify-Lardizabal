import React from 'react';
// Sidebar is handled by the Layout in App.js, so content lang to
export default function OwnerDashboard() {
    return (
        <div style={{ padding: '40px' }}>
            <h1 style={{ color: '#005466' }}>Welcome back, Owner!</h1>
            <p>This is your dashboard. Check 'Settings' to update your profile.</p>
        </div>
    );
}