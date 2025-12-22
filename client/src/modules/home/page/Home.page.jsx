import { useEffect, useState } from "react";

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

export const Home = () => {

    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [selectedButtonId, setSelectedButtonId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(3);
    const [timerActive, setTimerActive] = useState(false);
    const [optionLocked, setOptionLocked] = useState(false);

    const { handleAnswerQuestion } = useAnswerQuestion();
    // const { checkPrediction, isPredictionCorrect } = useCheckPrediction();
    const { question, questionCount, nextQuestion, getDecisionTime } = useQuestions();
    const { elapsedHoverTime, handleMouseEnter, handleMouseLeave, resetHoverTime } = useHoverTracking();
    const { changedMind, updateChoice, resetChoices } = useChoiceTracking();
    const { predictions, showPrediction, isLoadingPrediction, closePrediction } = usePrediction(questionCount);

    // useEffect(() => {
    //     if (isPredictionCorrect !== undefined) {
    //         setIsModalOpen(true);
    //     }
    // }, [isPredictionCorrect]);

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

    const onSuccess = () => {
        resetHoverTime();
        resetChoices();
        nextQuestion();
        setSelectedAnswer(null);
        setSelectedButtonId(null);
    };

    const handleOptionClick = (buttonId, answerValue) => {
        if (question.category === 'time_pressure' && optionLocked) {
            return;
        }
        
        setSelectedAnswer(answerValue);
        setSelectedButtonId(buttonId);
       
        
        handleMouseLeave(buttonId);
        updateChoice(buttonId);

        // Note: Individual predictions are disabled in favor of batch predictions
        // if (prediction !== undefined) {
        //     checkPrediction(prediction, answerValue);
        // }
    };

    const handleNextClick = (questionId) => {
        const decision_time = getDecisionTime();
        
        handleAnswerQuestion(questionId, selectedAnswer, decision_time, elapsedHoverTime, changedMind, onSuccess);
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