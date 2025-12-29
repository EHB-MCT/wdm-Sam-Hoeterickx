import { useEffect, useState } from "react";
import { LayoutDashboard, Map, Users, Activity } from 'lucide-react';
import { useGetAllData } from "../../../shared/hooks/index.js";
import { DashboardHeader } from "../../dashboard/components/DashboardHeader.jsx";
import { LogoutButton } from "../../../shared/components/index.js";

// Components
import { BrowserDataVisual } from "../components/BrowserDataVisual.jsx";
import { GeoLocationVisual } from "../components/GeoLocationVisual.jsx";

export const AdminDashboard = () => {
    // We slaan de volledige response op, plus specifieke shortcuts
    const [fullData, setFullData] = useState(null);
    const [geoLocationData, setGeoLocationData] = useState([]);
    const [browserData, setBrowserData] = useState([]);
    const [activeTab, setActiveTab] = useState('browser');

    const { collectData, isLoading, error } = useGetAllData();

    useEffect(() => {
        document.title = 'WDM | Admin Dashboard';
        const fetchData = async () => {
            const response = await collectData();
            if (response && response.data) {
                setFullData(response.data);
                setBrowserData(response.data.browserData || []);
                setGeoLocationData(response.data.geoLocationData || []);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-500">
                <Activity className="w-8 h-8 animate-spin mr-2 text-blue-600" />
                Data ophalen...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50 text-red-500">
                Er is een fout opgetreden bij het laden van de data.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <DashboardHeader user={{ name: 'Admin' }} homeRoute="/" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                {/* Tab Navigation Card */}
                <div className="admin-dashboard-tabs">
                    <button
                        onClick={() => setActiveTab('browser')}
                        className={`dashboard-tab--large ${
                            activeTab === 'browser' ? 'dashboard-tab--active' : ''
                        }`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Browser Analytics
                    </button>
                    
                    <button
                        onClick={() => setActiveTab('location')}
                        className={`dashboard-tab--large ${
                            activeTab === 'location' ? 'dashboard-tab--active' : ''
                        }`}
                    >
                        <Map className="w-5 h-5" />
                        Locatie Heatmap
                    </button>
                    
                </div>

                {/* Tab Content Area */}
                <div className="admin-dashboard-content">
                    {activeTab === 'browser' && (
                        <BrowserDataVisual browserData={browserData} />
                    )}
                    
                    {activeTab === 'location' && (
                        <GeoLocationVisual geoLocationData={geoLocationData} />
                    )}
                </div>

                <div className="mt-8 flex justify-end">
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
};