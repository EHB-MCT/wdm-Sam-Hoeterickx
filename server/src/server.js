import express from "express";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).send('Hello world');
});

app.get("/api/chat", async (req, res) => {
  try {

    const prompt = req.body.prompt

    const response = await fetch("http://ollama:11434/api/generate", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2",
        prompt: prompt,
        stream: false
      }),
    });

    const data = await response.json();
    const output = data.response || "No response generated";
    
    res.send(output);

  } catch (err) {
    console.error("Ollama error:", err);
    res.status(500).json({ error: "Failed to connect to Ollama" });
  }
});


app.listen(port, () => console.log(`Server running on port ${port}`));