import { useState, useEffect } from 'react';

/**
 * Custom hook that manages the display of random confirmation modals during the quiz.
 * Upon mounting, it randomly selects 5 questions (excluding indices 5 and 6) to trigger a confirmation check.
 * 
 * @param {number} questionCount - The index of the current question being viewed
 * @returns {Object} - The confirmation state object
 * @property {boolean} showRandomConfirmation - True if the current question was selected for a check and hasn't been handled yet
 * @property {Function} closeRandomConfirmation - Function to mark the current confirmation as handled (closes the modal)
*/

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