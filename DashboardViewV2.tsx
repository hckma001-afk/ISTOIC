import React, { useState } from 'react';
import './DashboardViewV2.css'; // Assuming there is a CSS file for styles

const DashboardViewV2 = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isGridView, setGridView] = useState(true);

    const toggleModal = () => setModalOpen(!isModalOpen);
    const toggleView = () => setGridView(!isGridView);

    return (
        <div className={`dashboard ${isGridView ? 'grid-view' : 'card-view'}`}> 
            <header className="dashboard-header">
                <h1>Dashboard</h1>
                <button onClick={toggleView} className="toggle-view-btn">Toggle View</button>
                <button onClick={toggleModal} className="modal-btn">Open Modal</button>
            </header>
            <div className={`content-container ${isGridView ? 'bento-grid' : 'list-view'}`}>  
                {/* Example of gradient cards */}
                {[1, 2, 3, 4].map((item) => (
                    <div className="gradient-card" key={item}>
                        <h2>Card {item}</h2>
                    </div>
                ))}
            </div>
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={toggleModal}>&times;</span>
                        <p>This is a modal!</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardViewV2;