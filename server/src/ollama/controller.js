
const { findAllAnswerWithSessionId } = require('../answers/model');
const { findNextQuestion } = require('../questions/model');

const handlePrompt = async (req, res) => {
    try {

        console.log('start');

        const prompt = req.body.prompt;
        console.log(prompt);

        const response = await fetch("http://ollama:11434/api/generate", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama3.2",
                prompt: prompt,
                stream: false
            })
        });

        if(!response){
            return res.status(400).send({
                status: 400,
                message: 'Error while generating answer'
            });
        }

        const data = await response.json();
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
        if(!answers){
            return res.status(404).send({
                status: 404,
                message: 'No answers found with matching session id'
            });
        }
        
        const nextQuestion = await findNextQuestion(questionsCollection, QUESTION_ID);
        if(!nextQuestion){
            return res.status(404).send({
                status: 404,
                message: 'No question found'
            });
        }


        console.log(nextQuestion);



    }catch(error){
        console.error('Error while generating prediction');
        return res.status(500).send({
            status: 500,
            message: error.message
        })
    }

}

module.exports = {
    handlePrompt,
    generatePrediction
}