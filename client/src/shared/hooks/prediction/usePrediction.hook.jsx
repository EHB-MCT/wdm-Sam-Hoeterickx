import { useEffect, useState } from "react"
import { predictionService } from "../../services";

export const usePrediction = (questionCount) => {
    const [prediction, setPrediction] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const predictionQuestions = [3, 12];
        
        if(!predictionQuestions.includes(questionCount)){
            setPrediction(undefined);
            return;
        }

        const fetchPrediction = async () => {
            setIsLoading(true);
            console.log('hello');

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

    }, [questionCount])

    return { prediction, isLoadingPrediction: isLoading };
}