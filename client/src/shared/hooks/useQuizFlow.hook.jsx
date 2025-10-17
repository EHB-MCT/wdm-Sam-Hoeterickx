import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";

// Importeer al je bestaande Custom Hooks
import { useAnswerQuestion } from "../../shared/hooks/useAnswerQuestion.hook";
import { useCheckPrediction } from "../../shared/hooks/useCheckPrediction.hook";
import { useChoiceTracking } from "../../shared/hooks/useChoiceTracking.hook";
import { useHoverTracking } from "../../shared/hooks/useHoverTracking.hook";
import { useQuestions } from "../../shared/hooks/useQuestions.hook";

// Hulpfunctie (SweetAlert logica is hier geïsoleerd)
const openAreYouSure = (onConfirm, onCancel) => {
    Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonText: "Ja ik ben zeker",
        cancelButtonText: "Nee ik ben niet zeker",
    })
    .then((result) => {
        if (result.isConfirmed) {
            onConfirm();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            onCancel();
        }
    });
};

export const useQuizFlow = () => {

    const [answer, setAnswer] = useState({
        question_id: undefined,
        answer: undefined,
        decision_time: undefined,
        elapsedHoverTime: undefined,
        changedMind: undefined,
    });
    const [selectedOptionOne, setSelectedOptionOne] = useState(false);
    const [selectedOptionTwo, setSelectedOptionTwo] = useState(false);
    const [prediction, setPrediction] = useState(undefined);
    const [isLoading, setIsLoading] = useState(true);

    //Hooks
    const { handleAnswerQuestion } = useAnswerQuestion();
    const { checkPrediction, isPredictionCorrect } = useCheckPrediction();
    const { question, questionCount, nextQuestion, getDecisionTime } = useQuestions();
    const { elapsedHoverTime, handleMouseEnter, handleMouseLeave, resetHoverTime } = useHoverTracking();
    const { changedMind, updateChoice, resetChoices } = useChoiceTracking();


    //Create SESSION_ID
    useEffect(() => {
        fetch('http://localhost:3000/api/session/sessionId', {
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            console.log("Sessie data geladen:", data);
            setIsLoading(false); 
        })
        .catch(() => setIsLoading(false));
    }, []);

    //Predict next Question
    useEffect(() => {
        if (questionCount === 3) {
            setIsLoading(true);

            fetch(`http://localhost:3000/api/ollama/predict-next-answer?question_id=${questionCount}`, {
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                console.log("Voorspelling geladen:", data);
                setPrediction(data.prediction);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
        }
    }, [questionCount]);

    //Reset tracking for next question
    const onSuccess = useCallback(() => {
        resetHoverTime();
        resetChoices();
        nextQuestion();
        setSelectedOptionOne(false);
        setSelectedOptionTwo(false);
    }, [resetHoverTime, resetChoices, nextQuestion]);


    const handleNextButton = useCallback((e) => {
        const decision_time = getDecisionTime();
        const selected_answer = answer.answer;
        const question_id = e.target.id;
        const elapsed_hover_time = elapsedHoverTime;
        const changed_mind = changedMind;

        setAnswer(prev => ({
            ...prev,
            question_id: question_id,
            decision_time: decision_time,
            elapsed_hover_time: elapsedHoverTime,
            changed_mind: changedMind
        }));

        handleAnswerQuestion(question_id, selected_answer, decision_time, elapsed_hover_time, changed_mind, onSuccess);
    }, [answer.answer, changedMind, elapsedHoverTime, getDecisionTime, handleAnswerQuestion, onSuccess]);


    const handleButtonClick = useCallback((e, id) => {

        if (id === "option1") {
            setSelectedOptionOne(true);
            setSelectedOptionTwo(false);
        } else if (id === "option2") {
            setSelectedOptionTwo(true);
            setSelectedOptionOne(false);
        }

        handleMouseLeave(id);
        updateChoice(id);
        setAnswer(prev => ({
            ...prev,
            answer: e.target.value
        }));


        if (prediction !== undefined) {
            checkPrediction(prediction, e.target.value);

            if (!isPredictionCorrect) {
                openAreYouSure(
                () => console.log("Gebruiker is zeker!"),
                () => console.log("Gebruiker is niet zeker.") 
                );
            }
        }
    }, [checkPrediction, handleMouseLeave, isPredictionCorrect, prediction, updateChoice]);


    return {
        isLoading,
        question,
        selectedOptionOne,
        selectedOptionTwo,
        handleButtonClick,
        handleMouseEnter: (id) => handleMouseEnter(id),
        handleMouseLeave: (id) => handleMouseLeave(id),
        handleNextButton,
    };
};