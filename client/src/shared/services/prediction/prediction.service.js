const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Service class responsible for handling prediction-related API interactions.
 * Collects and sends user behavioral data to the backend for analysis.
*/

class PredictionService {

/**
     * Sends user behavior metrics to the server to save a prediction state.
     * 
     * @param {boolean} changedMindState - Indicates whether the user changed their mind/selection before submitting.
     * @param {number} elapsedHoverTime - The total duration (in milliseconds) the user hovered over the options.
     * @param {number} decisionTime - The time (in milliseconds) it took the user to make a decision.
     * @returns {Promise<Object>} A promise that resolves to the server response data.
     * @throws {Error} If the API request fails or returns a non-OK status.
    */

    async savePredictionData(changedMindState, elapsedHoverTime, decisionTime){
        const response = await fetch(`${BASE_URL}/prediction/savePrediction`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                changed_mind_state: changedMindState,
                elapsed_hover_time: elapsedHoverTime,
                decision_time: decisionTime
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
