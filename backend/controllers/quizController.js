import Quiz from "../models/Quiz.js";
import QuizSubmission from "../models/QuizSubmission.js";
import Chapter from "../models/Chapter.js";
import Notification from "../models/Notification.js";

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


// ======================================================
// VERIFIER SI L'ETUDIANT A DEJA SOUMIS LE QUIZ
// GET /api/quizzes/:id/submission
// ======================================================
export const getMyQuizSubmission = async (req, res) => {

    try {

        // =================================================
        // VERIFIER L'UTILISATEUR
        // =================================================

        if (req.user?.role !== "student") {

            return res.status(403).json({
                success: false,
                message: "Cette action est réservée aux étudiants."
            });

        }


        const submission =
            await QuizSubmission.findOne({

                quiz: req.params.id,

                student: req.user._id

            })
            .populate(
                "quiz",
                "title totalPoints"
            );


        // =================================================
        // PAS ENCORE SOUMIS
        // =================================================

        if (!submission) {

            return res.json({

                success: true,

                submitted: false,

                submission: null

            });

        }


        // =================================================
        // DEJA SOUMIS
        // =================================================

        return res.json({

            success: true,

            submitted: true,

            submission

        });

    }

    catch (error) {

        console.error(
            "❌ Erreur récupération soumission quiz :",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Impossible de récupérer l'état du quiz."

        });

    }

};


// ======================================================
// SOUMETTRE UN QUIZ
// POST /api/quizzes/:id/submit
// ======================================================

export const submitQuiz = async (req, res) => {

    try {

        // =================================================
        // VERIFIER L'UTILISATEUR
        // =================================================

        if (req.user?.role !== "student") {

            return res.status(403).json({

                success: false,

                message:
                    "Seuls les étudiants peuvent soumettre un quiz."

            });

        }


        // =================================================
        // RECUPERER LE QUIZ
        // =================================================

        const quiz =
            await Quiz.findById(req.params.id);


        if (!quiz) {

            return res.status(404).json({

                success: false,

                message: "Quiz introuvable."

            });

        }


        // =================================================
        // VERIFIER UNE SOUMISSION EXISTANTE
        // =================================================

        const existingSubmission =
            await QuizSubmission.findOne({

                quiz: quiz._id,

                student: req.user._id

            });


        if (existingSubmission) {

            return res.status(409).json({

                success: false,

                alreadySubmitted: true,

                message:
                    "Vous avez déjà soumis ce quiz.",

                submission:
                    existingSubmission

            });

        }


        // =================================================
        // RECUPERER LE CHAPITRE ET LE COURS
        // =================================================

        const chapter =
            await Chapter.findById(
                quiz.chapter
            ).populate("course");


        if (!chapter) {

            return res.status(404).json({

                success: false,

                message:
                    "Chapitre associé au quiz introuvable."

            });

        }


        if (!chapter.course) {

            return res.status(404).json({

                success: false,

                message:
                    "Cours associé au chapitre introuvable."

            });

        }


        const course =
            chapter.course;


        // =================================================
        // VERIFIER LE PROFESSEUR
        // =================================================

        if (!course.teacher) {

            return res.status(400).json({

                success: false,

                message:
                    "Aucun enseignant n'est associé à ce cours."

            });

        }


        // =================================================
        // REPONSES RECUES
        // =================================================

        const receivedAnswers =
            req.body?.answers || {};


        // =================================================
        // CALCUL DU SCORE COTE SERVEUR
        // =================================================

        let score = 0;


        const answers = quiz.questions.map(
            (question, index) => {

                const rawAnswer =
                    receivedAnswers[index];


                const hasAnswer =
                    rawAnswer !== undefined &&
                    rawAnswer !== null &&
                    rawAnswer !== "";


                const selectedAnswer =
                    hasAnswer
                        ? Number(rawAnswer)
                        : null;


                const isCorrect =
                    selectedAnswer !== null &&
                    selectedAnswer ===
                    Number(question.correctAnswer);


                const pointsEarned =
                    isCorrect
                        ? Number(question.points) || 0
                        : 0;


                if (isCorrect) {

                    score += pointsEarned;

                }


                return {

                    questionId:
                        question._id,

                    selectedAnswer,

                    correctAnswer:
                        Number(question.correctAnswer),

                    isCorrect,

                    pointsEarned

                };

            }
        );


        // =================================================
        // TOTAL DES POINTS
        // =================================================

        const totalPoints =
            quiz.questions.reduce(

                (total, question) =>

                    total +
                    (Number(question.points) || 0),

                0

            );


        const percentage =
            totalPoints > 0
                ? Math.round(
                    (score / totalPoints) * 100
                )
                : 0;


        // =================================================
        // CREER LA SOUMISSION
        // =================================================

        let submission;


        try {

            submission =
                await QuizSubmission.create({

                    student:
                        req.user._id,

                    quiz:
                        quiz._id,

                    chapter:
                        chapter._id,

                    course:
                        course._id,

                    answers,

                    score,

                    totalPoints,

                    percentage,

                    status: "submitted",

                    submittedAt:
                        new Date()

                });

        }

        catch (error) {

            // ---------------------------------------------
            // Protection supplémentaire contre un double
            // envoi simultané
            // ---------------------------------------------

            if (error?.code === 11000) {

                const duplicate =
                    await QuizSubmission.findOne({

                        quiz: quiz._id,

                        student: req.user._id

                    });

                return res.status(409).json({

                    success: false,

                    alreadySubmitted: true,

                    message:
                        "Vous avez déjà soumis ce quiz.",

                    submission:
                        duplicate

                });

            }

            throw error;

        }


        // =================================================
        // NOM DE L'ETUDIANT
        // =================================================

        const studentName =
            req.user.firstName ||
            req.user.name ||
            "Un étudiant";


        // =================================================
        // NOTIFICATION DU PROFESSEUR
        // =================================================

        await Notification.create({

            recipient:
                course.teacher,

            sender:
                req.user._id,

            title:
                "Nouveau quiz soumis",

            message:
                `${studentName} a terminé le quiz « ${quiz.title} » du cours « ${course.title} ».`,

            type:
                "quiz",

            entityType:
                "quiz",

            entityId:
                quiz._id,

            isRead:
                false

        });


        // =================================================
        // REPONSE
        // =================================================

        return res.status(201).json({

            success: true,

            message:
                "Quiz envoyé au professeur avec succès.",

            submitted: true,

            submission

        });

    }

    catch (error) {

        console.error(
            "❌ Erreur soumission quiz :",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Impossible d'envoyer le quiz."

        });

    }

};