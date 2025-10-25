const BASE_URL = 'http://localhost:3000/api/ollama'

class OllamaService {
    async awakeOllama(){
        const response = await fetch(`${BASE_URL}/chat?prompt=hey`);

        if(!response.ok){
            throw new Error('Failed to fetch Ollama wake up');
        }

        const DATA = await response.json();
        return DATA
    }
}

export const ollamaService = new OllamaService();