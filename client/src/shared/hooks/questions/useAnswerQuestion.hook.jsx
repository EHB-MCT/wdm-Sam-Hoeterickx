import { useState } from "react"

/**
 * Custom hook that handles the submission of user answers to the backend.
 * Manages loading states and error handling during the API call.
 * 
 * @returns {Object} - The answer submission object
 * @property {boolean|undefined} isSuccess - True if the answer was saved successfully, false if failed, undefined if no attempt made yet
 * @property {boolean} isLoading - True while the answer is being sent to the server
 * @property {string|null} error - The error message string if the submission failed, otherwise null
 * @property {Function} handleAnswerQuestion - Function to trigger the answer submission (params: question_id, answer, times, etc.)
*/

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