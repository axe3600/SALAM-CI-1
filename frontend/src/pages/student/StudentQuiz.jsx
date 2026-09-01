import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaCheckCircle,
    FaQuestionCircle
} from "react-icons/fa";

import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../services/api";

function StudentQuiz() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);

    const [answers, setAnswers] = useState({});

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [submitted, setSubmitted] = useState(false);

    const [score, setScore] = useState(0);


    // ======================================
    // CHARGER LE QUIZ
    // ======================================

    useEffect(() => {

        const loadQuiz = async () => {

            try {

                setLoading(true);

                setError("");

                console.log(
                    "QUIZ À CHARGER :",
                    id
                );

                const response = await API.get(
                    `/quizzes/${id}`
                );

                console.log(
                    "QUIZ CHARGÉ :",
                    response.data
                );

                setQuiz(response.data);

            }

            catch (error) {

                console.error(
                    "Erreur chargement quiz :",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Impossible de charger le quiz."
                );

            }

            finally {

                setLoading(false);

            }

        };

        if (id) {

            loadQuiz();

        }

    }, [id]);


    // ======================================
    // CHOISIR UNE REPONSE
    // ======================================

    const handleAnswer = (
        questionIndex,
        answerIndex
    ) => {

        if (submitted) {
            return;
        }

        setAnswers((previous) => ({

            ...previous,

            [questionIndex]: answerIndex

        }));

    };


    // ======================================
    // ENVOYER LE QUIZ
    // ======================================

    const handleSubmit = () => {

        if (!quiz?.questions?.length) {
            return;
        }

        let totalScore = 0;

        quiz.questions.forEach(
            (question, index) => {

                const selectedAnswer =
                    answers[index];

                if (
                    selectedAnswer !== undefined &&
                    Number(selectedAnswer) ===
                    Number(question.correctAnswer)
                ) {

                    totalScore +=
                        Number(question.points) || 0;

                }

            }
        );

        setScore(totalScore);

        setSubmitted(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // ======================================
    // CHARGEMENT
    // ======================================

    if (loading) {

        return (

            <DashboardLayout>

                <div className="
                    min-h-[70vh]
                    flex
                    items-center
                    justify-center
                ">

                    <div className="
                        text-center
                    ">

                        <div className="
                            w-12
                            h-12
                            border-4
                            border-purple-200
                            border-t-purple-600
                            rounded-full
                            animate-spin
                            mx-auto
                        " />

                        <p className="
                            mt-4
                            text-gray-500
                        ">

                            Chargement du quiz...

                        </p>

                    </div>

                </div>

            </DashboardLayout>

        );

    }


    // ======================================
    // ERREUR
    // ======================================

    if (error) {

        return (

            <DashboardLayout>

                <div className="
                    max-w-3xl
                    mx-auto
                    mt-10
                ">

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="
                            inline-flex
                            items-center
                            gap-3
                            text-gray-600
                            hover:text-purple-600
                            font-semibold
                        "
                    >

                        <FaArrowLeft />

                        Retour à la formation

                    </button>


                    <div className="
                        mt-8
                        bg-red-50
                        border
                        border-red-200
                        rounded-2xl
                        p-6
                        text-red-700
                    ">

                        <p className="font-semibold">

                            {error}

                        </p>

                    </div>

                </div>

            </DashboardLayout>

        );

    }


    // ======================================
    // QUIZ INTROUVABLE
    // ======================================

    if (!quiz) {

        return (

            <DashboardLayout>

                <div className="
                    max-w-3xl
                    mx-auto
                    mt-10
                ">

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="
                            inline-flex
                            items-center
                            gap-3
                            text-gray-600
                            hover:text-purple-600
                            font-semibold
                        "
                    >

                        <FaArrowLeft />

                        Retour à la formation

                    </button>


                    <div className="
                        mt-8
                        bg-yellow-50
                        border
                        border-yellow-200
                        rounded-2xl
                        p-6
                        text-yellow-800
                    ">

                        Quiz introuvable.

                    </div>

                </div>

            </DashboardLayout>

        );

    }


    const questions =
        Array.isArray(quiz.questions)
            ? quiz.questions
            : [];


    const answeredCount =
        Object.keys(answers).length;


    const percentage =
        quiz.totalPoints > 0
            ? Math.round(
                (score / quiz.totalPoints) * 100
            )
            : 0;


    // ======================================
    // AFFICHAGE
    // ======================================

    return (

        <DashboardLayout>

            <div className="
                max-w-4xl
                mx-auto
                pb-12
            ">


                {/* RETOUR */}

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="
                        inline-flex
                        items-center
                        gap-3
                        text-gray-600
                        hover:text-purple-600
                        font-semibold
                    "
                >

                    <FaArrowLeft />

                    Retour à la formation

                </button>


                {/* ENTETE */}

                <div className="
                    bg-white
                    rounded-3xl
                    shadow-md
                    p-8
                    mt-6
                ">

                    <div className="
                        flex
                        items-start
                        gap-4
                    ">

                        <div className="
                            w-14
                            h-14
                            rounded-2xl
                            bg-green-100
                            text-green-600
                            flex
                            items-center
                            justify-center
                            flex-shrink-0
                        ">

                            <FaQuestionCircle
                                className="text-2xl"
                            />

                        </div>


                        <div>

                            <h1 className="
                                text-3xl
                                font-bold
                                text-gray-900
                            ">

                                {quiz.title}

                            </h1>


                            {quiz.description && (

                                <p className="
                                    text-gray-600
                                    mt-2
                                    leading-7
                                ">

                                    {quiz.description}

                                </p>

                            )}


                            <div className="
                                flex
                                flex-wrap
                                gap-4
                                mt-4
                                text-sm
                                text-gray-500
                            ">

                                <span>

                                    {questions.length}
                                    {" "}
                                    question
                                    {questions.length > 1
                                        ? "s"
                                        : ""}

                                </span>


                                <span>

                                    {quiz.totalPoints || 0}
                                    {" "}
                                    point
                                    {(quiz.totalPoints || 0) > 1
                                        ? "s"
                                        : ""}

                                </span>


                                {quiz.duration && (

                                    <span>

                                        Durée :
                                        {" "}
                                        {quiz.duration}
                                        {" "}
                                        min

                                    </span>

                                )}

                            </div>

                        </div>

                    </div>

                </div>


                {/* RESULTAT */}

                {submitted && (

                    <div className="
                        mt-6
                        bg-green-50
                        border
                        border-green-200
                        rounded-3xl
                        p-7
                    ">

                        <div className="
                            flex
                            items-center
                            gap-4
                        ">

                            <FaCheckCircle
                                className="
                                    text-green-600
                                    text-3xl
                                "
                            />


                            <div>

                                <h2 className="
                                    text-xl
                                    font-bold
                                    text-green-800
                                ">

                                    Quiz terminé

                                </h2>


                                <p className="
                                    text-green-700
                                    mt-1
                                ">

                                    Votre score :
                                    {" "}
                                    <strong>
                                        {score}
                                    </strong>
                                    {" / "}
                                    {quiz.totalPoints || 0}
                                    {" "}
                                    ({percentage}%)

                                </p>

                            </div>

                        </div>

                    </div>

                )}


                {/* QUESTIONS */}

                <div className="
                    space-y-6
                    mt-6
                ">

                    {questions.length === 0 ? (

                        <div className="
                            bg-yellow-50
                            border
                            border-yellow-200
                            rounded-2xl
                            p-6
                            text-yellow-800
                        ">

                            Ce quiz ne contient
                            aucune question.

                        </div>

                    ) : (

                        questions.map(
                            (question, questionIndex) => (

                                <div
                                    key={
                                        question._id ||
                                        questionIndex
                                    }
                                    className="
                                        bg-white
                                        rounded-3xl
                                        shadow-md
                                        p-7
                                    "
                                >

                                    <div className="
                                        flex
                                        items-start
                                        justify-between
                                        gap-4
                                    ">

                                        <h2 className="
                                            text-lg
                                            font-bold
                                            text-gray-900
                                        ">

                                            {questionIndex + 1}.
                                            {" "}
                                            {question.question}

                                        </h2>


                                        <span className="
                                            text-sm
                                            text-gray-500
                                            whitespace-nowrap
                                        ">

                                            {question.points || 0}
                                            {" "}
                                            pt

                                        </span>

                                    </div>


                                    <div className="
                                        space-y-3
                                        mt-5
                                    ">

                                        {Array.isArray(
                                            question.options
                                        ) && question.options.map(
                                            (
                                                option,
                                                optionIndex
                                            ) => {

                                                const selected =
                                                    answers[
                                                        questionIndex
                                                    ] ===
                                                    optionIndex;

                                                let optionClass = `
                                                    w-full
                                                    text-left
                                                    p-4
                                                    rounded-xl
                                                    border
                                                    transition
                                                `;

                                                if (
                                                    submitted
                                                ) {

                                                    if (
                                                        optionIndex ===
                                                        Number(
                                                            question.correctAnswer
                                                        )
                                                    ) {

                                                        optionClass += `
                                                            bg-green-50
                                                            border-green-500
                                                            text-green-800
                                                        `;

                                                    }

                                                    else if (
                                                        selected
                                                    ) {

                                                        optionClass += `
                                                            bg-red-50
                                                            border-red-400
                                                            text-red-800
                                                        `;

                                                    }

                                                    else {

                                                        optionClass += `
                                                            bg-gray-50
                                                            border-gray-200
                                                            text-gray-600
                                                        `;

                                                    }

                                                }

                                                else if (
                                                    selected
                                                ) {

                                                    optionClass += `
                                                        bg-purple-50
                                                        border-purple-500
                                                        text-purple-800
                                                    `;

                                                }

                                                else {

                                                    optionClass += `
                                                        bg-white
                                                        border-gray-200
                                                        hover:border-purple-400
                                                    `;

                                                }


                                                return (

                                                    <button
                                                        key={
                                                            optionIndex
                                                        }
                                                        type="button"
                                                        disabled={
                                                            submitted
                                                        }
                                                        onClick={() =>
                                                            handleAnswer(
                                                                questionIndex,
                                                                optionIndex
                                                            )
                                                        }
                                                        className={
                                                            optionClass
                                                        }
                                                    >

                                                        <span className="
                                                            font-medium
                                                        ">

                                                            {String.fromCharCode(
                                                                65 +
                                                                optionIndex
                                                            )}.

                                                        </span>

                                                        {" "}

                                                        {option}

                                                    </button>

                                                );

                                            }
                                        )}

                                    </div>

                                </div>

                            )
                        )

                    )}

                </div>


                {/* VALIDATION */}

                {questions.length > 0 && !submitted && (

                    <div className="
                        bg-white
                        rounded-3xl
                        shadow-md
                        p-7
                        mt-6
                    ">

                        <div className="
                            flex
                            flex-col
                            sm:flex-row
                            items-center
                            justify-between
                            gap-4
                        ">

                            <p className="
                                text-gray-600
                            ">

                                {answeredCount}
                                {" / "}
                                {questions.length}
                                {" "}
                                question
                                {questions.length > 1
                                    ? "s"
                                    : ""}
                                {" "}
                                répondue
                                {answeredCount > 1
                                    ? "s"
                                    : ""}

                            </p>


                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={
                                    answeredCount <
                                    questions.length
                                }
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    bg-green-600
                                    hover:bg-green-700
                                    disabled:bg-gray-300
                                    disabled:cursor-not-allowed
                                    text-white
                                    px-6
                                    py-3
                                    rounded-xl
                                    font-semibold
                                "
                            >

                                <FaCheckCircle />

                                Valider le quiz

                            </button>

                        </div>

                    </div>

                )}


                {/* RETOUR APRES RESULTAT */}

                {submitted && (

                    <div className="
                        flex
                        justify-center
                        mt-6
                    ">

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="
                                inline-flex
                                items-center
                                gap-2
                                bg-purple-600
                                hover:bg-purple-700
                                text-white
                                px-6
                                py-3
                                rounded-xl
                                font-semibold
                            "
                        >

                            <FaArrowLeft />

                            Retour à la formation

                        </button>

                    </div>

                )}

            </div>

        </DashboardLayout>

    );

}

export default StudentQuiz;