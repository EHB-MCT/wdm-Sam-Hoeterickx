import { useState } from "react"

export const useAnswerQuestion = () => {

    const [isSuccess, setIsSuccess] = useState(undefined);
    const [error, setError] = useState({
        status: undefined,
        message: undefined
    })

    const handleAnswerQuestion = (question_id, selected_answer, decision_time, elapsed_hover_time, changed_mind, onSuccess) => {
        const currentQuestionId = parseInt(question_id) - 1;
        
        fetch('http://localhost:3000/api/answers/saveAnswer', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify({
                question_id: currentQuestionId,
                selected_answer: selected_answer,
                decision_time: decision_time,
                elapsed_hover_time: elapsed_hover_time,
                changed_mind: changed_mind
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.status === 201){
                setIsSuccess(true);
                onSuccess();
            }
            
            if(data.status !== 201){
                setIsSuccess(false);
                setError({
                    status: data.status,
                    message: data.message
                });
            }
        })
    }

    return { isSuccess, error, handleAnswerQuestion}
}