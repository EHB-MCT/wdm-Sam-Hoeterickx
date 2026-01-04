import { useEffect } from "react"

//Services
import { sessionService } from "../../services";

/**
 * Custom hook that initializes the application session upon mounting.
 * Triggers the session creation process to ensure user activity is tracked from the start.
 * 
 * @returns {void} This hook does not return any values.
*/

export const useAppStartUp = () => {
    useEffect(() => {
        
        const initializeSession = async() => {
            try{
        
                console.log('App startup started');
                const data = await sessionService.createSession();
                // console.log(data);
                console.log('App startup successfull');
                
            }catch(error){
                console.error('Failed to create session:', error)
            }
        }

        initializeSession();
    }, []);
}