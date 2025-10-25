const BASE_URL = 'http://localhost:3000/api/questions';

class QuestionService{
    async getQuestions(){
        const response = await fetch(`${BASE_URL}/questions`);
        
        if(!response.ok){
            throw new Error('Failed to fetch questions:');
        }

        const DATA = await response.json();
        return DATA;
    }
}

export const questionService = new QuestionService();