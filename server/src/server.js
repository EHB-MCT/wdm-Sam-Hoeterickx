require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const session = require('express-session');

const app = express();
const port = 3000;

const DB_URI = process.env.DB_URI;
const CLIENT = new MongoClient(DB_URI);
const DB_NAME = 'Development-V-WDM';
const DATABASE = CLIENT.db(DB_NAME);

//Cookie and session
app.use(session({
  secret: 'abc',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}))
app.use(cookieParser('abc'));

app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:3000'],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Collections
const questionsCollection = DATABASE.collection('questions');
const sessionCollection = DATABASE.collection('sessions');

//Routes
const ollamaRouter = require('./ollama/route.js');
const sessionRouter = require('./sessions/route.js')
const questionRouter = require('./questions/route.js');

app.use('/api/ollama', ollamaRouter);
app.use('/api/session', sessionRouter(sessionCollection));
app.use('/api/questions', questionRouter(questionsCollection));

app.get('/api/', (req, res) => {
  res.status(200).send('Hello world');
});

// Listen on 0.0.0.0 for Docker
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});