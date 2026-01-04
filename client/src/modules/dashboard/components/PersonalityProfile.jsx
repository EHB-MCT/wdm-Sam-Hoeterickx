import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

export const PersonalityProfile = ({ personalityScores }) => {
    return (
        <div className="dashboard-chart-wrapper">
            <h3 className="dashboard-content-title">Jouw Persoonlijkheidsprofiel</h3>
            <p>Dit is een verzameling van alle antwoorden ook uit voorgaande sessies</p>
            <div className="dashboard-chart-container">
                <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={personalityScores}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="trait" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar name="Score" dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.6} />
                        <Tooltip />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
            <div className="dashboard-score-grid">
                {personalityScores.map(item => (
                    <div key={item.trait} className="dashboard-score-card">
                        <div className="dashboard-score-card-title">{item.trait}</div>
                        <div className="dashboard-score-card-value">{item.value}%</div>
                    </div>
                ))}
            </div>
        </div>
    );
};