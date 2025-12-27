import { useEffect, useState, useRef } from "react";

//Service
import { questionService } from "../../services"; 

/**
 * Custom hook that manages the quiz questions, progress, and timing.
 * Fetches questions on mount and tracks the current question index.
 * 
 * @returns {Object} - The questions management object
 * @property {Object|undefined} question - The current question object to display
 * @property {number} questionCount - The zero-based index of the current question
 * @property {Function} nextQuestion - Function to advance to the next question
 * @property {Function} getDecisionTime - Function that returns the time elapsed (in seconds) since the question was displayed
 * @property {boolean} isQuizComplete - True if the user has reached the end of the question list
*/

export const useQuestions = () => {
    
    const [questionList, setQuestionList] = useState([]);

    const [questionCount, setQuestionCount] = useState(() => {
        const savedQuestionId = localStorage.getItem('question_id');
        return savedQuestionId ? parseInt(savedQuestionId) : 1;
    });

    const [question, setQuestion] = useState();
    const decisionStart = useRef({});

    useEffect(() => {
        const fetchQuestions = async () => {
            
            try {
                const response = await questionService.getQuestions();
                
                if(response.data) {
                    setQuestionList(response.data);
                }

            } catch (error) {
                console.error("Fout bij ophalen vragen:", error);
            }
        }

        fetchQuestions();
    }, []);

    useEffect(() => {
        if (questionList.length > 0) {
            localStorage.setItem('question_id', questionCount.toString());
            setQuestion(questionList[questionCount]);
            decisionStart.current = Date.now();
        }
    }, [questionCount, questionList]);

    const nextQuestion = () => {
        if (questionCount < questionList.length - 1) {
            setQuestionCount(prev => prev + 1);
        }
    };

    const isQuizComplete = questionList.length > 0 && questionCount === questionList.length - 1;

    const getDecisionTime = () => {
        if (!decisionStart.current){
            return 0
        } else {
            const duration = (Date.now() - decisionStart.current) / 1000;
            return duration;
        }
    };

    return { question, questionCount, nextQuestion, getDecisionTime, isQuizComplete };
}