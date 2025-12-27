const BASE_URL = `${import.meta.env.VITE_API_URL}/questions`;

/**
 * Service class responsible for fetching questions and saving answers.
*/

class QuestionService{

    /**
     * Fetches all quiz questions from the API.
     * 
     * @returns {Promise<Object>} The list of questions
     * @throws {Error} If fetching fails
    */
    async getQuestions(){
        const response = await fetch(`${BASE_URL}/`);
        if(!response.ok){
            throw new Error('Failed to fetch questions:');
        }

        const DATA = await response.json();
        return DATA;
    }
}

export const questionService = new QuestionService();