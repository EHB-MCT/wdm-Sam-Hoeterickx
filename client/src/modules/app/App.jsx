import { useEffect, useRef, useState } from "react"

//Data
import questions from '../../shared/data/questions.json';

export const App = () => {

  const [elapsedHoverTime, setElapsedHoverTime] = useState({ option1: 0, option2: 0});
  const [changedMind, setChangedMind] = useState({ option1: 0, option2: 0});

  useEffect(() => {
    setQuestion(questions[questionCount]);
  }, [questionCount])

  const handleNextButton = () => {
    setQuestionCount( questionCount + 1);
    setElapsedHoverTime({ option1: 0, option2: 0});
    setChangedMind({ option1: 0, option2: 0});
    
    updateDecisionTime();
  }

  const handleMouseEnter = (id) => {
    // console.log('hover start', id);
    hoverStart.current[id] = Date.now();
    console.log(hoverStart.current[id])
  }

  const handleMouseLeave = (id) => {
    console.log('hover stop', id);

    const start = hoverStart.current[id];

    if (start) {
      const duration = ((Date.now() - start) / 1000);

      // console.log(`hoverTime: ${duration}s`);

      hoverStart.current[id] = null;

      addHoverTime(id, duration);
    }
  }
  
  const addHoverTime = (optionId, duration) => {
    console.log('Add hover time:', optionId, duration);
    setElapsedHoverTime( prev => (
      {
        ...prev,
        [optionId]: ( prev[optionId] || 0 ) + duration
      }
    ))
  }

  const updateChoice = (optionId) => {
    setChangedMind( prev => ({
      ...prev,
      [optionId]: ( prev[optionId] || 0 ) + 1
    }));
  }

  const handleButtonClick = (id) => {
    handleMouseLeave(id);
    updateChoice(id);
  }

  const updateDecisionTime = () => {
    const start = decisionStart.current;

    if(start){
      const duration = ((Date.now() - start) / 1000);
      console.log(typeof duration)
      console.log(`decisionTime: ${duration}s`);
    }

    decisionStart.current = Date.now();
  }

  useEffect(() => {
    // console.log("option1:", elapsedHoverTime.option1, changedMind.option1, "option2:", elapsedHoverTime.option2, changedMind.option2);
  }, [elapsedHoverTime, changedMind])

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