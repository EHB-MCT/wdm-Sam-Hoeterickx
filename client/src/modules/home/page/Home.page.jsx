import { useEffect, useState } from "react";

//Components
import { QuizUI } from "../components";

//Modals
import { ConfirmationModal } from "../../../shared/utils";

//Hooks
import {
    useAnswerQuestion,
    useCheckPrediction,
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

    const { isSuccess, handleAnswerQuestion } = useAnswerQuestion();
    const { checkPrediction, isPredictionCorrect } = useCheckPrediction();
    const { question, questionCount, nextQuestion, getDecisionTime } = useQuestions();
    const { elapsedHoverTime, handleMouseEnter, handleMouseLeave, resetHoverTime } = useHoverTracking();
    const { changedMind, updateChoice, resetChoices } = useChoiceTracking();
    const { prediction, isLoadingPrediction } = usePrediction(questionCount);

    useEffect(() => {
        if (isPredictionCorrect === false) {
            setIsModalOpen(true);
        }
    }, [isPredictionCorrect]);

    const onSuccess = () => {
        resetHoverTime();
        resetChoices();
        nextQuestion();
        setSelectedAnswer(null);
        setSelectedButtonId(null);
    };

    const handleOptionClick = (buttonId, answerValue) => {
        setSelectedAnswer(answerValue);
        setSelectedButtonId(buttonId);
        
       
        handleMouseLeave(buttonId);
        updateChoice(buttonId);

        if (prediction !== undefined) {
            checkPrediction(prediction, answerValue);
        }
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
        </>
    )
}