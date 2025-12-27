import { useState } from 'react';

//Service
import { sessionService } from '../../services';

/**
 * Custom hook that manages the process of saving a temporary session to a user account after login.
 * It checks if a quiz was actually completed before attempting to merge the session.
 * 
 * @returns {Object} - The session saving management object
 * @property {Function} saveSessionAfterLogin - Async function that triggers the save process. Returns true if saved, false if skipped or failed.
 * @property {boolean} isSaving - True while the save operation is in progress
 * @property {string|null} saveError - Error message string if the operation failed, otherwise null
 * @property {boolean} saveSuccess - True if the session was successfully linked to the account
 * @property {Function} resetSaveState - Function to reset the error and success states to their defaults
*/

export const useSessionSave = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const saveSessionAfterLogin = async () => {
        const quizCompleted = localStorage.getItem('quiz_completed');
        
        if (!quizCompleted || quizCompleted !== 'true') {
            return false;
        }

        setIsSaving(true);
        setSaveError(null);

        try {
            await sessionService.saveSession();
            setSaveSuccess(true);
            
            localStorage.removeItem('quiz_completed');
            
            return true;
        } catch (error) {
            setSaveError(error.message || 'Failed to save session');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const resetSaveState = () => {
        setSaveError(null);
        setSaveSuccess(false);
    };

    return { saveSessionAfterLogin, isSaving, saveError, saveSuccess, resetSaveState };
};