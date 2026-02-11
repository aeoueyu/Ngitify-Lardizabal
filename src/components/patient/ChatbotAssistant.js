import React, { useState } from 'react';
import styles from '../../styles/patient/ChatbotAssistant.module.css';

const ChatbotAssistant = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: 'Hello! How can I assist you today? You can ask about billing, appointments, or our new AI Predictive Simulator.', sender: 'bot' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
            const newMessages = [...messages, { id: Date.now(), text: input, sender: 'user' }];
            setMessages(newMessages);
            setInput('');
            // Simulate bot response
            setTimeout(() => {
                setMessages(prev => [...prev, { id: Date.now() + 1, text: 'This is a static response. For a real conversation, this chatbot would be connected to a backend service.', sender: 'bot' }]);
            }, 1000);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Chatbot Assistant 🤖</h1>
            <div className={styles.chatWindow}>
                <div className={styles.messageList}>
                    {messages.map(msg => (
                        <div key={msg.id} className={`${styles.message} ${styles[msg.sender]}`}>
                            {msg.text}
                        </div>
                    ))}
                </div>
                <div className={styles.chatInput}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message here..."
                    />
                    <button onClick={handleSend}>Send</button>
                </div>
            </div>
            <div className={styles.infoPanel}>
                <h3>Try our AI Simulator!</h3>
                <p>Curious about how your teeth could look after braces? Upload a photo of your teeth, and our AI will generate a simulation.</p>
                <button className={styles.infoBtn}>Trigger AI Simulation</button>
                <h3>Need more help?</h3>
                <p>If the chatbot can't resolve your issue, you can escalate to a secretary who will create a support ticket.</p>
                <button className={styles.infoBtn}>Escalate to Secretary</button>
            </div>
        </div>
    );
};

export default ChatbotAssistant;
