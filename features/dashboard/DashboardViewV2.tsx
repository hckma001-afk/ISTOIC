import React from 'react';
import './DashboardViewV2.css';

const DashboardViewV2 = () => {
    return (
        <div className="dashboard-container">
            <div className="grid">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div className="card" key={index}>Card {index + 1}</div>
                ))}
            </div>
        </div>
    );
};

export default DashboardViewV2;
