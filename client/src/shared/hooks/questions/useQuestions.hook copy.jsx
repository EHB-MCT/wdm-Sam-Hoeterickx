
import { useEffect, useState, useRef } from "react";
import { questionService } from "../../services";

export const useQuestions = () => {
    
    const [questionList, setQuestionList] = useState([]);
    const [questionCount, setQuestionCount] = useState(0);
    const [question, setQuestion] = useState();
    
    const decisionStart = useRef({});

    useEffect(() => {
        const fetchQuestions = async() => {
            try{
                const data = await questionService.getQuestions();
                setQuestionList(data.data);
                // console.log('QuestionList:', questionList);
            }catch(error){ 
                console.error('Failed to fetch questions:', error);
            }
        }

        fetchQuestions();  
    }, []);

    useEffect(() => {
        const currentQuestionId = localStorage.getItem('question_id');

        if(currentQuestionId === '1'){
            setQuestion(questionList[questionCount]);
        }else {
            setQuestion(questionList[currentQuestionId]);
        }
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