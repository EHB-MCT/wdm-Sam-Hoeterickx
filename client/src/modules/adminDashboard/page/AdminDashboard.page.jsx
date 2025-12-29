import { useEffect, useState } from "react";
import { BrowserDataVisual } from "../components/BrowserDataVisual.jsx";
import { useGetAllData } from "../../../shared/hooks/index.js";
import { DashboardHeader } from "../../dashboard/components/DashboardHeader.jsx";
import { LogoutButton } from "../../../shared/components/index.js";
import { GeoLocationVisual } from "../components/GeoLocationVisual.jsx";

export const AdminDashboard = () => {
    const [data, setData] = useState();
    const [geoLocationData, setGeoLocationData] = useState();
    const [browserData, setBrowserData] = useState();
    const [sessionData, setSessionData] = useState();
    const [activeTab, setActiveTab] = useState('browser');

    const { collectData, isLoading, error } = useGetAllData();

    useEffect(() => {
        document.title = 'WDM | Admin Dashboard';
        const fetchData = async () => {
            const data = await collectData();
            if (data) {
                console.log(data);
                setData(data);
                setBrowserData(data.data.browserData);
                setGeoLocationData(data.data.geoLocationData)
            }
        };
        fetchData();
    }, []);

    return (
        <div className="dashboard">
            <DashboardHeader user={{ name: 'Admin' }} homeRoute="/" />
            
            {/* Tab Navigation */}
            <div className="admin-dashboard-tabs">
                <button
                    onClick={() => setActiveTab('browser')}
                    className={`dashboard-tab dashboard-tab--large ${
                        activeTab === 'browser' ? 'dashboard-tab--active' : ''
                    }`}
                >
                    Browser Analytics
                </button>
                <button
                    onClick={() => setActiveTab('location')}
                    className={`dashboard-tab dashboard-tab--large ${
                        activeTab === 'location' ? 'dashboard-tab--active' : ''
                    }`}
                >
                    Locatie Heatmap
                </button>
            </div>

            {/* Tab Content */}
            <div className="admin-dashboard-content">
                {activeTab === 'browser' && (
                    <BrowserDataVisual browserData={browserData} />
                )}
                {activeTab === 'location' && (
                    <GeoLocationVisual geoLocationData={geoLocationData} />
                )}
            </div>
            
            <LogoutButton />
        </div>
    );
};