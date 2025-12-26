import { useState, useEffect } from 'react';

export const useRandomConfirmation = (questionCount) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationQuestions, setConfirmationQuestions] = useState([]);

    useEffect(() => {
        const randomQuestions = [];
        const usedNumbers = new Set();
        
        while (randomQuestions.length < 5) {
            const randomNum = Math.floor(Math.random() * 20);
            if (!usedNumbers.has(randomNum)) {
                usedNumbers.add(randomNum);
                randomQuestions.push(randomNum);
            }
        }
        
        setConfirmationQuestions(randomQuestions);
    }, []);

    useEffect(() => {
        if (confirmationQuestions.includes(questionCount)) {
            setShowConfirmation(true);
        } else {
            setShowConfirmation(false);
        }
    }, [questionCount, confirmationQuestions]);

    const closeConfirmation = () => {
        setShowConfirmation(false);
    };

    return {
        showConfirmation,
        closeConfirmation
    };
};