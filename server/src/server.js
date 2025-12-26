require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

// Connectie string (werkt voor Docker én Lokaal als fallback)
const DB_URI = process.env.MONGO_URI || process.env.DB_URI || 'mongodb://localhost:27017/Development-V-WDM';
const CLIENT = new MongoClient(DB_URI);
const DB_NAME = 'Development-V-WDM';

// --- DE 20 VRAGEN VOOR DE DATABASE ---
const INITIAL_QUESTIONS = [
    { "_id": 1, "question": "Je hebt 80% kans om €100 te winnen. Speel je mee?", "options": ["Ja", "Nee"], "category": "framing" },
    { "_id": 2, "question": "Je hebt 20% kans om €100 te verliezen. Speel je mee?", "options": ["Ja", "Nee"], "category": "framing" },
    { "_id": 3, "question": "Kies je €50 gegarandeerd, of een 50% kans op €100?", "options": ["€50 zeker", "50% kans op €100"], "category": "risk" },
    { "_id": 4, "question": "Neem je een vaste baan met €2000/maand, of een freelance job met gemiddeld €2500 maar risico op maanden zonder werk?", "options": ["Vaste baan", "Freelance job"], "category": "risk" },
    { "_id": 5, "question": "Je kan een veilige weg nemen (10 min) of een snelle maar gevaarlijke weg (5 min, maar kans op ongeluk). Welke kies je?", "options": ["Veilige weg", "Snelle weg"], "category": "risk" },
    { "_id": 6, "question": "Kies binnen 3 seconden: rood of blauw?", "options": ["Rood", "Blauw"], "category": "time_pressure" },
    { "_id": 7, "question": "Kies binnen 3 seconden: links of rechts?", "options": ["Links", "Rechts"], "category": "time_pressure" },
    { "_id": 8, "question": "Wat kies je als snack: koek of fruit?", "options": ["Koek", "Fruit"], "category": "consistency" },
    { "_id": 9, "question": "Er zijn 5 mensen in gevaar, je kan 1 persoon opofferen om hen te redden. Doe je het?", "options": ["Ja", "Nee"], "category": "ethics" },
    { "_id": 10, "question": "Je vindt een portemonnee met €50. Hou je hem of breng je hem terug?", "options": ["Hou hem", "Breng terug"], "category": "ethics" },
    { "_id": 11, "question": "Je vriend spiekt op een examen en vraagt je stil te blijven. Zeg je iets?", "options": ["Ja", "Nee"], "category": "ethics" },
    { "_id": 12, "question": "Wat kies je als snack: fruit of koek?", "options": ["Fruit", "Koek"], "category": "consistency" },
    { "_id": 13, "question": "Ochtendmens of avondmens?", "options": ["Ochtendmens", "Avondmens"], "category": "preference" },
    { "_id": 14, "question": "Stad of natuur?", "options": ["Stad", "Natuur"], "category": "preference" },
    { "_id": 15, "question": "Koffie of thee?", "options": ["Koffie", "Thee"], "category": "preference" },
    { "_id": 16, "question": "Je kan nu €20 krijgen, of €50 binnen een maand. Wat kies je?", "options": ["Nu €20", "Binnen een maand €50"], "category": "impulsivity" },
    { "_id": 17, "question": "Je moet leren maar je favoriete serie komt online. Wat doe je?", "options": ["Serie kijken", "Leren"], "category": "impulsivity" },
    { "_id": 18, "question": "Kies een teamgenoot: slim maar lui, of gemiddeld slim maar hardwerkend.", "options": ["Slim maar lui", "Hardwerkend maar gemiddeld slim"], "category": "tradeoff" },
    { "_id": 19, "question": "Wil je liever hogere belastingen en minder files, of lagere belastingen en meer files?", "options": ["Hogere belastingen, minder files", "Lagere belastingen, meer files"], "category": "tradeoff" },
    { "_id": 20, "question": "Je hebt tijd voor maar één: een goed salaris of veel vrije tijd. Wat kies je?", "options": ["Goed salaris", "Veel vrije tijd"], "category": "tradeoff" }
];

async function startServer() {
    try {
        console.log(`Verbinden met database op ${DB_URI}...`);
        await CLIENT.connect();
        console.log('Succesvol verbonden met MongoDB!');

        const DATABASE = CLIENT.db(DB_NAME);

        // Collections
        const questionsCollection = DATABASE.collection('questions');
        const sessionCollection = DATABASE.collection('sessions');
        const answerCollection = DATABASE.collection('answers');
        // Let op: predictionCollection is weggehaald omdat Ollama weg is.

        // --- SEEDING: Vul DB als deze leeg is ---
        const count = await questionsCollection.countDocuments();
        if (count === 0) {
            console.log("Geen vragen gevonden. Database wordt gevuld...");
            await questionsCollection.insertMany(INITIAL_QUESTIONS);
            console.log("20 Vragen toegevoegd!");
        } else {
            console.log(`Er zijn al ${count} vragen in de database.`);
        }

        // Middleware
        app.use(session({
            secret: 'abc',
            resave: false,
            saveUninitialized: false,
            cookie: { httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 * 24 }
        }));
        app.use(cookieParser('abc'));
        
        app.use(cors({
            origin: ['http://localhost:8080', 'http://localhost:3000'],
            credentials: true,
            allowedHeaders: ["Content-Type", "Authorization"]
        }));

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // Routes (Zonder Ollama)
        const answerRouter = require('./answers/route.js');
        const sessionRouter = require('./sessions/route.js');
        const questionRouter = require('./questions/route.js');

        app.use('/api/answers', answerRouter(answerCollection));
        app.use('/api/session', sessionRouter(sessionCollection));
        app.use('/api/questions', questionRouter(questionsCollection));
        // Ollama route is verwijderd

        app.get('/api/', (req, res) => res.status(200).send('Hello world'));

        app.listen(port, '0.0.0.0', () => {
            console.log(`Server running on port ${port}`);
        });

    } catch (error) {
        console.error("FATAL ERROR: Kan server niet starten:", error);
        process.exit(1);
    }
}

startServer();