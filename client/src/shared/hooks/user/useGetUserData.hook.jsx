import { useState } from "react";
import { userService } from "../../services"

/**
 * Custom hook that fetches and manages the current user's data.
 * 
 * @returns {Object} - The user data management object
 * @property {Function} getMyData - Function to trigger the API call to fetch user data
 * @property {Object|undefined} user - The user object containing profile details (undefined until fetched)
 * @property {Object|undefined} answerData - The answerData object containing details about the answered questions (undefined until fetched)
 * @property {Object|undefined} decisionData - The decisionData object containing details about de confidence they had (undefined until fetched)
 * @property {boolean} isLoading - True while the data fetch is in progress
 * @property {boolean} isError - True if an error occurred during the fetch
 * @property {Object|boolean} error - The error object ({status, message}) if failed, otherwise false
*/

export const useGetUserData = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(false);
    const [decisionData, setDecisionData] = useState();
    const [answerData, setAnswerData] = useState();
    const [user, setUser] = useState();

    const getMyData = async() => {
        setIsLoading(true);

        try{
            const data = await userService.getUserData();
            console.log(data);

            setUser(data.data.user);
            setAnswerData(data.data.answers)
            setDecisionData(data.data.confidenceData);
            
            setIsLoading(false)

        }catch(error){
            setIsError(true);
            setError({
                status: error.status, 
                message: error.message
            });
        }finally{
            setIsLoading(false)
        }
    }

    return { getMyData, user, answerData, decisionData, isLoading, isError, error };
}