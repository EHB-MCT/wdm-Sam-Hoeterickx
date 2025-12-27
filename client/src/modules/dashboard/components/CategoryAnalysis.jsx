import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export const CategoryAnalysis = ({ categoryData }) => {
    return (
        <div className="dashboard-chart-wrapper">
            <h3 className="dashboard-content-title">Beslissingstijd & Twijfel per Categorie</h3>
            <div className="dashboard-chart-container">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis yAxisId="left" orientation="left" stroke="#7c3aed" />
                        <YAxis yAxisId="right" orientation="right" stroke="#22c55e" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="avgTime" fill="#7c3aed" name="Gem. Beslissingstijd (s)" />
                        <Bar yAxisId="right" dataKey="avgChanges" fill="#22c55e" name="Gem. Gedachten Veranderd" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};