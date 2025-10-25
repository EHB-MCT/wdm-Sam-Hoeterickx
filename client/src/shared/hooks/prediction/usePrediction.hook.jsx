import { useEffect, useState } from "react"
import { predictionService } from "../../services";

export const usePrediction = (questionCount) => {
    const [prediction, setPrediction] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(questionCount !== 3){
            setPrediction(undefined);
            return;
        }

        const fetchPrediction = async () => {
            setIsLoading(true);

            try{
                const data = await predictionService.getPrediction(questionCount);
                console.log('Prediction data:', data);
                
                setPrediction(data.prediction);
            }catch(error){
                console.error('Failed to fetch prediction:', error);
            }finally{
                setIsLoading(false);
            }
        };

        fetchPrediction();

    }, [])

    return { prediction, isLoadingPrediction: isLoading };
}