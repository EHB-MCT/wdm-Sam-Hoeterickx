import { useState, useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { Monitor, Globe, Cpu, Puzzle } from "lucide-react";

export const BrowserDataVisual = ({ browserData = [] }) => {
    const [activeView, setActiveView] = useState("overview");

    const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

    const platformData = useMemo(() => {
        return browserData.reduce((acc, item) => {
            const existing = acc.find((d) => d.name === item.platform);
            if (existing) {
                existing.value++;
            } else {
                acc.push({ name: item.platform, value: 1 });
            }
            return acc;
        }, []);
    }, [browserData]);

    const browserDistribution = useMemo(() => {
        return browserData.reduce((acc, item) => {
            const browserName = item.brand?.brand || "Unknown";
            const existing = acc.find((d) => d.name === browserName);
            if (existing) {
                existing.sessies++;
            } else {
                acc.push({ name: browserName, sessies: 1 });
            }
            return acc;
        }, []);
    }, [browserData]);

    const extensionsData = useMemo(() => {
        const counts = {};
        browserData.forEach((session) => {
            if (Array.isArray(session.extensions)) {
                session.extensions.forEach((ext) => {
                    const extName =
                        typeof ext === "string"
                            ? ext
                            : ext?.name || "Unknown Extension";
                    counts[extName] = (counts[extName] || 0) + 1;
                });
            }
        });
        return Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    }, [browserData]);

    if (!Array.isArray(browserData) || browserData.length === 0) {
        return (
            <div className="browser-data-container browser-data-empty">
                <div className="browser-data-empty-content">
                    <Monitor className="browser-data-empty-icon" />
                    <h3 className="browser-data-empty-title">
                        Geen browser data beschikbaar
                    </h3>
                    <p className="browser-data-empty-text">
                        Er zijn nog geen sessies opgenomen.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="browser-data-container">
            <div className="browser-data-header">
                <h2 className="browser-data-title">Browser Data Analytics</h2>
                <p className="browser-data-subtitle">
                    Overzicht van browser, platform en extensie statistieken
                </p>
            </div>

            <div className="browser-data-stats">
                <div className="stat-card stat-card--primary">
                    <div className="stat-icon">
                        <Monitor />
                    </div>
                    <div className="stat-content">
                        <p className="stat-value">{browserData.length}</p>
                        <p className="stat-label">Totaal Sessies</p>
                    </div>
                </div>

                <div className="stat-card stat-card--purple">
                    <div className="stat-icon stat-icon--purple">
                        <Cpu />
                    </div>
                    <div className="stat-content">
                        <p className="stat-value">{platformData.length}</p>
                        <p className="stat-label">Platforms</p>
                    </div>
                </div>

                <div className="stat-card stat-card--pink">
                    <div className="stat-icon stat-icon--pink">
                        <Globe />
                    </div>
                    <div className="stat-content">
                        <p className="stat-value">
                            {browserDistribution.length}
                        </p>
                        <p className="stat-label">Browsers</p>
                    </div>
                </div>

                <div className="stat-card stat-card--orange">
                    <div className="stat-icon stat-icon--orange">
                        <Puzzle />
                    </div>
                    <div className="stat-content">
                        <p className="stat-value">{extensionsData.length}</p>
                        <p className="stat-label">Unieke Extensies</p>
                    </div>
                </div>
            </div>

            <div className="browser-data-tabs">
                <button
                    onClick={() => setActiveView("overview")}
                    className={`dashboard-tab ${
                        activeView === "overview" ? "dashboard-tab--active" : ""
                    }`}
                >
                    Browser Distributie
                </button>
                <button
                    onClick={() => setActiveView("platform")}
                    className={`dashboard-tab ${
                        activeView === "platform" ? "dashboard-tab--active" : ""
                    }`}
                >
                    Platform Overzicht
                </button>
                <button
                    onClick={() => setActiveView("extensions")}
                    className={`dashboard-tab ${
                        activeView === "extensions"
                            ? "dashboard-tab--active"
                            : ""
                    }`}
                >
                    Extensies
                </button>
            </div>

            {activeView === "overview" && (
                <div className="browser-data-visualisations">
                    <div className="browser-data-chart">
                        <h3 className="browser-data-chart-title">
                            Browser Gebruik
                        </h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={browserDistribution}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="sessies"
                                    fill="#3b82f6"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="browser-stats-grid">
                        {browserDistribution.map((browser, index) => (
                            <div key={index} className="browser-stat-card">
                                <div className="browser-stat-header">
                                    <h4 className="browser-stat-name">
                                        {browser.name}
                                    </h4>
                                    <Globe
                                        className="browser-stat-icon"
                                        style={{
                                            color: COLORS[
                                                index % COLORS.length
                                            ],
                                        }}
                                    />
                                </div>
                                <p
                                    className="browser-stat-value"
                                    style={{
                                        color: COLORS[index % COLORS.length],
                                    }}
                                >
                                    {browser.sessies}
                                </p>
                                <div className="browser-stat-progress">
                                    <div
                                        className="browser-stat-progress-bar"
                                        style={{
                                            width: `${
                                                (browser.sessies /
                                                    browserData.length) *
                                                100
                                            }%`,
                                            backgroundColor:
                                                COLORS[index % COLORS.length],
                                        }}
                                    />
                                </div>
                                <p className="browser-stat-percentage">
                                    {(
                                        (browser.sessies / browserData.length) *
                                        100
                                    ).toFixed(1)}
                                    % van totaal
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeView === "platform" && (
                <div className="browser-data-platform">
                    <h3 className="browser-data-platform-title">
                        Platform Statistieken
                    </h3>
                    <div className="browser-data-platform-grid">
                        <div className="browser-data-platform-chart">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={platformData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar
                                        dataKey="value"
                                        fill="#8b5cf6"
                                        radius={[8, 8, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="browser-data-platform-list">
                            {platformData.map((platform, index) => (
                                <div key={index} className="platform-stat-item">
                                    <div className="platform-stat-header">
                                        <span className="platform-stat-name">
                                            {platform.name}
                                        </span>
                                        <span className="platform-stat-value">
                                            {platform.value}
                                        </span>
                                    </div>
                                    <div className="platform-stat-progress">
                                        <div
                                            className="platform-stat-progress-bar"
                                            style={{
                                                width: `${
                                                    (platform.value /
                                                        browserData.length) *
                                                    100
                                                }%`,
                                            }}
                                        />
                                    </div>
                                    <p className="platform-stat-percentage">
                                        {(
                                            (platform.value /
                                                browserData.length) *
                                            100
                                        ).toFixed(1)}
                                        % van alle sessies
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeView === "extensions" && (
                <div className="browser-data-visualisations">
                    <div className="browser-data-chart">
                        <h3 className="browser-data-chart-title">
                            Meest Gedetecteerde Extensies
                        </h3>
                        {extensionsData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart
                                    layout="vertical"
                                    data={extensionsData.slice(0, 10)}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" allowDecimals={false} />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        width={150}
                                    />
                                    <Tooltip />
                                    <Legend />
                                    <Bar
                                        dataKey="count"
                                        name="Aantal gebruikers"
                                        fill="#f59e0b"
                                        radius={[0, 4, 4, 0]}
                                    >
                                        {extensionsData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                <Puzzle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>
                                    Geen extensie data gevonden in de huidige
                                    sessies.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="browser-data-platform-list">
                        <h4 className="font-semibold text-gray-700 mb-4">
                            Extensie Detailijst
                        </h4>
                        {extensionsData.length > 0 ? (
                            extensionsData.map((ext, index) => (
                                <div key={index} className="platform-stat-item">
                                    <div className="platform-stat-header">
                                        <span className="platform-stat-name flex items-center gap-2">
                                            <Puzzle className="w-4 h-4 text-gray-400" />
                                            {ext.name}
                                        </span>
                                        <span className="platform-stat-value">
                                            {ext.count}
                                        </span>
                                    </div>
                                    <div className="platform-stat-progress">
                                        <div
                                            className="platform-stat-progress-bar"
                                            style={{
                                                width: `${
                                                    (ext.count /
                                                        browserData.length) *
                                                    100
                                                }%`,
                                                backgroundColor:
                                                    COLORS[
                                                        index % COLORS.length
                                                    ],
                                            }}
                                        />
                                    </div>
                                    <p className="platform-stat-percentage">
                                        {(
                                            (ext.count / browserData.length) *
                                            100
                                        ).toFixed(1)}
                                        % van gebruikers
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 italic">
                                Geen extensies gedetecteerd.
                            </p>
                        )}
                    </div>
                </div>
            )}

            <div className="browser-data-table">
                <h3 className="browser-data-table-title">Sessie Details</h3>
                <div className="browser-data-table-wrapper">
                    <table className="browser-data-table-content">
                        <thead>
                            <tr className="browser-data-table-header">
                                <th className="browser-data-table-th">
                                    Session ID
                                </th>
                                <th className="browser-data-table-th">
                                    Platform
                                </th>
                                <th className="browser-data-table-th">
                                    Browser
                                </th>
                                <th className="browser-data-table-th">
                                    Extensies
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {browserData.map((session) => (
                                <tr
                                    key={session._id}
                                    className="browser-data-table-row"
                                >
                                    <td className="browser-data-table-td browser-data-table-id">
                                        {session.session_id.substring(0, 10)}...
                                    </td>
                                    <td className="browser-data-table-td">
                                        {session.platform}
                                    </td>
                                    <td className="browser-data-table-td">
                                        {session.brand?.brand || "Unknown"}{" "}
                                        <span className="text-xs text-gray-400">
                                            ({session.brand?.version})
                                        </span>
                                    </td>
                                    <td className="browser-data-table-td">
                                        {Array.isArray(session.extensions) &&
                                        session.extensions.length > 0 ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                                {session.extensions.length}{" "}
                                                geïnstalleerd
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-sm">
                                                -
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
