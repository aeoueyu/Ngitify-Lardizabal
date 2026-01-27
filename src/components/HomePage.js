import React from "react";
import '../styles/HomePage.css';

export default function HomePage() {
    const today = new Date();
    const day = today.toLocaleDateString('en-US' , { weekday: 'long' });
    const date = today.toLocaleDateString('en-GB' , {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div>
            <p className="hometext">Home</p>
            <div className="date">
                <p className="date-day">{day}, </p>
                <p>{date}</p>
            </div>
        </div>
    );
}