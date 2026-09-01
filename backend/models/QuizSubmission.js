import mongoose from "mongoose";

// =====================================================
// REPONSE D'UN ETUDIANT
// =====================================================

const answerSchema = new mongoose.Schema(
    {
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        selectedAnswer: {
            type: Number,
            default: null
        },

        correctAnswer: {
            type: Number,
            required: true
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


// =====================================================
// SOUMISSION DU QUIZ
// =====================================================

const quizSubmissionSchema = new mongoose.Schema(
    {
        // =================================================
        // ETUDIANT
        // =================================================

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // =================================================
        // QUIZ
        // =================================================

        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
            required: true
        },


        // =================================================
        // CHAPITRE
        // =================================================

        chapter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chapter",
            required: true
        },


        // =================================================
        // COURS
        // =================================================

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },


        // =================================================
        // REPONSES
        // =================================================

        answers: {
            type: [answerSchema],
            default: []
        },


        // =================================================
        // SCORE
        // =================================================

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


        // =================================================
        // STATUT
        // =================================================

        status: {
            type: String,

            enum: [
                "submitted",
                "corrected"
            ],

            default: "submitted"
        },


        // =================================================
        // DATE DE SOUMISSION
        // =================================================

        submittedAt: {
            type: Date,
            default: Date.now
        }
    },

    {
        timestamps: true
    }
);


// =====================================================
// ANTI DOUBLE SOUMISSION
// =====================================================

quizSubmissionSchema.index(
    {
        student: 1,
        quiz: 1
    },
    {
        unique: true
    }
);


// =====================================================
// EXPORT
// =====================================================

export default mongoose.model(
    "QuizSubmission",
    quizSubmissionSchema
);