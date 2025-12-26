import { useState, useEffect } from 'react';

export const useRandomConfirmation = (questionCount) => {
    const [confirmationQuestions, setConfirmationQuestions] = useState([]);
    const [handledQuestions, setHandledQuestions] = useState(new Set());

    useEffect(() => {
        const randomQuestions = [];
        const usedNumbers = new Set();
        
        while (randomQuestions.length < 5) {
            const randomNum = Math.floor(Math.random() * 20);
            if (!usedNumbers.has(randomNum) && randomNum !== 5 && randomNum !== 6) {
                usedNumbers.add(randomNum);
                randomQuestions.push(randomNum);
            }
        }
        
        setConfirmationQuestions(randomQuestions);
    }, []);

    const isRandomQuestion = confirmationQuestions.includes(questionCount) && !handledQuestions.has(questionCount);

    const closeRandomConfirmation = () => {
        setHandledQuestions(prev => new Set([...prev, questionCount]));
    };

    return {
        showRandomConfirmation: isRandomQuestion,
        closeRandomConfirmation
    };
};