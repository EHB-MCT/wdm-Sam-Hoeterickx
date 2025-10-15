const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Collections
const questionsCollection = ['hello', 'there', 'hellowww','world'];

//Routes
const ollamaRouter = require('./ollama/route.js');
const questionRouter = require('./questions/route.js');

app.use('/api/ollama', ollamaRouter);
app.use('/api/questions', questionRouter(questionsCollection));

app.get('/api/', (req, res) => {
  res.status(200).send('Hello world');
});


app.listen(port, () => console.log(`Server running on port ${port}`));