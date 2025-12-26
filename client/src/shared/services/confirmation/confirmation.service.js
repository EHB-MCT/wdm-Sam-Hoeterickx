const BASE_URL = `${import.meta.env.VITE_API_URL}/confidence`;

class ConfirmationService {
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