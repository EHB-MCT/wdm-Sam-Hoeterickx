import { useEffect, useState } from "react";
import { LayoutDashboard, Map, Users, Activity } from 'lucide-react';
import { useGetAllData } from "../../../shared/hooks/index.js";
import { DashboardHeader } from "../../dashboard/components/DashboardHeader.jsx";
import { LogoutButton } from "../../../shared/components/index.js";

// Components
import { BrowserDataVisual } from "../components/BrowserDataVisual.jsx";
import { GeoLocationVisual } from "../components/GeoLocationVisual.jsx";
import { UserExplorer } from "../components/UserExplorer.jsx";

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
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 mb-6 inline-flex flex-wrap gap-2">
                    <button
                        onClick={() => setActiveTab('browser')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            activeTab === 'browser' 
                                ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Browser Analytics
                    </button>
                    
                    <button
                        onClick={() => setActiveTab('location')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            activeTab === 'location' 
                                ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <Map className="w-4 h-4" />
                        Locatie Heatmap
                    </button>

                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            activeTab === 'users' 
                                ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <Users className="w-4 h-4" />
                        Gebruikers Explorer
                    </button>
                </div>

                {/* Tab Content Area */}
                <div className="transition-opacity duration-200">
                    {activeTab === 'browser' && (
                        <BrowserDataVisual browserData={browserData} />
                    )}
                    
                    {activeTab === 'location' && (
                        <GeoLocationVisual geoLocationData={geoLocationData} />
                    )}
                    
                    {/* UserExplorer gebruikt nu eigen data via nieuwe hook */}
                    {activeTab === 'users' && (
                        <UserExplorer />
                    )}
                </div>

                <div className="mt-8 flex justify-end">
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
};