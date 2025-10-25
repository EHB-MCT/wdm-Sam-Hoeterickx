import { useEffect } from "react"
import { sessionService, ollamaService } from "../../services";

export const useAppStartUp = () => {
    useEffect(() => {
        
        const initializeSession = async() => {
            try{
                const data = await sessionService.createSession();
                console.log(data);
            }catch(error){
                console.error('Failed to create session:', error)
            }
        }

        initializeSession();
        ollamaService.awakeOllama();
    }, []);
}