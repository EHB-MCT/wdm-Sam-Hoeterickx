import { useState } from 'react';
import { sessionService } from '../../services';

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
            await sessionService.createSession();
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

    return {
        saveSessionAfterLogin,
        isSaving,
        saveError,
        saveSuccess,
        resetSaveState
    };
};