
import { useEffect, useState, useRef } from "react";

export const useQuestions = () => {
    
    const [questionList, setQuestionList] = useState([]);
    const [questionCount, setQuestionCount] = useState(1);
    const [question, setQuestion] = useState();
    
    const decisionStart = useRef({});

    useEffect(() => {
        fetch('http://localhost:3000/api/questions/questions')
        .then(response => response.json())
        .then(data => setQuestionList(data.data));
    }, [])

    useEffect(() => {
        setQuestion(questionList[questionCount]);
        decisionStart.current = Date.now();
    }, [questionCount, questionList]);

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