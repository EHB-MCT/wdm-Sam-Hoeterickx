import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Components
import { QuizUI } from "../components";

//Modals
import { ConfirmationModal } from "../../../shared/utils";

//Hooks
import {
    useAnswerQuestion,
    useChoiceTracking,
    useHoverTracking,
    useQuestions,
    useRandomConfirmation
} from '../../../shared/hooks';

//Style
import './home.css';
import { LOGIN_ROUTE } from "../../auth/login";

/**
 * Main quiz page component that manages the interactive questionnaire.
 * Handles question flow, timing, user interactions, and progress tracking.
 * 
 * @returns {React.ReactNode} - Complete quiz interface with modals and navigation
 */
export const Home = () => {
    
    const nav = useNavigate();

    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [selectedButtonId, setSelectedButtonId] = useState(null);
    const [timeLeft, setTimeLeft] = useState(3);
    const [timerActive, setTimerActive] = useState(false);
    const [optionLocked, setOptionLocked] = useState(false);
    const [lastAnswerSubmitted, setLastAnswerSubmitted] = useState(false);
    const [showAnswerConfirmation, setShowAnswerConfirmation] = useState(false);

    const { handleAnswerQuestion } = useAnswerQuestion();
    const { question, questionCount, nextQuestion, getDecisionTime, isQuizComplete } = useQuestions();
    const { elapsedHoverTime, handleMouseEnter, handleMouseLeave, resetHoverTime } = useHoverTracking();
    const { changedMind, updateChoice, resetChoices } = useChoiceTracking();
    const { showRandomConfirmation, closeRandomConfirmation } = useRandomConfirmation(questionCount);

    useEffect(() => {
        document.title = 'WDM | Home';
    }, [])

    useEffect(() => {
        if (question && question.category === 'time_pressure') {
            setTimeLeft(3);
            setTimerActive(true);
            setOptionLocked(false);
            setSelectedAnswer(null);
            setSelectedButtonId(null);
        } else {
            setTimerActive(false);
            setOptionLocked(false);
        }
    }, [question]);

    useEffect(() => {
        if (timerActive && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timerActive && timeLeft === 0) {
            setTimerActive(false);
            setOptionLocked(true);
        }
    }, [timerActive, timeLeft]);

    const handleOptionClick = (buttonId, answerValue) => {
        if (question.category === 'time_pressure' && optionLocked) {
            return;
        }
        
        setSelectedAnswer(answerValue);
        setSelectedButtonId(buttonId);
       
        
        handleMouseLeave(buttonId);
        updateChoice(buttonId);
    };

    const onSuccess = () => {
        resetHoverTime();
        resetChoices();
        if (!isQuizComplete) {
            nextQuestion();
        } else {
            setLastAnswerSubmitted(true);
            localStorage.setItem('quiz_completed', 'true');
        }
        setSelectedAnswer(null);
        setSelectedButtonId(null);
    };

    const handleNextClick = () => {
        if (lastAnswerSubmitted) {
            nav(`/${LOGIN_ROUTE.path}`);
            return;
        }
        
        if (showRandomConfirmation && selectedAnswer) {
            setShowAnswerConfirmation(true);
            return;
        }
        
        submitAnswer();
    };

    const submitAnswer = () => {
        const decision_time = getDecisionTime();
        const currentQuestionId= localStorage.getItem('question_id');

        console.log('submit', decision_time, currentQuestionId, selectedAnswer, elapsedHoverTime, changedMind);
        
        handleAnswerQuestion(currentQuestionId, selectedAnswer, decision_time, elapsedHoverTime, changedMind, onSuccess);
    };

    
    
    return(
        <>
            <QuizUI
                question={question}
                selectedButtonId={selectedButtonId}
                onOptionClick={handleOptionClick}
                onNextClick={handleNextClick}
                onHoverStart={handleMouseEnter}
                onHoverEnd={handleMouseLeave}
                timeLeft={timeLeft}
                timerActive={timerActive}
                optionLocked={optionLocked}
                isQuizComplete={isQuizComplete}
                lastAnswerSubmitted={lastAnswerSubmitted}
            />
            <ConfirmationModal 
                isOpen={showAnswerConfirmation}
                onConfirm={() => {
                    setShowAnswerConfirmation(false);
                    closeRandomConfirmation();
                    submitAnswer();
                }}
                onCancel={() => {
                    setShowAnswerConfirmation(false);
                    closeRandomConfirmation();
                }}
            />
            
        </>
    )
}