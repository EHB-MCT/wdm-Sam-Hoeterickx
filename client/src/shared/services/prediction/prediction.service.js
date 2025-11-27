const BASE_URL = import.meta.env.VITE_API_URL;

class PredictionService {
    async getPrediction(questionId){
        const response = await fetch(`${BASE_URL}/ollama/predict-next-answer?question_id=${questionId}`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch prediction: ${response.statusText}`);
        }

        const DATA = response.json();
        return DATA
    }

    async savePredictionData(changedMindState, elapsedHoverTime, desicionTime){
        const response = await fetch(`${BASE_URL}/prediction/savePrediction`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                changed_mind_state: changedMindState,
                elapsed_hover_time: elapsedHoverTime,
                desicion_time: desicionTime
            })
        });
        if(!response.ok){
            throw new Error(`Failed to fetch prediction: ${response.statusText}`);
        }
        
        const DATA = response.json();
        return DATA
    }
}

export const predictionService = new PredictionService();
