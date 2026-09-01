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

                message:
                    "Cette action est réservée aux étudiants."

            });

        }


        // =================================================
        // RECHERCHER LA SOUMISSION
        // =================================================

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
        // SI LE QUIZ EST EN ATTENTE DE CORRECTION
        // =================================================

        if (submission.status === "submitted") {

            const safeAnswers =
                submission.answers.map(answer => ({

                    questionId:
                        answer.questionId,

                    selectedAnswer:
                        answer.selectedAnswer

                }));


            return res.json({

                success: true,

                submitted: true,

                status: "submitted",

                submission: {

                    _id:
                        submission._id,

                    quiz:
                        submission.quiz,

                    student:
                        submission.student,

                    chapter:
                        submission.chapter,

                    course:
                        submission.course,

                    answers:
                        safeAnswers,

                    status:
                        "submitted",

                    submittedAt:
                        submission.submittedAt

                }

            });

        }


        // =================================================
        // QUIZ CORRIGÉ
        // =================================================

        return res.json({

            success: true,

            submitted: true,

            status: "corrected",

            submission

        });

    }

    catch (error) {

        console.error(
            "Erreur récupération soumission quiz :",
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

                    submitted: true,

                    status:
                        existingSubmission.status,

                    submission: {

                        _id:
                            existingSubmission._id,

                        quiz:
                            existingSubmission.quiz,

                        chapter:
                            existingSubmission.chapter,

                        course:
                            existingSubmission.course,

                        status:
                            existingSubmission.status,

                        submittedAt:
                            existingSubmission.submittedAt

                    }

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

                    submitted: true,

                    status:
                        duplicate?.status || "submitted",

                    submission: duplicate
                        ? {

                            _id:
                                duplicate._id,

                            quiz:
                                duplicate.quiz,

                            chapter:
                                duplicate.chapter,

                            course:
                                duplicate.course,

                            status:
                                duplicate.status,

                            submittedAt:
                                duplicate.submittedAt

                        }
                        : null

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

            status: "submitted",

            submission: {

                _id:
                    submission._id,

                quiz:
                    submission.quiz,

                chapter:
                    submission.chapter,

                course:
                    submission.course,

                status:
                    submission.status,

                submittedAt:
                    submission.submittedAt

            }

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


// ======================================================
// RECUPERER LES SOUMISSIONS D'UN QUIZ POUR LE PROFESSEUR
// GET /api/quizzes/:id/submissions
// ======================================================

export const getQuizSubmissionsForTeacher = async (req, res) => {

    try {

        // =================================================
        // VERIFIER LE PROFESSEUR
        // =================================================

        if (req.user?.role !== "teacher") {

            return res.status(403).json({

                success: false,

                message:
                    "Cette action est réservée aux enseignants."

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

                message:
                    "Quiz introuvable."

            });

        }


        // =================================================
        // RECUPERER LE CHAPITRE
        // =================================================

        const chapter =
            await Chapter.findById(
                quiz.chapter
            ).populate("course");


        if (!chapter || !chapter.course) {

            return res.status(404).json({

                success: false,

                message:
                    "Cours associé au quiz introuvable."

            });

        }


        // =================================================
        // VERIFIER QUE LE PROFESSEUR POSSÈDE LE COURS
        // =================================================

        if (
            String(chapter.course.teacher) !==
            String(req.user._id)
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Vous n'êtes pas l'enseignant de ce cours."

            });

        }


        // =================================================
        // RECUPERER LES SOUMISSIONS
        // =================================================

        const submissions =
            await QuizSubmission.find({

                quiz: quiz._id

            })
            .populate(
                "student",
                "firstName lastName name email"
            )
            .sort({
                submittedAt: -1
            });


        return res.json({

            success: true,

            quiz: {

                _id:
                    quiz._id,

                title:
                    quiz.title,

                totalPoints:
                    quiz.totalPoints

            },

            course: {

                _id:
                    chapter.course._id,

                title:
                    chapter.course.title

            },

            chapter: {

                _id:
                    chapter._id,

                title:
                    chapter.title

            },

            submissions

        });

    }

    catch (error) {

        console.error(
            "Erreur récupération soumissions professeur :",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Impossible de récupérer les soumissions."

        });

    }

};


// ======================================================
// RECUPERER UNE SOUMISSION POUR LE PROFESSEUR
// GET /api/quizzes/submissions/:submissionId
// ======================================================

