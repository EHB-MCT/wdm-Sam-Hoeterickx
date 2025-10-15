import { useEffect, useRef, useState } from "react";

//Hooks
import { useChoiceTracking } from "../../shared/hooks/useChoiceTracking.hook";
import { useHoverTracking } from "../../shared/hooks/useHoverTracking.hook";
import { useQuestions } from "../../shared/hooks/useQuestions.hook";


export const App = () => {

  const [answer, setAnswer] = useState({
    question_id: undefined,
    answer: undefined,
    descion_time: undefined,
    elapsedHoverTime: undefined,
    changedMind: undefined 
  })

  const { question, nextQuestion, getDecisionTime } = useQuestions();
  const { elapsedHoverTime, handleMouseEnter, handleMouseLeave, resetHoverTime } = useHoverTracking();
  const { changedMind, updateChoice, resetChoices } = useChoiceTracking();

  useEffect(() => {
    fetch('http://localhost:3000/api/session/sessionId', {
      credentials: 'include',
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .then(() => {
      fetch('http://localhost:3000/api/session/readCookie', {
          credentials: 'include'
        })
        .then(response => response.json())
        .then(data => console.log(data));
    })
  }, [])

  const handleButtonClick = (id) => {
    handleMouseLeave(id);
    updateChoice(id);
    setAnswer(prev => ({
      ...prev,
      answer: id
    }));
  }

  const handleNextButton = () => {
    const decisionTime = getDecisionTime()
    console.log("Decision time:", decisionTime, "s");
    console.log("Hover times:", elapsedHoverTime);
    console.log("Changed mind:", changedMind);



    handleAnswerQuestion();

    setAnswer(prev => ({
      ...prev,
      question_id: undefined,
      descion_time: decisionTime,
      elapsedHoverTime: elapsedHoverTime,
      changedMind: changedMind 
    }))

  }

  const handleAnswerQuestion = () => {
    fetch('http://localhost:3000/api/answers/saveAnswer', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({

      })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .then(() => {
      // resetHoverTime();
      // resetChoices();
      //nextQuestion();
    })
  }

  return (
    <>
      <h1>Hello World</h1>
      {
        question &&
        <>
          <h3>{ question.question }</h3>
          <button
            onMouseEnter={ () => handleMouseEnter("option1") }         
            onMouseLeave={ () => handleMouseLeave("option1") } 
            onClick={ () => handleButtonClick("option1") }
          >
            { question.options[0] }
          </button>
          <button
            onMouseEnter={ () => handleMouseEnter("option2") }    
            onMouseLeave={ () => handleMouseLeave("option2") }
            onClick={ () => handleButtonClick("option2") }
          >
            { question.options[1] }
          </button>
        </>
      }
      
      <button
        onClick={ handleNextButton }
      >
        Next
      </button>
    </>
  )
}