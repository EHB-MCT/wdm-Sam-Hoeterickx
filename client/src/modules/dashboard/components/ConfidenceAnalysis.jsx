import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export const ConfidenceAnalysis = ({ confidenceStats }) => {
    return (
        <div className="dashboard-chart-wrapper">
            <h3 className="dashboard-content-title">Confidence & Zekerheid Analyse</h3>
            
            {/* Bar Chart: Verdeling Zekerheid */}
            <div className="dashboard-chart-container" style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>
                    Verdeling Zekerheid
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={confidenceStats.distribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#7c3aed" name="Aantal" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Bar Chart: Decision Time Vergelijking */}
            <div className="dashboard-chart-container" style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>
                    Beslissingstijd: Zeker vs Onzeker
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={confidenceStats.timeComparison}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="avgTime" fill="#7c3aed" name="Gem. Beslissingstijd (s)" />
                    </BarChart>
                </ResponsiveContainer>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                    <strong>Insight:</strong> {confidenceStats.timeComparison[0]?.avgTime > confidenceStats.timeComparison[1]?.avgTime 
                        ? 'Je neemt meer tijd bij beslissingen waar je zeker over bent - dit kan wijzen op zorgvuldige overweging.'
                        : 'Je neemt meer tijd bij beslissingen waar je onzeker over bent - normaal twijfelgedrag.'}
                </p>
            </div>

            {/* Stats Cards */}
            <div className="dashboard-score-grid">
                <div className="dashboard-score-card">
                    <div className="dashboard-score-card-title">Totaal Checks</div>
                    <div className="dashboard-score-card-value">{confidenceStats.totalChecks}</div>
                </div>
                <div className="dashboard-score-card">
                    <div className="dashboard-score-card-title">Zekerheid Score</div>
                    <div className="dashboard-score-card-value">
                        {confidenceStats.confidencePercentage}%
                    </div>
                </div>
                <div className="dashboard-score-card">
                    <div className="dashboard-score-card-title">Gem. Beslissingstijd</div>
                    <div className="dashboard-score-card-value">
                        {confidenceStats.avgDecisionTime}s
                    </div>
                </div>
            </div>

            <div className="dashboard-behavior-interpretation" style={{ marginTop: '1rem' }}>
                <p><strong>Interpretatie:</strong> Een hogere zekerheid score suggereert dat je over het algemeen 
                vertrouwen hebt in je beslissingen. Langere beslissingstijden bij onzekerheid zijn normaal en 
                tonen dat je zorgvuldig nadenkt.</p>
            </div>
        </div>
    );
};