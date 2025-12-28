import { useState, useEffect } from "react";

/**
 * Geolocation error codes mapping
 */
const GEOLOCATION_ERRORS = {
    1: "PERMISSION_DENIED - User denied the request for Geolocation",
    2: "POSITION_UNAVAILABLE - Location information is unavailable",
    3: "TIMEOUT - The request to get user location timed out"
};

/**
 * Custom hook to get user's geolocation
 * 
 * @returns {Object} - Object containing location data, loading state, error message, and refetch function
 */
export const useGeoLocation = () => {
    const [location, setLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getLocation = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const position = await new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject(new Error("Geolocation is not supported by this browser"));
                    return;
                }
                
                navigator.geolocation.getCurrentPosition(
                    resolve, 
                    reject, 
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    }
                );
            });

            const { latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed } = position.coords;
            
            const locationData = { latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed, timestamp: position.timestamp };

            setLocation(locationData);
            return locationData;
        } catch (error) {
            let errorMessage = "Unknown geolocation error";

            if (error.code && GEOLOCATION_ERRORS[error.code]) {
                errorMessage = GEOLOCATION_ERRORS[error.code];
            } else if (error.message) {
                errorMessage = error.message;
            }

            setError(errorMessage);
            console.error("Failed to get location:", errorMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    return { location, isLoading, error, refetch: getLocation };
};