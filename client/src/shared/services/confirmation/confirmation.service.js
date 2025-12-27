const BASE_URL = `${import.meta.env.VITE_API_URL}/confidence`;

/**
 * Service class responsible for handling confirmation-related API interactions.
 * Used to save data regarding user hesitation or mind changes during the quiz.
*/

class ConfirmationService {

    /**
     * Sends confirmation data (hesitation metrics) to the backend.
     * 
     * @param {boolean} changedMind - Indicates if the user changed their mind (e.g., clicked 'cancel' on confirmation).
     * @param {number} elapsedHoverTime - The time in milliseconds the user hovered over the option.
     * @param {number} decisionTime - The time in milliseconds it took to make the decision.
     * @returns {Promise<Object>} The response data from the server.
     * @throws {Error} If the save operation fails or the server returns an error.
    */
    async saveConfirmationData(changedMind, elapsedHoverTime, decisionTime) {
        const response = await fetch(`${BASE_URL}/save`, {
            method: 'POST',
            headers: { 'Content-Type': "application/json" },
            credentials: 'include',
            body: JSON.stringify({ 
                changed_mind_state: changedMind,
                elapsed_hover_time: elapsedHoverTime, 
                decision_time: decisionTime
            })
        });

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to save confirmation data');
        }

        return await response.json();
    }
}

export const confirmationService = new ConfirmationService();