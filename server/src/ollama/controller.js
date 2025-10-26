
const { findAllAnswerWithSessionId } = require('../answers/model');
const { findNextQuestion } = require('../questions/model');
const { generateWithPrompt } = require('./model.js');

const handlePrompt = async (req, res) => {
    try {

        const prompt = req.query.prompt;
        console.log(prompt);

       const response = await generateWithPrompt(prompt);

        if(!response){
            return res.status(400).send({
                status: 400,
                message: 'Error while generating answer'
            });
        }

        const data = response;
        const output = data.response || "No response generated";
        
        return res.send(output);

    } catch (err) {
        console.error("Ollama error:", err);
        return res.status(500).json({ error: "Failed to connect to Ollama" });
    }
}

const generatePrediction = async (req, res, collection, answerCollection, questionsCollection ) => {

    try{
        const QUESTION_ID = parseInt(req.query.question_id);
        const SESSION_ID = req.signedCookies.session;

        const answers = await findAllAnswerWithSessionId(answerCollection, SESSION_ID);
        const nextQuestion = await findNextQuestion(questionsCollection, QUESTION_ID);

        if(!answers || !nextQuestion){
            return res.status(404).send({
                status: 404,
                message: 'Not found'
            });
        }

        const prompt = `
            You are an expert prediction model analyzing user behavior in a questionnaire. Your task is to predict the user's answer to the next question based on their previous responses and behavioral data (decision time, hover time, and changes of mind).
            
            Analyze the Previous Answers data to infer the user's risk appetite and preference patterns.
            
            Previous Answers:
            ${JSON.stringify(answers, null, 2)}
            
            Next Question:
            ${JSON.stringify(nextQuestion, null, 2)}

            Output your prediction as a JSON object with a single key, "predicted_answer", where the value is one of the options from the Next Question. **DO NOT** include any other text or explanation.
        `;

        const ollamaData = await generateWithPrompt(prompt);
        const predictionJson = JSON.parse(ollamaData.response);
        const prediction = predictionJson.predicted_answer;

        console.log(prediction);

        return res.status(200).send({
            status: 200,
            prediction: prediction
        });

    }catch(error){
        console.error('Error while generating prediction:', error);
        return res.status(500).send({
            status: 500,
            message: error.message
        });
    }
}
module.exports = {
    handlePrompt,
    generatePrediction
}