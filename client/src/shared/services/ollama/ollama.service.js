const BASE_URL = `${import.meta.env.VITE_API_URL}/ollama`;

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