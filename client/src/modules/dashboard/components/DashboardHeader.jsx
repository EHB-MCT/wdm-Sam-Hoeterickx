import React from 'react';
import { Link } from "react-router-dom";

export const DashboardHeader = ({ user, homeRoute }) => {
    return (
        <header className="dashboard-header">
            <h2 className="dashboard-title">Dashboard</h2>
            <p className="dashboard-welcome">Welkom, {user?.username}</p>
            <Link to={`/${homeRoute.path}`} replace reloadDocument className="dashboard-restart-link">Start Again</Link>
        </header>
    );
};