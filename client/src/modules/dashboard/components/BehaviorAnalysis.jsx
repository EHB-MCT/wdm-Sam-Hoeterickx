import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';

export const BehaviorAnalysis = ({ scatterData }) => {
    return (
        <div className="dashboard-chart-wrapper">
            <h3 className="dashboard-content-title">Beslissingstijd vs. Aantal Keer van Gedachten Veranderd</h3>
            <div className="dashboard-chart-container">
                <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid />
                        <XAxis type="number" dataKey="x" name="Beslissingstijd (s)" />
                        <YAxis type="number" dataKey="y" name="Keer van gedachten veranderd" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Legend />
                        <Scatter name="Vragen" data={scatterData}>
                            {scatterData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
            <div className="dashboard-behavior-interpretation">
                <p><strong>Interpretatie:</strong> Punten rechtsboven tonen vragen waar je lang nadacht én vaak twijfelde. 
                Punten linksonder tonen snelle, zekere beslissingen.</p>
            </div>
        </div>
    );
};