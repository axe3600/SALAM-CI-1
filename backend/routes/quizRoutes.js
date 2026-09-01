import express from "express";

import {

    createQuiz,
    getQuizzesByChapter,
    getQuizById,
    updateQuiz,
    deleteQuiz,

    addQuestion,
    updateQuestion,
    deleteQuestion

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

// Tous les quiz d'un chapitre
router.get(
    "/chapter/:chapterId",
    getQuizzesByChapter
);

// Récupérer un quiz par son ID
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
