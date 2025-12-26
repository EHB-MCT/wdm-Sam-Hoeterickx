  require('dotenv').config();

  const cookieParser = require('cookie-parser');
  const express = require('express');
  const { MongoClient } = require('mongodb');
  const cors = require('cors');
  const session = require('express-session');

  const app = express();
  const port = 3000;

  const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/Development-V-WDM';
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
  }));
  app.use(cookieParser('abc'));

app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:3000'],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //Collections
  const answerCollection = DATABASE.collection('answers');
  const confidenceCollection = DATABASE.collection('confidence_checks');
  const questionsCollection = DATABASE.collection('questions');
  const sessionCollection = DATABASE.collection('sessions');
  const userCollection = DATABASE.collection('users');

  //Routes
  const answerRouter = require('./answers/route.js');
  // const ollamaRouter = require('./ollama/route.js');
  const confidenceRouter = require('./confidence/route.js');
  const questionRouter = require('./questions/route.js');
  const sessionRouter = require('./sessions/route.js');
  const userRouter = require('./users/route.js');

  app.use('/api/answers', answerRouter(answerCollection));
  // app.use('/api/ollama', ollamaRouter(predicitionCollection, answerCollection, questionsCollection));
  app.use('/api/confidence', confidenceRouter(confidenceCollection) )
  app.use('/api/questions', questionRouter(questionsCollection));
  app.use('/api/session', sessionRouter(sessionCollection, userCollection));
  app.use('/api/auth', userRouter(userCollection, answerCollection, sessionCollection));
  app.use('/api/users', userRouter(userCollection));

  app.get('/api/', (req, res) => {
    res.status(200).send('Hello world');
  });

  // Listen on 0.0.0.0 for Docker
  app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
  });