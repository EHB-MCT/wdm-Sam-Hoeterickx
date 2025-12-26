import { useEffect } from "react"

//Services
import { sessionService } from "../../services";

export const useAppStartUp = () => {
    useEffect(() => {
        
        const initializeSession = async() => {
            try{
        
                console.log('App startup started');
                const data = await sessionService.createSession();
                console.log(data);
                console.log('App startup successfull');
                
            }catch(error){
                console.error('Failed to create session:', error)
            }
        }

        initializeSession();
    }, []);
}