require('dotenv').config();

const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

const DB_URI = process.env.DB_URI;
const CLIENT = new MongoClient(DB_URI);
const DB_NAME = 'Development-V-WDM';
const DATABASE = CLIENT.db(DB_NAME);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Collections
const questionsCollection = DATABASE.collection('questions');

//Routes
const ollamaRouter = require('./ollama/route.js');
const questionRouter = require('./questions/route.js');

app.use('/api/ollama', ollamaRouter);
app.use('/api/questions', questionRouter(questionsCollection));

app.get('/api/', (req, res) => {
  res.status(200).send('Hello world');
});


app.listen(port, () => console.log(`Server running on port ${port}`));