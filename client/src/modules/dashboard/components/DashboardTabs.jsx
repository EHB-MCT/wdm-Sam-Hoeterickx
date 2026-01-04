import React from 'react';

export const DashboardTabs = ({ activeTab, setActiveTab }) => {
    return (
        <div className="dashboard-tabs">
            <button
                onClick={() => setActiveTab('profile')}
                className={`dashboard-tab ${activeTab === 'profile' ? 'dashboard-tab--active' : ''}`}
            >
                Persoonlijkheidsprofiel
            </button>
            <button
                onClick={() => setActiveTab('categories')}
                className={`dashboard-tab ${activeTab === 'categories' ? 'dashboard-tab--active' : ''}`}
            >
                Per Categorie
            </button>
            <button
                onClick={() => setActiveTab('behavior')}
                className={`dashboard-tab ${activeTab === 'behavior' ? 'dashboard-tab--active' : ''}`}
            >
                Beslissingsgedrag
            </button>
            <button
                onClick={() => setActiveTab('confidence')}
                className={`dashboard-tab ${activeTab === 'confidence' ? 'dashboard-tab--active' : ''}`}
            >
                Zekerheid
            </button>
        </div>
    );
};