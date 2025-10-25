import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

//Hooks
import { useAnswerQuestion } from "../../shared/hooks/questions/useAnswerQuestion.hook";
import { useCheckPrediction } from "../../shared/hooks/prediction/useCheckPrediction.hook";
import { useChoiceTracking } from "../../shared/hooks/tracking/useChoiceTracking.hook";
import { useHoverTracking } from "../../shared/hooks/tracking/useHoverTracking.hook";
import { useQuestions } from "../../shared/hooks/questions/useQuestions.hook";

import './app.css'

export const App = () => {

  const [answer, setAnswer] = useState({
    question_id: undefined,
    answer: undefined,
    decision_time: undefined,
    elapsedHoverTime: undefined,
    changedMind: undefined 
  });
  const [selectedOptionOne, setSelectedOptionOne] = useState(false);
  const [selectedOptionTwo, setSelectedOptionTwo] = useState(false);
  const [prediction, setPrediction] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const { isSuccess, error, handleAnswerQuestion } = useAnswerQuestion();
  const { checkPrediction, isPredictionCorrect } = useCheckPrediction();
  const { question, questionCount, nextQuestion, getDecisionTime } = useQuestions();
  const { elapsedHoverTime, handleMouseEnter, handleMouseLeave, resetHoverTime } = useHoverTracking();
  const { changedMind, updateChoice, resetChoices } = useChoiceTracking();

  const handleButtonClick = (e, id) => {
    if(id === "option1"){
      setSelectedOptionOne(true);
      setSelectedOptionTwo(false);
    }else if(id === "option2"){
      setSelectedOptionTwo(true);
      setSelectedOptionOne(false);
    }
    handleMouseLeave(id);
    updateChoice(id);
    setAnswer(prev => ({
      ...prev,
      answer: e.target.id
    }));

    if(prediction !== undefined){
      checkPrediction(prediction, e.target.value);

      if(!isPredictionCorrect){
        openAreYouSure()
      }
    }
    console.log(e.target.value)
  }

  const openAreYouSure = () => {
    Swal.fire({
      title: "Are you sure?",
      showCancelButton: true, 
      
      confirmButtonText: "Ja ik ben zeker", 
      cancelButtonText: "Nee ik ben niet zeker", 
      
    }).then((result) => {
        if (result.isConfirmed) {
            console.log("Gebruiker is zeker!");
            
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            console.log("Gebruiker is niet zeker.");
        }
    });
  }

  useEffect(() => {

    if(questionCount === 3) {
      setIsLoading(true);

      fetch(`http://localhost:3000/api/ollama/predict-next-answer?question_id=${questionCount}`,{
        credentials: 'include'
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setPrediction(data.prediction);
        setIsLoading(false);
      });
    }
  }, [questionCount])

  const handleNextButton = (e) => {
    const decision_time = getDecisionTime();
    const selected_answer = answer.answer;
    const question_id = e.target.id;
    const elapsed_hover_time = elapsedHoverTime;
    const changed_mind = changedMind;
    
    setAnswer(prev => ({
      ...prev,
      question_id: e.target.id,
      decision_time: decision_time,
      elapsed_hover_time: elapsedHoverTime,
      changed_mind: changedMind 
    }));
    
    handleAnswerQuestion(question_id, selected_answer, decision_time, elapsed_hover_time, changed_mind, onSuccess);
  }

  const onSuccess = () => {
    resetHoverTime();
    resetChoices();
    nextQuestion();
    setSelectedOptionOne(false);
    setSelectedOptionTwo(false);
  }
 
  return (
    <>
      {
        isLoading === true ? (<h1>Loading...</h1>) : (
          <div className="quiz-container">
            {
              question &&
              <div className="question-section">
                <h3 className="question-text">{ question.question }</h3>
              
                <div className="options-container">
                  <button
                    className={ "option-button " + (selectedOptionOne ? "selected" : "") }
                    id={question.options[0]}
                    value={question.options[0]}
                    onMouseEnter={ () => handleMouseEnter("option1") }
                    onMouseLeave={ () => handleMouseLeave("option1") } 
                    onClick={ (e) => handleButtonClick(e, "option1") }
                  >
                    { question.options[0] }
                  </button>
                  <button
                    className={ "option-button " + (selectedOptionTwo ? "selected" : "") }
                    id={question.options[1]}
                    value={question.options[1]}
                    onMouseEnter={ () => handleMouseEnter("option2") }
                    onMouseLeave={ () => handleMouseLeave("option2") }
                    onClick={ (e) => handleButtonClick(e, "option2") }
                  >
                    { question.options[1] }
                  </button>
                </div>

                <button
                  className="next-button"
                  onClick={ (e) => handleNextButton(e) }
                  id={question._id}
                >
                  Next
                </button>
              </div>
            }
          </div>
        )
      }
    </>
  )
}