
import { useEffect, useState, useRef } from "react";
import { questionService } from "../../services";

export const useQuestions = () => {
    
    const [questionList, setQuestionList] = useState([]);
    const [questionCount, setQuestionCount] = useState(1);
    const [question, setQuestion] = useState();
    
    const decisionStart = useRef({});

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
              const url = `${import.meta.env.VITE_API_URL}/questions/`;
              console.log('🔍 Fetching from URL:', url);
              console.log('🔍 Full URL will be:', url);
              
              const response = await fetch(url);
              console.log('📡 Response status:', response.status);
              console.log('📡 Response headers:', response.headers);
              
              const data = await response.json();
              setQuestionList(data.data);

            } catch (error) {
              console.error('Failed to fetch questions:', error);
            }
        };

        fetchQuestions();  
    }, []);

    useEffect(() => {
        setQuestion(questionList[questionCount]);
        decisionStart.current = Date.now();
        // console.log('Current question:', question);
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