import React from 'react';
import { SessionsChart } from './SessionsChart';
import { AnswersChart } from './AnswersChart';
import { ConfidenceChart } from './ConfidenceChart';

export const DashboardCharts = ({ user }) => {
    return (
        <div className="dashboard-charts">
            <div className="chart-container">
                <SessionsChart sessions={user?.userSessions || []} />
            </div>
            <div className="chart-container">
                <AnswersChart answers={user?.answers || []} />
            </div>
            <div className="chart-container chart-container--wide">
                <ConfidenceChart confidenceData={user?.confidenceData || []} />
            </div>
        </div>
    );
};