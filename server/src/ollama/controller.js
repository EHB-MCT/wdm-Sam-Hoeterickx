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

}

module.exports = {
    handlePrompt,
    generatePrediction
}