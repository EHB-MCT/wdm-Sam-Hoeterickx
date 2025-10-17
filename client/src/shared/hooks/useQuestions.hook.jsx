
import { useEffect, useState, useRef } from "react";
//Data
import questions from "../data/questions.json";

export const useQuestions = () => {
    
    const [questionCount, setQuestionCount] = useState(1);
    const [question, setQuestion] = useState();
    
    const decisionStart = useRef({});

    useEffect(() => {
        // console.log(questions);
        setQuestion(questions[questionCount]);
        decisionStart.current = Date.now();
    }, [questionCount]);

    const nextQuestion = () => {
        setQuestionCount(prev => prev + 1);
        decisionStart.current = Date.now();
    };

    const getDecisionTime = () => {
        if (!decisionStart.current){
            return 0
        } else {
            const duration = (Date.now() - decisionStart.current) / 1000;
            return duration;
        }
       
    };

    return { question, questionCount, nextQuestion, getDecisionTime };
}