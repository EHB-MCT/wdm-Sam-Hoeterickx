const BASE_URL = `${import.meta.env.VITE_API_URL}/prediction`;

class ConfirmationService {
    async saveConfirmationData(changedMind, elapsedHoverTime, decisionTime) {
        const response = await fetch(`${BASE_URL}/save`, {
            method: 'POST',
            headers: { 'Content-Type': "application/json" },
            credentials: 'include',
            body: JSON.stringify({ 
                changedMind,
                elapsedHoverTime, 
                decisionTime
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