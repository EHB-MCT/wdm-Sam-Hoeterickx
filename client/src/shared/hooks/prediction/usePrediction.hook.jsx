import { useEffect, useState } from "react"
import { predictionService } from "../../services";

export const usePrediction = (questionCount) => {
    const [predictions, setPredictions] = useState(undefined);
    const [showPrediction, setShowPrediction] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [popupCount, setPopupCount] = useState(0);

    useEffect(() => {
        // Trigger batch prediction every 10 questions
        if(questionCount > 0 && questionCount % 10 === 0){
            const fetchBatchPrediction = async () => {
                setIsLoading(true);
                console.log('Fetching batch prediction after', questionCount, 'questions');

                try{
                    const data = await predictionService.getBatchPrediction();
                    console.log('Batch prediction data:', data);
                    
                    setPredictions(data.predictions);
                    
                    // Randomly decide to show popup (2-3 times out of 10 opportunities)
                    const shouldShow = Math.random() < 0.25 && popupCount < 3; // 25% chance, max 3 times
                    if(shouldShow){
                        setShowPrediction(true);
                        setPopupCount(prev => prev + 1);
                    }
                }catch(error){
                    console.error('Failed to fetch batch prediction:', error);
                }finally{
                    setIsLoading(false);
                }
            };

            fetchBatchPrediction();
        }
    }, [questionCount, popupCount]);

    const closePrediction = () => {
        setShowPrediction(false);
    };

    return { 
        predictions, 
        showPrediction, 
        isLoadingPrediction: isLoading, 
        closePrediction,
        popupCount
    };
}