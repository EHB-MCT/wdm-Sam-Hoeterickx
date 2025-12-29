import { useState, useMemo } from 'react';
import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { MapPin, Navigation, Crosshair, Globe2, Layers } from 'lucide-react';
// Belangrijk: Leaflet CSS moet geïmporteerd worden voor de kaartweergave
import 'leaflet/dist/leaflet.css';

// Hulpcomponent om de kaart automatisch te centreren en inzoomen op data
const MapUpdater = ({ center, bounds, hasData }) => {
  const map = useMap();
  
  React.useEffect(() => {
    // Als er data is, zoom naar de bounds met een kleine padding
    if (hasData && bounds) {
      const [[south, west], [north, east]] = bounds;
      
      // Voeg padding toe aan de bounds (ongeveer 10% extra ruimte)
      const latPadding = (north - south) * 0.1;
      const lngPadding = (east - west) * 0.1;
      
      const paddedBounds = [
        [south - latPadding, west - lngPadding],
        [north + latPadding, east + lngPadding]
      ];
      
      map.fitBounds(paddedBounds, { padding: [50, 50] });
    } else if (center && center.length === 2) {
      // Geen data? Toon wereld niveau view
      const [lat, lng] = center;
      if (!isNaN(lat) && !isNaN(lng)) {
        map.setView([lat, lng], 2); // Zoom niveau 2 is wereld niveau
      }
    }
  }, [center, bounds, hasData, map]);
  
  return null;
};

