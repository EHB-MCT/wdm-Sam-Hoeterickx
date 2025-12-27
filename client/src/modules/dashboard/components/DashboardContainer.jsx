import React from 'react';

//Components
import { DashboardHeader } from './DashboardHeader';
import { DashboardTabs } from './DashboardTabs';
import { PersonalityProfile } from './PersonalityProfile';
import { CategoryAnalysis } from './CategoryAnalysis';
import { BehaviorAnalysis } from './BehaviorAnalysis';

export const DashboardContainer = ({ user, answerData, decisionData, isLoading, error, getMyData, homeRoute, analysisData, activeTab, setActiveTab }) => {
    if (isLoading) return <p className="dashboard-loading">Gegevens laden...</p>;
    if (error) return <p className="dashboard-error">Fout: {error.message || error}</p>;

    return (
        <div className="dashboard">
            <DashboardHeader user={user} homeRoute={homeRoute} />
            
            {analysisData && (
                <>
                    <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                    
                    <div className="dashboard-content">
                        {activeTab === 'profile' && <PersonalityProfile personalityScores={analysisData.personalityScores} />}
                        {activeTab === 'categories' && <CategoryAnalysis categoryData={analysisData.categoryData} />}
                        {activeTab === 'behavior' && <BehaviorAnalysis scatterData={analysisData.scatterData} />}
                    </div>
                </>
            )}
        </div>
    );
};