export const getTeacherQuizSubmission = async (req, res) => {

    try {

        // =================================================
        // VERIFIER LE PROFESSEUR
        // =================================================

        if (req.user?.role !== "teacher") {

            return res.status(403).json({

                success: false,

                message:
                    "Cette action est réservée aux enseignants."

            });

        }


        // =================================================
        // RECUPERER LA SOUMISSION
        // =================================================

        const submission =
            await QuizSubmission.findById(
                req.params.submissionId
            )
            .populate(
                "student",
                "firstName lastName name email"
            )
            .populate(
                "quiz"
            )
            .populate(
                "chapter"
            )
            .populate(
                "course"
            );


        if (!submission) {

            return res.status(404).json({

                success: false,

                message:
                    "Soumission introuvable."

            });

        }


        // =================================================
        // VERIFIER LE PROFESSEUR
        // =================================================

        if (
            !submission.course ||
            String(submission.course.teacher) !==
            String(req.user._id)
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Vous n'êtes pas autorisé à consulter cette soumission."

            });

        }


        return res.json({

            success: true,

            submission

        });

    }

    catch (error) {

        console.error(
            "Erreur récupération soumission :",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Impossible de récupérer la soumission."

        });

    }

};


// ======================================================
// CORRIGER / VALIDER UNE SOUMISSION
// PATCH /api/quizzes/submissions/:submissionId/correct
// ======================================================

export const correctQuizSubmission = async (req, res) => {

    try {

        // =================================================
        // VERIFIER LE PROFESSEUR
        // =================================================

        if (req.user?.role !== "teacher") {

            return res.status(403).json({

                success: false,

                message:
                    "Cette action est réservée aux enseignants."

            });

        }


        // =================================================
        // RECUPERER LA SOUMISSION
        // =================================================

        const submission =
            await QuizSubmission.findById(
                req.params.submissionId
            )
            .populate("student")
            .populate("quiz")
            .populate("course");


        if (!submission) {

            return res.status(404).json({

                success: false,

                message:
                    "Soumission introuvable."

            });

        }


        // =================================================
        // VERIFIER LE COURS
        // =================================================

        if (
            !submission.course ||
            String(submission.course.teacher) !==
            String(req.user._id)
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Vous n'êtes pas autorisé à corriger cette soumission."

            });

        }


        // =================================================
        // EVITER UNE DOUBLE VALIDATION
        // =================================================

        if (submission.status === "corrected") {

            return res.status(409).json({

                success: false,

                message:
                    "Cette soumission a déjà été corrigée."

            });

        }


        // =================================================
        // NOTE PROFESSEUR
        // =================================================

        const requestedScore =
            req.body?.teacherScore;


        let teacherScore =
            Number(requestedScore);


        // Si aucune note n'est fournie,
        // on utilise le score automatique.

        if (
            requestedScore === undefined ||
            requestedScore === null ||
            requestedScore === ""
        ) {

            teacherScore =
                Number(submission.score) || 0;

        }


        const totalPoints =
            Number(submission.totalPoints) || 0;


        // =================================================
        // VERIFIER LA NOTE
        // =================================================

        if (
            Number.isNaN(teacherScore) ||
            teacherScore < 0 ||
            teacherScore > totalPoints
        ) {

            return res.status(400).json({

                success: false,

                message:
                    `La note doit être comprise entre 0 et ${totalPoints}.`

            });

        }


        // =================================================
        // CALCUL POURCENTAGE FINAL
        // =================================================

        const finalPercentage =
            totalPoints > 0
                ? Math.round(
                    (teacherScore / totalPoints) * 100
                )
                : 0;


        // =================================================
        // ENREGISTRER LA CORRECTION
        // =================================================

        submission.teacherScore =
            teacherScore;

        submission.teacherFeedback =
            req.body?.teacherFeedback || "";

        submission.correctedAt =
            new Date();

        submission.correctedBy =
            req.user._id;

        submission.status =
            "corrected";


        // On conserve également la note officielle
        // dans score / percentage pour faciliter
        // les statistiques existantes.

        submission.score =
            teacherScore;

        submission.percentage =
            finalPercentage;


        await submission.save();


        // =================================================
        // NOTIFICATION ETUDIANT
        // =================================================

        if (submission.student?._id) {

            const teacherName =
                req.user.firstName ||
                req.user.name ||
                "Votre enseignant";


            await Notification.create({

                recipient:
                    submission.student._id,

                sender:
                    req.user._id,

                title:
                    "Quiz corrigé",

                message:
                    `${teacherName} a corrigé votre quiz « ${submission.quiz.title} ». Votre note est de ${teacherScore}/${totalPoints}.`,

                type:
                    "quiz",

                entityType:
                    "quiz",

                entityId:
                    submission.quiz._id,

                isRead:
                    false

            });

        }


        // =================================================
        // REPONSE
        // =================================================

        return res.json({

            success: true,

            message:
                "Quiz corrigé et validé avec succès.",

            submission

        });

    }

    catch (error) {

        console.error(
            "Erreur correction quiz :",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Impossible de corriger le quiz."

        });

    }

};
