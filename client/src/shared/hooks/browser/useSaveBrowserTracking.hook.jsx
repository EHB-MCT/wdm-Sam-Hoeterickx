import { useState, useCallback } from 'react';

//Service
import { browserService } from '../../services'; 

export const useSaveBrowserTracking = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sessionData, setSessionData] = useState(null);

    const trackSession = useCallback(async (detectedExtensions = []) => {
        setLoading(true);
        setError(null);
        try {
            const result = await browserService.trackCurrentSession(detectedExtensions);
            setSessionData(result.data);

            // console.log(result);

            return result.data;
        } catch (err) {
            setError(err);
            console.error('Hook Error (trackSession):', err);
        } finally {
            setLoading(false);
        }
    }, []);

    

    return { loading, error, sessionData, trackSession };
};