export const GeoLocationVisual = ({ geoLocationData = [] }) => {
  // Standaard centrum (België/Nederland regio als fallback)
  const defaultCenter = [51.0, 4.5]; 
  
  // 1. DATA GROEPERING (Heatmap Logic)
  // We groeperen punten die dicht bij elkaar liggen in een grid
  const heatmapData = useMemo(() => {
    if (!geoLocationData.length) return [];

    // Grid grootte: 0.005 is ongeveer 500m precisie. 
    // Maak dit kleiner (bv 0.001) voor meer detail, groter voor grovere cirkels.
    const gridSize = 0.005; 
    const grid = {};

    geoLocationData.forEach(location => {
      // Rond af naar dichtstbijzijnde grid lijn
      const gridLat = Math.floor(location.latitude / gridSize) * gridSize;
      const gridLng = Math.floor(location.longitude / gridSize) * gridSize;
      const key = `${gridLat}-${gridLng}`;

      if (!grid[key]) {
        grid[key] = {
          // Centreer de punt in het grid vakje
          latitude: gridLat + (gridSize / 2),
          longitude: gridLng + (gridSize / 2),
          intensity: 0,
          avgAccuracy: 0,
          points: []
        };
      }
      
      grid[key].intensity += 1;
      grid[key].points.push(location);
      grid[key].avgAccuracy += location.accuracy;
    });

    // Converteer terug naar array en bereken visuele eigenschappen
    return Object.values(grid).map(cell => ({
      ...cell,
      avgAccuracy: cell.avgAccuracy / cell.points.length,
      // Radius in pixels (minimaal 5px, groeit met intensiteit)
      radius: Math.min(30, 5 + (cell.intensity * 2)) 
    }));
  }, [geoLocationData]);

  // Bepaal het centrum van de kaart - start op wereld niveau
  const mapCenter = defaultCenter;
  
  // Bepaal de bounds voor automatische zoom naar data
  const getMapBounds = () => {
    if (heatmapData.length === 0) return null;
    
    const bounds = [
      [Math.min(...heatmapData.map(p => p.latitude)), Math.min(...heatmapData.map(p => p.longitude))],
      [Math.max(...heatmapData.map(p => p.latitude)), Math.max(...heatmapData.map(p => p.longitude))]
    ];
    
    return bounds;
  };

  // 2. STATISTIEKEN BEREKENEN
  const stats = useMemo(() => {
    const uniqueSessions = new Set(geoLocationData.map(d => d.sessionId)).size;
    const accuracies = geoLocationData.map(d => d.accuracy);
    
    return {
      totalPoints: geoLocationData.length,
      uniqueSessions,
      avgAccuracy: accuracies.length > 0 
        ? (accuracies.reduce((a, b) => a + b, 0) / accuracies.length).toFixed(2) 
        : 0,
      hotspots: heatmapData.filter(d => d.intensity > 5).length,
    };
  }, [geoLocationData, heatmapData]);

  // 3. KLEUR FUNCTIE
  const getHeatColor = (intensity) => {
    if (intensity >= 20) return '#dc2626'; // Donkerrood (Zeer druk)
    if (intensity >= 10) return '#ef4444'; // Rood
    if (intensity >= 5) return '#f97316';  // Oranje
    if (intensity >= 2) return '#eab308';  // Geel
    return '#3b82f6';                      // Blauw (Rustig)
  };

  if (!geoLocationData || geoLocationData.length === 0) {
    return (
      <div className="geo-data-container geo-data-empty">
        <div className="geo-data-empty-content">
          <MapPin className="geo-data-empty-icon" />
          <h3 className="geo-data-empty-title">Geen locatie data beschikbaar</h3>
          <p className="geo-data-empty-text">Wachten op coördinaten...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="geo-data-container">
      {/* Header */}
      <div className="geo-data-header">
        <h2 className="geo-data-title">
          <Layers className="geo-data-title-icon" />
          Locatie Heatmap
        </h2>
        <p className="geo-data-subtitle">
          Visueel overzicht van {stats.totalPoints} gemeten punten
        </p>
      </div>

      {/* Stats Cards */}
      <div className="geo-data-stats-grid">
        <div className="geo-stat-card">
          <div className="geo-stat-icon geo-stat-icon--blue">
            <Crosshair />
          </div>
          <div className="geo-stat-content">
            <p className="geo-stat-label">Totaal Punten</p>
            <p className="geo-stat-value">{stats.totalPoints}</p>
          </div>
        </div>

        <div className="geo-stat-card">
          <div className="geo-stat-icon geo-stat-icon--purple">
            <Navigation />
          </div>
          <div className="geo-stat-content">
            <p className="geo-stat-label">Sessies</p>
            <p className="geo-stat-value">{stats.uniqueSessions}</p>
          </div>
        </div>

        <div className="geo-stat-card">
          <div className="geo-stat-icon geo-stat-icon--red">
            <Layers />
          </div>
          <div className="geo-stat-content">
            <p className="geo-stat-label">Hotspots</p>
            <p className="geo-stat-value">{stats.hotspots}</p>
          </div>
        </div>

        <div className="geo-stat-card">
          <div className="geo-stat-icon geo-stat-icon--green">
            <Globe2 />
          </div>
          <div className="geo-stat-content">
            <p className="geo-stat-label">Gem. Nauwkeurigheid</p>
            <p className="geo-stat-value">{stats.avgAccuracy}m</p>
          </div>
        </div>
      </div>

      {/* DE KAART (Leaflet) */}
      <div className="geo-data-map-container">
        <div className="geo-data-map">
            <MapContainer 
                center={mapCenter} 
                zoom={2} // Start op wereld niveau
                scrollWheelZoom={true} 
                style={{ height: "100%", width: "100%" }}
            >
                {/* De "TileLayer" zorgt voor de OpenStreetMap look */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Update kaart view als data verandert */}
                <MapUpdater 
                    center={mapCenter} 
                    bounds={getMapBounds()} 
                    hasData={heatmapData.length > 0}
                />

                {/* Hier tekenen we de cirkels in plaats van pinnen */}
                {heatmapData.map((point, index) => (
                    <CircleMarker
                        key={index}
                        center={[point.latitude, point.longitude]}
                        radius={point.radius} // Grootte gebaseerd op aantal punten
                        pathOptions={{
                            fillColor: getHeatColor(point.intensity),
                            color: getHeatColor(point.intensity), // Randkleur
                            weight: 1,
                            opacity: 0.8,
                            fillOpacity: 0.6
                        }}
                    >
                        <Popup>
                            <div className="geo-popup-content">
                                <strong className="geo-popup-title">Locatie Cluster</strong>
                                <span className="geo-popup-info">Aantal punten: <strong>{point.intensity}</strong></span>
                                <span className="geo-popup-info">Lat: {point.latitude.toFixed(5)}</span>
                                <span className="geo-popup-info">Lng: {point.longitude.toFixed(5)}</span>
                                <span className="geo-popup-accuracy">
                                    Gem. nauwkeurigheid: {point.avgAccuracy.toFixed(1)}m
                                </span>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
        
        {/* Legenda */}
        <div className="geo-data-legend">
          <span className="geo-data-legend-title">Legenda:</span>
          
          <div className="geo-legend-item">
            <div className="geo-legend-color geo-legend-color--small"></div>
            <span className="geo-legend-label">1 punt</span>
          </div>
          <div className="geo-legend-item">
            <div className="geo-legend-color geo-legend-color--medium"></div>
            <span className="geo-legend-label">2-5 punten</span>
          </div>
          <div className="geo-legend-item">
            <div className="geo-legend-color geo-legend-color--large"></div>
            <span className="geo-legend-label">6-19 punten</span>
          </div>
          <div className="geo-legend-item">
            <div className="geo-legend-color geo-legend-color--hotspot"></div>
            <span className="geo-legend-label">Hotspot (20+)</span>
          </div>
        </div>
      </div>
    </div>
  );
};