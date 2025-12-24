import { useEffect, useState, useRef } from "react";
// Zorg dat je dit pad aanpast naar waar jij je services hebt staan
import { questionService } from "../../services"; 

export const useQuestions = () => {
    
    const [questionList, setQuestionList] = useState([]);

    const [questionCount, setQuestionCount] = useState(() => {
        const savedQuestionId = localStorage.getItem('question_id');
        return savedQuestionId ? parseInt(savedQuestionId) : 1;
    });

    const [question, setQuestion] = useState();
    const decisionStart = useRef({});

    useEffect(() => {
        const fetchQuestions = async () => {
            
            try {
                const response = await questionService.getQuestions();
                
                if(response.data) {
                    setQuestionList(response.data);
                }

            } catch (error) {
                console.error("Fout bij ophalen vragen:", error);
            }

        };

        fetchQuestions();
    }, []);

    useEffect(() => {
        if (questionList.length > 0) {
            localStorage.setItem('question_id', questionCount.toString());
            setQuestion(questionList[questionCount]);
            decisionStart.current = Date.now();
        }
    }, [questionCount, questionList]);

    const nextQuestion = () => {
        if (questionCount < questionList.length - 1) {
            setQuestionCount(prev => prev + 1);
        }
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