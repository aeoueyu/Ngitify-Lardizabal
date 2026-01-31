import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ActivateAccountPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Verifying your account...');
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const activate = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/activate-account', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus('✅ Success! Account activated.');
                    setIsSuccess(true);
                    // Redirect to login after 3 seconds
                    setTimeout(() => navigate('/login'), 3000);
                } else {
                    setStatus('❌ ' + (data.message || 'Activation failed.'));
                }
            } catch (error) {
                setStatus('❌ Server connection error.');
            }
        };

        if (token) activate();
    }, [token, navigate]);

    return (
        <div style={{ 
            height: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f4f6f8'
        }}>
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                textAlign: 'center'
            }}>
                <h2 style={{ color: '#005466' }}>Account Activation</h2>
                <p style={{ 
                    fontSize: '18px', 
                    margin: '20px 0', 
                    color: isSuccess ? 'green' : '#d32f2f',
                    fontWeight: 'bold'
                }}>
                    {status}
                </p>
                {isSuccess && <p style={{color: '#666'}}>Redirecting to login page...</p>}
                
                {!isSuccess && !status.includes('Verifying') && (
                    <button 
                        onClick={() => navigate('/login')}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#005466',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Go to Login
                    </button>
                )}
            </div>
        </div>
    );
}