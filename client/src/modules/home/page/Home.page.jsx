import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Components
import { QuizUI } from "../components";

//Modals
import { ConfirmationModal, PredictionModal } from "../../../shared/utils";

//Hooks
import {
    useAnswerQuestion,
    // useCheckPrediction,
    useChoiceTracking,
    useHoverTracking,
    useQuestions,
    usePrediction
} from '../../../shared/hooks';

//Style
import './home.css';
import { LOGIN_ROUTE } from "../../auth/login";

export const Home = () => {
    
    const nav = useNavigate();

    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [selectedButtonId, setSelectedButtonId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(3);
    const [timerActive, setTimerActive] = useState(false);
    const [optionLocked, setOptionLocked] = useState(false);
    const [lastAnswerSubmitted, setLastAnswerSubmitted] = useState(false);

    const { handleAnswerQuestion } = useAnswerQuestion();
    // const { checkPrediction, isPredictionCorrect } = useCheckPrediction();
    const { question, questionCount, nextQuestion, getDecisionTime, isQuizComplete } = useQuestions();
    const { elapsedHoverTime, handleMouseEnter, handleMouseLeave, resetHoverTime } = useHoverTracking();
    const { changedMind, updateChoice, resetChoices } = useChoiceTracking();
    const { predictions, showPrediction, isLoadingPrediction, closePrediction } = usePrediction(questionCount);


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
            // Laatste vraag is beantwoord
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
        
        const decision_time = getDecisionTime();
        const currentQuestionId= localStorage.getItem('question_id')
        
        handleAnswerQuestion(currentQuestionId, selectedAnswer, decision_time, elapsedHoverTime, changedMind, onSuccess);
    };

    if (isLoadingPrediction) {
        return <p>Loading ...</p>
    }
    
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
                isOpen={isModalOpen}
                onConfirm={() => {
                    console.log("Gebruiker is zeker!");
                    setIsModalOpen(false);
                }}
                onCancel={() => {
                    console.log("Gebruiker is niet zeker.");
                    setIsModalOpen(false);
                }}
            />
            <PredictionModal 
                isOpen={showPrediction}
                predictions={predictions}
                onClose={closePrediction}
            />
        </>
    )
}