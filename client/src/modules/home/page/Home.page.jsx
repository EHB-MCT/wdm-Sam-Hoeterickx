import { useEffect, useState } from "react";

//Components
import { QuizUI } from "../components";

//Modals
import { showConfirmationModal } from "../../../shared/utils/modals";

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

    const { isSuccess, handleAnswerQuestion } = useAnswerQuestion();
    const { checkPrediction, isPredictionCorrect } = useCheckPrediction();
    const { question, questionCount, nextQuestion, getDecisionTime } = useQuestions();
    const { elapsedHoverTime, handleMouseEnter, handleMouseLeave, resetHoverTime } = useHoverTracking();
    const { changedMind, updateChoice, resetChoices } = useChoiceTracking();
    const { prediction, isLoadingPrediction } = usePrediction(questionCount);

    useEffect(() => {
        if(isPredictionCorrect === false){
            showConfirmationModal().then((result) => {
                if(result.isConfirmed){
                    console.log('Gebruiker is zeker');
                }else {
                    console.log('Gebruiker is niet zeker');
                }
            })
        }
    }, [isPredictionCorrect])

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
        <QuizUI
            question={question}
            selectedButtonId={selectedButtonId}
            onOptionClick={handleOptionClick}
            onNextClick={handleNextClick}
            onHoverStart={handleMouseEnter}
            onHoverEnd={handleMouseLeave}
        />
    )
}