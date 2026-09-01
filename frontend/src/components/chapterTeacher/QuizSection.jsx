// ============================================================
// IMPORTS
// ============================================================

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import {
    FaQuestionCircle,
    FaPlus,
    FaEdit,
    FaTrash,
    FaList,
    FaClipboardCheck
} from "react-icons/fa";

import QuizModal from "./AddQuizModal";
import DeleteQuizModal from "./DeleteQuizModal";


// ============================================================
// COMPONENT
// ============================================================

function QuizSection({ chapterId }) {

    // ========================================================
    // QUIZZES
    // ========================================================

    const [quizzes, setQuizzes] = useState([]);

    const [loading, setLoading] = useState(true);


    // ========================================================
    // NOMBRE DE SOUMISSIONS
    // ========================================================

    const [submissionCounts, setSubmissionCounts] =
        useState({});


    // ========================================================
    // MODALS
    // ========================================================

    const [showModal, setShowModal] = useState(false);

    const [selectedQuiz, setSelectedQuiz] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [quizToDelete, setQuizToDelete] = useState(null);


    // ========================================================
    // RECUPERER LES QUIZ
    // ========================================================

    const fetchQuizzes = async () => {

        try {

            const res = await axios.get(

                `https://salam-ci-backend.onrender.com/api/quizzes/chapter/${chapterId}`

            );

            const quizList =
                res.data || [];

            setQuizzes(quizList);

            // =================================================
            // RECUPERER LE NOMBRE DE SOUMISSIONS
            // =================================================

            const counts = {};

            await Promise.all(

                quizList.map(async (quiz) => {

                    try {

                        const response =
                            await axios.get(

                                `https://salam-ci-backend.onrender.com/api/quizzes/${quiz._id}/submissions`

                            );

                        counts[quiz._id] =
                            response.data?.submissions?.length || 0;

                    }

                    catch (error) {

                        // =================================================
                        // Si le professeur n'a pas accès ou si la requête
                        // échoue, on affiche simplement 0.
                        // =================================================

                        console.error(
                            `Erreur soumissions quiz ${quiz._id}:`,
                            error
                        );

                        counts[quiz._id] = 0;

                    }

                })

            );

            setSubmissionCounts(counts);

        }

        catch (error) {

            console.error(
                "Erreur récupération quiz :",
                error
            );

        }

        finally {

            setLoading(false);

        }

    };


    // ========================================================
    // SUPPRIMER UN QUIZ
    // ========================================================

    const deleteQuiz = async (id) => {

        try {

            await axios.delete(

                `https://salam-ci-backend.onrender.com/api/quizzes/${id}`

            );

            setShowDeleteModal(false);

            setQuizToDelete(null);

            fetchQuizzes();

        }

        catch (error) {

            console.error(
                "Erreur suppression quiz :",
                error
            );

        }

    };


    // ========================================================
    // CHARGEMENT INITIAL
    // ========================================================

    useEffect(() => {

        fetchQuizzes();

    }, [chapterId]);


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <div className="bg-gray-50 rounded-3xl p-8 mt-8">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex justify-between items-center">

                <div className="flex items-center gap-3">

                    <FaQuestionCircle
                        className="
                            text-indigo-600
                            text-3xl
                        "
                    />

                    <h2 className="text-3xl font-bold">

                        Quiz

                    </h2>

                </div>


                <button

                    onClick={() => {

                        setSelectedQuiz(null);

                        setShowModal(true);

                    }}

                    className="
                        bg-indigo-600
                        hover:bg-indigo-700
                        text-white
                        px-6
                        py-3
                        rounded-xl
                        flex
                        items-center
                        gap-3
                    "

                >

                    <FaPlus />

                    Ajouter un Quiz

                </button>

            </div>


            {/* =================================================
                LISTE
            ================================================= */}

            <div className="mt-8">

                {loading ? (

                    <p>

                        Chargement...

                    </p>

                ) : quizzes.length === 0 ? (

                    <div className="text-center py-16">

                        <FaQuestionCircle
                            className="
                                mx-auto
                                text-6xl
                                text-indigo-200
                            "
                        />

                        <h3
                            className="
                                text-2xl
                                font-bold
                                mt-6
                            "
                        >

                            Aucun Quiz

                        </h3>

                    </div>

                ) : (

                    quizzes.map((quiz) => {

                        const submissionCount =
                            submissionCounts[quiz._id] || 0;

                        return (

                            <div

                                key={quiz._id}

                                className="
                                    bg-white
                                    rounded-2xl
                                    shadow
                                    p-6
                                    mb-5
                                "

                            >

                                {/* =========================================
                                    INFORMATIONS QUIZ
                                ========================================= */}

                                <div className="flex justify-between">

                                    <div>

                                        <h3
                                            className="
                                                text-xl
                                                font-bold
                                            "
                                        >

                                            {quiz.title}

                                        </h3>


                                        <p
                                            className="
                                                text-gray-500
                                                mt-2
                                            "
                                        >

                                            {quiz.description}

                                        </p>


                                        <div
                                            className="
                                                mt-4
                                                flex
                                                items-center
                                                gap-2
                                                text-indigo-600
                                            "
                                        >

                                            <FaList />

                                            {quiz.questions?.length || 0}

                                            {" "}

                                            Questions

                                        </div>

                                    </div>


                                    {/* =====================================
                                        ACTIONS
                                    ===================================== */}

                                    <div
                                        className="
                                            flex
                                            gap-3
                                        "
                                    >

                                        <button

                                            onClick={() => {

                                                setSelectedQuiz(quiz);

                                                setShowModal(true);

                                            }}

                                            title="Modifier le quiz"

                                            className="
                                                bg-green-600
                                                hover:bg-green-700
                                                text-white
                                                p-3
                                                rounded-xl
                                            "

                                        >

                                            <FaEdit />

                                        </button>


                                        <button

                                            onClick={() => {

                                                setQuizToDelete(quiz);

                                                setShowDeleteModal(true);

                                            }}

                                            title="Supprimer le quiz"

                                            className="
                                                bg-red-600
                                                hover:bg-red-700
                                                text-white
                                                p-3
                                                rounded-xl
                                            "

                                        >

                                            <FaTrash />

                                        </button>

                                    </div>

                                </div>


                                {/* =========================================
                                    SOUMISSIONS
                                ========================================= */}

                                <div
                                    className="
                                        mt-6
                                        pt-5
                                        border-t
                                        border-gray-100
                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >

                                        <div
                                            className="
                                                w-10
                                                h-10
                                                rounded-xl
                                                bg-purple-100
                                                text-purple-600
                                                flex
                                                items-center
                                                justify-center
                                            "
                                        >

                                            <FaClipboardCheck />

                                        </div>


                                        <div>

                                            <p
                                                className="
                                                    font-semibold
                                                    text-gray-800
                                                "
                                            >

                                                Soumissions

                                            </p>


                                            <p
                                                className="
                                                    text-sm
                                                    text-gray-500
                                                "
                                            >

                                                {submissionCount === 0

                                                    ? "Aucune soumission"

                                                    : `${submissionCount} soumission${submissionCount > 1 ? "s" : ""}`
                                                }

                                            </p>

                                        </div>

                                    </div>


                                    {/* =====================================
                                        BOUTON SOUMISSIONS
                                    ===================================== */}

                                    <Link

                                        to={`/teacher-quiz-submissions/${quiz._id}`}

                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            bg-purple-600
                                            hover:bg-purple-700
                                            text-white
                                            px-5
                                            py-3
                                            rounded-xl
                                            font-semibold
                                            transition
                                        "

                                    >

                                        <FaClipboardCheck />

                                        Voir les soumissions

                                    </Link>

                                </div>

                            </div>

                        );

                    })

                )}

            </div>


            {/* =================================================
                MODAL QUIZ
            ================================================= */}

            <QuizModal

                isOpen={showModal}

                onClose={() => {

                    setShowModal(false);

                    setSelectedQuiz(null);

                }}

                chapterId={chapterId}

                quiz={selectedQuiz}

                onQuizCreated={fetchQuizzes}

            />


            {/* =================================================
                MODAL SUPPRESSION
            ================================================= */}

            <DeleteQuizModal

                isOpen={showDeleteModal}

                quiz={quizToDelete}

                onClose={() => {

                    setShowDeleteModal(false);

                    setQuizToDelete(null);

                }}

                onConfirm={() => {

                    if (quizToDelete?._id) {

                        deleteQuiz(
                            quizToDelete._id
                        );

                    }

                }}

            />

        </div>

    );

}


export default QuizSection;