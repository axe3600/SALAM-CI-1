import Quiz from "../models/Quiz.js";

// ======================================================
// CREER UN QUIZ
// ======================================================
export const createQuiz = async (req,res)=>{

    try{
    
    
    const {
    
    title,
    
    description,
    
    duration,
    
    passingScore,
    
    chapter,
    
    questions
    
    
    }=req.body;

    
    const totalPoints = questions.reduce(

        (total,q)=> total + q.points,
        
        0
        
        );

    
    const quiz = await Quiz.create({
    
    title,
    
    description,
    
    duration,
    
    passingScore,
    
    chapter,
    
    questions,

    totalPoints
    
    });
    
    
    res.status(201).json(quiz);
    
    
    }
    
    
    catch(error){
    
    res.status(500).json({
    
    message:error.message
    
    });
    
    
    }
    
    
    };
// ======================================================
// TOUS LES QUIZ D'UN CHAPITRE
// ======================================================
export const getQuizzesByChapter = async (req, res) => {

    try {

        const quizzes = await Quiz.find({

            chapter: req.params.chapterId

        });

        res.json(quizzes);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ======================================================
// RECUPERER UN QUIZ PAR SON ID
// GET /api/quizzes/:id
// ======================================================
export const getQuizById = async (req, res) => {

    try {

        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {

            return res.status(404).json({

                message: "Quiz introuvable."

            });

        }

        res.status(200).json(quiz);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


// ======================================================
// MODIFIER UN QUIZ
// ======================================================
export const updateQuiz = async (req, res) => {

    try {

        const quiz = await Quiz.findByIdAndUpdate(

            req.params.id,

            req.body,

            {

                new: true

            }

        );

        res.json(quiz);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ======================================================
// SUPPRIMER UN QUIZ
// ======================================================
export const deleteQuiz = async (req, res) => {

    try {

        await Quiz.findByIdAndDelete(

            req.params.id

        );

        res.json({

            message: "Quiz supprimé."

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ======================================================
// AJOUTER UNE QUESTION
// ======================================================
export const addQuestion = async (req, res) => {

    try {

        const quiz = await Quiz.findById(

            req.params.quizId

        );

        if (!quiz) {

            return res.status(404).json({

                message: "Quiz introuvable."

            });

        }

        quiz.questions.push(req.body);

        await quiz.save();

        res.json(quiz);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ======================================================
// MODIFIER UNE QUESTION
// ======================================================
export const updateQuestion = async (req, res) => {

    try {

        const quiz = await Quiz.findById(

            req.params.quizId

        );

        if (!quiz) {

            return res.status(404).json({

                message: "Quiz introuvable."

            });

        }

        const question = quiz.questions.id(

            req.params.questionId

        );

        if (!question) {

            return res.status(404).json({

                message: "Question introuvable."

            });

        }

        question.question = req.body.question;
        question.options = req.body.options;
        question.correctAnswer = req.body.correctAnswer;
        question.points = req.body.points;

        await quiz.save();

        res.json(quiz);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ======================================================
// SUPPRIMER UNE QUESTION
// ======================================================
export const deleteQuestion = async (req, res) => {

    try {

        const quiz = await Quiz.findById(

            req.params.quizId

        );

        if (!quiz) {

            return res.status(404).json({

                message: "Quiz introuvable."

            });

        }

        quiz.questions.pull(

            req.params.questionId

        );

        await quiz.save();

        res.json({

            message: "Question supprimée."

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};