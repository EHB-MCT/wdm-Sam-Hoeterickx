import { useState, useCallback } from "react";
import { geoLocationService } from "../../services";

/**
 * Custom hook to save geolocation data to the server
 * 
 * @returns {Object} - Object containing save state, error, and save function
 */
export const useSaveGeoLocation = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    const saveLocation = useCallback(async (locationData = {}) => {

        setIsSaving(true);
        setSaveError(null);

        try {

            await geoLocationService.saveGeoLocation(locationData);

        } catch (error) {
            const errorMessage = `Failed to save location: ${error.message}`;
            setSaveError(errorMessage);
            throw error;
        } finally {
            setIsSaving(false);
        }
    }, []);

    return { isSaving, saveError, saveLocation };
};