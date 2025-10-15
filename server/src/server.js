const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ollamaRouter = require('./ollama/route.js');

app.use('/api/ollama', ollamaRouter);

app.get('/api/', (req, res) => {
  res.status(200).send('Hello world');
});


app.listen(port, () => console.log(`Server running on port ${port}`));