import { useState } from "react";

export const useCheckPrediction = () => {

    const [isPredictionCorrect, setIsPredictionCorrect] = useState();

    const checkPrediction = (prediction, selectedAnswer) => {
        if(prediction === selectedAnswer){
            console.log('Prediction correct');
            setIsPredictionCorrect(true);
        }else {
            console.log('Prediction failed');
            setIsPredictionCorrect(false);
        }
    }

    return {checkPrediction, isPredictionCorrect}
}

