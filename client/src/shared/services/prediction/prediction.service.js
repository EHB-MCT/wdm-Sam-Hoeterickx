const BASE_URL = 'http://localhost:3000/api/ollama';

class PredictionService {
    async getPrediction(questionId){
        const response = await fetch(`${BASE_URL}/predict-next-answer?question_id=${questionId}`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch prediction: ${response.statusText}`);
        }

        const DATA = response.json();
        return DATA
    }

    async savePredictionData(changedMindState, elapsedHoverTime, desicionTime){
        const response = await fetch(`${BASE_URL}/savePrediction`, {
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
