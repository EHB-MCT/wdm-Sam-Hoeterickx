import { useEffect } from "react";
import { Outlet } from "react-router-dom";

// Hooks
import { useAppStartUp, useAuth, useGeoLocation, useSaveBrowserTracking, useSaveGeoLocation } from "../../shared/hooks";

// Utils
import { detectInstalledExtensions } from "../../shared/utils";

/**
 * Main application component that handles authentication state and session initialization.
 * Manages global app behavior and authentication status tracking.
 * * @returns {React.ReactNode} - Router outlet for nested routes
 */
export const App = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const { trackSession } = useSaveBrowserTracking();
    const { saveLocation } = useSaveGeoLocation();
    const { getLocation } = useGeoLocation();
    

    useAppStartUp();

    useEffect(() => {
      const initTracking = async () => {
        try {
          const foundExtensions = await detectInstalledExtensions();
          
          await trackSession(foundExtensions);
          // console.log("Session tracked successfully", foundExtensions);
        } catch (error) {
          console.error("Failed to track session:", error);
        }
      };

      initTracking();

    }, [trackSession]);

    useEffect(() => {

      const saveLocationData = async () => {
        try{

          const locationData = await getLocation();

          await saveLocation(locationData);

        }catch(error){
          console.error("Failed to fetch or save location:", error);
        }
      }

      saveLocationData();

    }, [])


    useEffect(() => {    
        // console.log('auth check done', isAuthenticated);
        localStorage.setItem('auth_status', isAuthenticated);
    }, [isAuthenticated, isLoading]);

    return (
        <Outlet />
    );
};