export const getAllBrowserTracking = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sessions, setAllSessions] = useState(null);

    const getAllSessions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await browserService.fetchBrowserData();
            setAllSessions(data);
        } catch (err) {
            setError(err);
            console.error('Hook Error (getAllSessions):', err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, sessions, getAllSessions };
} 