const { getAllQuestions, insertAllQuestions } = require('./model.js');

const questions = [
    {
    "_id": 12,
        "question": "Wat kies je als snack: fruit of koek?",
        "options": [
            "Fruit",
            "Koek"
        ],
        "category": "consistency"
    },
    {
        "_id": 13,
        "question": "Ochtendmens of avondmens?",
        "options": [
            "Ochtendmens",
            "Avondmens"
        ],
        "category": "preference"
    },
    {
        "_id": 16,
        "question": "Je kan nu €20 krijgen, of €50 binnen een maand. Wat kies je?",
        "options": [
            "Nu €20",
            "Binnen een maand €50"
        ],
        "category": "impulsivity"
    },
    {
        "_id": 17,
        "question": "Je moet leren maar je favoriete serie komt online. Wat doe je?",
        "options": [
            "Serie kijken",
            "Leren"
        ],
        "category": "impulsivity"
    },
    {
        "_id": 2,
        "question": "Je hebt 20% kans om €100 te verliezen. Speel je mee?",
        "options": [
            "Ja",
            "Nee"
        ],
        "category": "framing"
    },
        {
        "_id": 5,
        "question": "Je kan een veilige weg nemen (10 min) of een snelle maar gevaarlijke weg (5 min, maar kans op ongeluk). Welke kies je?",
        "options": [
            "Veilige weg",
            "Snelle weg"
        ],
        "category": "risk"
    },
    {
        "_id": 6,
        "question": "Kies binnen 3 seconden: rood of blauw?",
        "options": [
            "Rood",
            "Blauw"
        ],
        "category": "time_pressure"
    },
    {
        "_id": 9,
        "question": "Er zijn 5 mensen in gevaar, je kan 1 persoon opofferen om hen te redden. Doe je het?",
        "options": [
            "Ja",
            "Nee"
        ],
        "category": "ethics"
    },
    {
        "_id": 11,
        "question": "Je vriend spiekt op een examen en vraagt je stil te blijven. Zeg je iets?",
        "options": [
            "Ja",
            "Nee"
        ],
        "category": "ethics"
    },
    {
        "_id": 15,
        "question": "Koffie of thee?",
        "options": [
            "Koffie",
            "Thee"
        ],
        "category": "preference"
    },
    {
        "_id": 19,
        "question": "Wil je liever hogere belastingen en minder files, of lagere belastingen en meer files?",
        "options": [
            "Hogere belastingen, minder files",
            "Lagere belastingen, meer files"
        ],
        "category": "tradeoff"
    },
    {
        "_id": 20,
        "question": "Je hebt tijd voor maar één: een goed salaris of veel vrije tijd. Wat kies je?",
        "options": [
            "Goed salaris",
            "Veel vrije tijd"
        ],
        "category": "tradeoff"
    },
    {
        "_id": 1,
        "question": "Je hebt 80% kans om €100 te winnen. Speel je mee?",
        "options": [
            "Ja",
            "Nee"
        ],
        "category": "framing"
    },
    {
        "_id": 7,
        "question": "Kies binnen 3 seconden: links of rechts?",
        "options": [
            "Links",
            "Rechts"
        ],
        "category": "time_pressure"
    },
    {
        "_id": 3,
        "question": "Kies je €50 gegarandeerd, of een 50% kans op €100?",
        "options": [
            "€50 zeker",
            "50% kans op €100"
        ],
        "category": "risk"
    },
    {
        "_id": 4,
        "question": "Neem je een vaste baan met €2000/maand, of een freelance job met gemiddeld €2500 maar risico op maanden zonder werk?",
        "options": [
            "Vaste baan",
            "Freelance job"
        ],
        "category": "risk"
    },
    {
        "_id": 8,
        "question": "Wat kies je als snack: koek of fruit?",
        "options": [
            "Koek",
            "Fruit"
        ],
        "category": "consistency"
    },
    {
        "_id": 10,
        "question": "Je vindt een portemonnee met €50. Hou je hem of breng je hem terug?",
        "options": [
            "Hou hem",
            "Breng terug"
        ],
        "category": "ethics"
    },
    {
        "_id": 14,
        "question": "Stad of natuur?",
        "options": [
            "Stad",
            "Natuur"
        ],
        "category": "preference"
    },
    {
        "_id": 18,
        "question": "Kies een teamgenoot: slim maar lui, of gemiddeld slim maar hardwerkend.",
        "options": [
            "Slim maar lui",
            "Hardwerkend maar gemiddeld slim"
        ],
        "category": "tradeoff"
    }
]

const getQuestions = async(req, res, collection) => {
    try{

        const QUESTIONS = await getAllQuestions(collection);
        console.log(QUESTIONS);

        if(!QUESTIONS){
            return res.status(404).send({
                status: 404,
                message: 'Questions not found'
            })
        }

        return res.status(200).send({
            status: 200,
            message: 'Questions found successfully',
            data: QUESTIONS
        })

    }catch(error){
        console.error('Get questions error:', error);
        return res.status(500).send({
            status: 500,
            message: error.message
        })
    }
}

const addQuestions = async(req, res, collection) => {
    try{

        const result = await insertAllQuestions(collection, questions);

        if(!result){
            return res.status(400).send({
                status: 401,
                message: 'Failed to insert questions'
            });
        }

        return res.status(201).send({
            status: 201,
            message: 'Successfully inserted questions',
            data: result
        });

    }catch(error){
        console.error('Post questions error:', error);
        return res.status(500).send({
            status: 500,
            message: error.message
        });
    }
}

module.exports = {
    getQuestions,
    addQuestions
}