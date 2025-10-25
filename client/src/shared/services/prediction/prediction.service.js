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
}

export const predictionService = new PredictionService();
