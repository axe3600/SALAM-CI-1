import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {

    createQuiz,
    getQuizzesByChapter,
    getQuizById,
    updateQuiz,
    deleteQuiz,

    addQuestion,
    updateQuestion,
    deleteQuestion,

    getMyQuizSubmission,
    submitQuiz

} from "../controllers/quizController.js";

const router = express.Router();

// ======================================================
// CRUD QUIZ
// ======================================================

// Créer un quiz
router.post(
    "/",
    createQuiz
);

// ======================================================
// TOUS LES QUIZ D'UN CHAPITRE
// ======================================================

router.get(
    "/chapter/:chapterId",
    getQuizzesByChapter
);


// ======================================================
// SOUMISSION DE L'ETUDIANT
// ======================================================

router.get(
    "/:id/submission",
    authMiddleware,
    getMyQuizSubmission
);

router.post(
    "/:id/submit",
    authMiddleware,
    submitQuiz
);


// ======================================================
// RECUPERER UN QUIZ PAR SON ID
// ======================================================

router.get(
    "/:id",
    getQuizById
);

// Modifier un quiz
router.put(
    "/:id",
    updateQuiz
);

// Supprimer un quiz
router.delete(
    "/:id",
    deleteQuiz
);

// ======================================================
// QUESTIONS
// ======================================================

// Ajouter une question
router.post(
    "/:quizId/questions",
    addQuestion
);

// Modifier une question
router.put(
    "/:quizId/questions/:questionId",
    updateQuestion
);

// Supprimer une question
router.delete(
    "/:quizId/questions/:questionId",
    deleteQuestion
);

export default router;
