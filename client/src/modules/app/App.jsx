import { useEffect, useRef, useState } from "react";

//Hooks
import { useChoiceTracking } from "../../shared/hooks/useChoiceTracking.hook";
import { useHoverTracking } from "../../shared/hooks/useHoverTracking.hook";
import { useQuestions } from "../../shared/hooks/useQuestions.hook";


export const App = () => {

  const [answer, setAnswer] = useState({
    question_id: undefined,
    answer: undefined,
    decision_time: undefined,
    elapsedHoverTime: undefined,
    changedMind: undefined 
  });

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
    handleMouseLeave(id);
    updateChoice(id);
    setAnswer(prev => ({
      ...prev,
      answer: e.target.id
    }));
  }

  useEffect(() => {
    if(questionCount === 3) {
      console.log("count is 4");
      //Add logic to get al the answers with this SESSION_ID and send it to ollama to make a prediction
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
    
    handleAnswerQuestion(question_id, selected_answer, decision_time, elapsed_hover_time, changed_mind);
  }

  const handleAnswerQuestion = (question_id, selected_answer, decision_time, elapsed_hover_time, changed_mind) => {
    fetch('http://localhost:3000/api/answers/saveAnswer', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': "application/json"
      },
      body: JSON.stringify({
        question_id: question_id,
        selected_answer: selected_answer,
        decision_time: decision_time,
        elapsed_hover_time: elapsed_hover_time,
        changed_mind: changed_mind
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      resetHoverTime();
      resetChoices();
      nextQuestion();
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
            id={question.options[0]}
            onMouseEnter={ () => handleMouseEnter("option1") }         
            onMouseLeave={ () => handleMouseLeave("option1") } 
            onClick={ (e) => handleButtonClick(e, "option1") }
          >
            { question.options[0] }
          </button>
          <button
            id={question.options[1]}
            onMouseEnter={ () => handleMouseEnter("option2") }    
            onMouseLeave={ () => handleMouseLeave("option2") }
            onClick={ (e) => handleButtonClick(e, "option2") }
          >
            { question.options[1] }
          </button>
          <button
            onClick={ (e) => handleNextButton(e) }
            id={question._id}
          >
            Next
          </button>
        </>
      }
      

    </>
  )
}