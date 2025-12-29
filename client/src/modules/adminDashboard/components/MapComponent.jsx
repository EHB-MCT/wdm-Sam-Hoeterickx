import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Popup,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Vergeet deze niet!

// Fix voor het centreren van de kaart
const MapUpdater = ({ center }) => {
    const map = useMap();

    // Update view only if center has changed significantly
    if (center && center.length === 2) {
        const [lat, lng] = center;
        if (!isNaN(lat) && !isNaN(lng)) {
            map.setView([lat, lng], map.getZoom());
        }
    }

    return null;
};

export const MapComponent = ({ center, heatmapData, getHeatColor }) => {
    return (
        <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={center} />
            {heatmapData.map((point, index) => (
                <CircleMarker
                    key={index}
                    center={[point.latitude, point.longitude]}
                    radius={point.radius}
                    pathOptions={{
                        fillColor: getHeatColor(point.intensity),
                        color: getHeatColor(point.intensity),
                        weight: 1,
                        opacity: 0.8,
                        fillOpacity: 0.6,
                    }}
                >
                    <Popup>
                        <div className="text-sm text-gray-800">
                            <strong>Cluster</strong>
                            <br />
                            Punten: {point.intensity}
                        </div>
                    </Popup>
                </CircleMarker>
            ))}
        </MapContainer>
    );
};
