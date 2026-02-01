import React, { useEffect, useState, useRef } from 'react'; // Mag-add ng useRef
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../styles/login/LoginPage.module.css'; // Siguraduhin na tama ang path ng styles mo

export default function ActivateAccountPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Verifying your account...');
    const [isSuccess, setIsSuccess] = useState(false);
    
    // ITO ANG SOLUSYON: Ref para ma-track kung natawag na ang API
    const dataFetchedRef = useRef(false);

    useEffect(() => {
        // Kung natawag na, wag na ituloy (Pigil sa double call)
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

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
                    setTimeout(() => navigate('/login'), 3000);
                } else {
                    // Check natin kung activated na pala kahit error (Optional safety check)
                    if (data.message && data.message.includes('Invalid') && !isSuccess) {
                         setStatus('❌ ' + data.message);
                    } else {
                         setStatus('❌ ' + data.message);
                    }
                }
            } catch (error) {
                console.error(error);
                setStatus('❌ Server connection error.');
            }
        };

        if (token) {
            activate();
        }
    }, [token, navigate]); // Tinanggal ko ang isSuccess sa dependency para di mag-loop

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
                textAlign: 'center',
                maxWidth: '400px',
                width: '90%'
            }}>
                <h2 style={{ color: '#005466', marginBottom: '20px' }}>Account Activation</h2>
                
                <p style={{ 
                    fontSize: '16px', 
                    marginBottom: '30px', 
                    color: isSuccess ? 'green' : '#d32f2f',
                    fontWeight: '600'
                }}>
                    {status}
                </p>
                
                {isSuccess && <p style={{color: '#666', fontSize: '14px'}}>Redirecting to login page...</p>}
                
                {/* Manual Button kung sakaling hindi mag-redirect o failed */}
                <button 
                    onClick={() => navigate('/login')}
                    style={{
                        padding: '12px 30px',
                        backgroundColor: '#005466',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        marginTop: '10px'
                    }}
                >
                    Go to Login
                </button>
            </div>
        </div>
    );
}