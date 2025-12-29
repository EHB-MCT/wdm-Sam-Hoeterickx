import { useEffect, useState } from "react"
import { useGetAllSessionsPerUser, useQuestions } from "../../../shared/hooks"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import '~styles/UserExplorer.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const UserExplorer = () => {
    const { collectSessionData, isLoading, isError, error, data } = useGetAllSessionsPerUser();
    const [expandedUsers, setExpandedUsers] = useState(new Set());

    const { questionList } = useQuestions();

    useEffect(() => {
        collectSessionData();
    }, [collectSessionData]);

    const toggleUserExpansion = (userId) => {
        const newExpanded = new Set(expandedUsers);
        if (newExpanded.has(userId)) {
            newExpanded.delete(userId);
        } else {
            newExpanded.add(userId);
        }
        setExpandedUsers(newExpanded);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    if (isLoading) {
        return (
            <div className="user-explorer">
                <div className="loading">Loading user data...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="user-explorer">
                <div className="error">
                    Error loading data: {error?.message || 'Unknown error'}
                </div>
            </div>
        );
    }

    if (!data || !data.usersWithSessions || data.usersWithSessions.length === 0) {
        return (
            <div className="user-explorer">
                <h2>User Explorer</h2>
                <div className="no-data">No user data available</div>
            </div>
        );
    }

    return (
        <div className="user-explorer">
            <div className="user-explorer-header">
                <h2>User Explorer</h2>
                <div className="stats">
                    <span className="stat">
                        <strong>{data.totalUsers}</strong> Users
                    </span>
                    <span className="stat">
                        <strong>{data.totalSessions}</strong> Total Sessions
                    </span>
                </div>
            </div>

            <div className="users-list">
                {data.usersWithSessions.map((user) => (
                    <div key={user.userId} className="user-card">
                        <div 
                            className="user-header"
                            onClick={() => toggleUserExpansion(user.userId)}
                        >
                            <div className="user-info">
                                <h3>{user.username}</h3>
                                <p>{user.email}</p>
                                <span className="role-badge">{user.role}</span>
                            </div>
                            <div className="user-stats">
                                <div className="stat-item">
                                    <span className="stat-value">{user.totalSessions}</span>
                                    <span className="stat-label">Sessions</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{user.totalAnswers}</span>
                                    <span className="stat-label">Answers</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{user.totalLocations}</span>
                                    <span className="stat-label">Locations</span>
                                </div>
                            </div>
                            <div className="expand-icon">
                                {expandedUsers.has(user.userId) ? '▼' : '▶'}
                            </div>
                        </div>

                        {expandedUsers.has(user.userId) && (
                            <div className="user-details">
                                <div className="user-meta">
                                    <p><strong>Member since:</strong> {formatDate(user.createdAt)}</p>
                                </div>

                                <div className="sessions-container">
                                    <h4>Sessions ({user.sessions.length})</h4>
                                    {user.sessions.map((session, index) => (
                                        <div key={index} className="session-card">
                                            <div className="session-header">
                                                <div className="session-info">
                                                    <span className="session-id">Session: {session.sessionId?.slice(0, 8)}...</span>
                                                    <span className="browser-info">{session.browser} - {session.deviceType}</span>
                                                </div>
                                            </div>

                                            <div className="session-details">
                                                <>
                                                <div className="session-grid">
                                                    <div className="detail-item">
                                                        <strong>Browser:</strong> {session.browser}
                                                    </div>
                                                    <div className="detail-item">
                                                        <strong>Platform:</strong> {session.platform}
                                                    </div>
                                                    <div className="detail-item">
                                                        <strong>Device:</strong> {session.deviceType}
                                                    </div>
                                                    <div className="detail-item">
                                                        <strong>Answers:</strong> {session.answerCount}
                                                    </div>
                                                    <div className="detail-item">
                                                        <strong>Avg Confidence:</strong> {session.avgConfidence || 'N/A'}
                                                    </div>
                                                </div>

                                                {session.extensions && session.extensions.length > 0 && (
                                                    <div className="extensions-section">
                                                        <h5>Browser Extensions ({session.extensions.length})</h5>
                                                        <div className="extensions-list">
                                                            {session.extensions.map((extension, extIndex) => (
                                                                <div key={extIndex} className="extension-item">
                                                                    <span className="extension-name">{extension.name || extension}</span>
                                                                    {extension.enabled !== undefined && (
                                                                        <span className={`extension-status ${extension.enabled ? 'enabled' : 'disabled'}`}>
                                                                            {extension.enabled ? '✓' : '✗'}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                    <div className="detail-item">
                                                        <strong>Platform:</strong> {session.platform}
                                                    </div>
                                                    <div className="detail-item">
                                                        <strong>Device:</strong> {session.deviceType}
                                                    </div>
                                                    <div className="detail-item">
                                                        <strong>Answers:</strong> {session.answerCount}
                                                    </div>
                                                </>

                                                {session.locations && session.locations.length > 0 && (
                                                    <div className="locations-section">
                                                        <h5>Location Map ({session.locations.length} points)</h5>
                                                        <div className="map-container">
                                                            <MapContainer
                                                                center={[session.locations[0].latitude, session.locations[0].longitude]}
                                                                zoom={15}
                                                                scrollWheelZoom={true}
                                                                style={{ height: "300px", width: "100%" }}
                                                            >
                                                                <TileLayer
                                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                                />
                                                                {session.locations.map((location, locIndex) => (
                                                                    <Marker
                                                                        key={locIndex}
                                                                        position={[location.latitude, location.longitude]}
                                                                    >
                                                                        <Popup>
                                                                            <div className="popup-content">
                                                                                Lat: {location.latitude.toFixed(6)}
                                                                                <br />
                                                                                Lng: {location.longitude.toFixed(6)}
                                                                            </div>
                                                                        </Popup>
                                                                    </Marker>
                                                                ))}
                                                            </MapContainer>
                                                        </div>
                                                        <div className="location-coordinates">
                                                            <details>
                                                                <summary>Show coordinates</summary>
                                                                <div className="locations-list">
                                                                    {session.locations.map((location, locIndex) => (
                                                                        <div key={locIndex} className="location-item">
                                                                            <div className="coord-pair">
                                                                                <span className="coord-label">Location {locIndex + 1}:</span>
                                                                                <span className="coord-value">
                                                                                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </details>
                                                        </div>
                                                    </div>
                                                )}

                                                {(!session.locations || session.locations.length === 0) && (
                                                    <div className="no-locations">
                                                        <p>No location data available for this session</p>
                                                    </div>
                                                )}

                                                {session.answers && session.answers.length > 0 && (
                                                    <div className="answers-section">
                                                        <h5>All Answers ({session.answers.length})</h5>
                                                        <div className="answers-list">
                                                            {session.answers.map((answer, ansIndex) => (
                                                                <div key={ansIndex} className="answer-item">
                                                                    <p className="question-text">
                                                                        {questionList.find(q => q._id === parseInt(answer.question_id))?.question || `Unknown question (ID: ${answer.question_id})`}
                                                                    </p>
                                                                    <div className="answer-details">
                                                                        <span className="selected-option">
                                                                            Selected: {answer.selected_answer || answer.selected_option}
                                                                        </span>
                                                                        {answer.confidence_score && (
                                                                            <span className="confidence">
                                                                                Confidence: {answer.confidence_score}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>


        </div>
    );
};