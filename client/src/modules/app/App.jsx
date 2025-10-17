import { useEffect, useRef, useState } from "react";

//Hooks
import { useAnswerQuestion } from "../../shared/hooks/useAnswerQuestion.hook";
import { useChoiceTracking } from "../../shared/hooks/useChoiceTracking.hook";
import { useHoverTracking } from "../../shared/hooks/useHoverTracking.hook";
import { useQuestions } from "../../shared/hooks/useQuestions.hook";

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

  const { isSuccess, error, handleAnswerQuestion } = useAnswerQuestion();
  const { question, questionCount, nextQuestion, getDecisionTime } = useQuestions();
  const { elapsedHoverTime, handleMouseEnter, handleMouseLeave, resetHoverTime } = useHoverTracking();
  const { changedMind, updateChoice, resetChoices } = useChoiceTracking();

  useEffect(() => {
    fetch('http://localhost:3000/api/session/sessionId', {
      credentials: 'include',
    })
    .then(response => response.json())
    .then(data => console.log(data))
  }, [])

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
  }

  useEffect(() => {
    if(questionCount === 3) {
      console.log("count is 3");
      fetch(`http://localhost:3000/api/ollama/predict-next-answer?question_id=${questionCount}`,{
        credentials: 'include'
      })
      .then(response => response.json())
      .then(data => console.log(data));
    }
    console.log(questionCount)
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
    <div className="quiz-container">
      {
        question &&
        <div className="question-section">
          <h3 className="question-text">{ question.question }</h3>
        
          <div className="options-container">
            <button
              className={ "option-button " + (selectedOptionOne ? "selected" : "") }
              id={question.options[0]}
              onMouseEnter={ () => handleMouseEnter("option1") }
              onMouseLeave={ () => handleMouseLeave("option1") } 
              onClick={ (e) => handleButtonClick(e, "option1") }
            >
              { question.options[0] }
            </button>
            <button
              className={ "option-button " + (selectedOptionTwo ? "selected" : "") }
              id={question.options[1]}
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