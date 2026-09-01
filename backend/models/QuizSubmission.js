import mongoose from "mongoose";


// ============================================================
// RÉPONSE D'UN ÉTUDIANT
// ============================================================

const answerSchema = new mongoose.Schema(
    {
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        selectedAnswer: {
            type: String,
            default: ""
        },

        // ====================================================
        // INFORMATIONS DE CORRECTION
        // ====================================================

        correctAnswer: {
            type: String,
            default: ""
        },

        isCorrect: {
            type: Boolean,
            default: false
        },

        pointsEarned: {
            type: Number,
            default: 0
        }
    },
    {
        _id: false
    }
);


// ============================================================
// SOUMISSION DU QUIZ
// ============================================================

const quizSubmissionSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
            required: true
        },

        chapter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chapter",
            required: true
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },

        answers: {
            type: [answerSchema],
            default: []
        },

        // ====================================================
        // SCORE AUTOMATIQUE
        // ====================================================

        score: {
            type: Number,
            default: 0
        },

        totalPoints: {
            type: Number,
            default: 0
        },

        percentage: {
            type: Number,
            default: 0
        },

        // ====================================================
        // STATUT
        // ====================================================

        status: {
            type: String,
            enum: [
                "submitted",
                "corrected"
            ],
            default: "submitted"
        },

        // ====================================================
        // CORRECTION PROFESSEUR
        // ====================================================

        teacherScore: {
            type: Number,
            default: null
        },

        teacherFeedback: {
            type: String,
            default: ""
        },

        correctedAt: {
            type: Date,
            default: null
        },

        correctedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        submittedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);


// ============================================================
// EMPÊCHER PLUSIEURS SOUMISSIONS DU MÊME QUIZ
// ============================================================

quizSubmissionSchema.index(
    {
        student: 1,
        quiz: 1
    },
    {
        unique: true
    }
);


export default mongoose.model(
    "QuizSubmission",
    quizSubmissionSchema
);