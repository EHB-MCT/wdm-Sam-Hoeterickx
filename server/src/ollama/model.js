const generateWithPrompt = async (prompt) => {
    const requestBody = {
        model: "llama3.2",
        prompt: prompt,
        stream: false,
        format: 'json' 
    };
    
    const response = await fetch("http://ollama:11434/api/generate", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const ollamaData = await response.json(); 


    return ollamaData; 
}
module.exports = {
    generateWithPrompt
}