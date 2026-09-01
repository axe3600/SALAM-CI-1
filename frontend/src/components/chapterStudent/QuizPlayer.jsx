import { useEffect, useState } from "react";

import {
    FaQuestionCircle,
    FaPlay,
    FaCheckCircle
} from "react-icons/fa";

import API from "../../services/api";


function QuizPlayer({
    quiz,
    onStart
}) {

    const [submitted, setSubmitted] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [submission, setSubmission] =
        useState(null);


    // ======================================
    // VERIFIER L'ETAT DU QUIZ
    // ======================================

    useEffect(() => {

        let mounted = true;


        const loadSubmission =
            async () => {

                if (!quiz?._id) {

                    setLoading(false);

                    return;

                }


                try {

                    setLoading(true);


                    const response =
                        await API.get(
                            `/quizzes/${quiz._id}/submission`
                        );


                    if (!mounted) {
                        return;
                    }


                    setSubmitted(
                        response.data?.submitted === true
                    );


                    setSubmission(
                        response.data?.submission ||
                        null
                    );

                }

                catch (error) {

                    console.error(
                        "❌ Erreur état quiz :",
                        error
                    );

                }

                finally {

                    if (mounted) {

                        setLoading(false);

                    }

                }

            };


        loadSubmission();


        return () => {

            mounted = false;

        };

    }, [quiz?._id]);


    if (!quiz) {

        return null;

    }


    return (

        <div className="
            bg-green-50
            border
            border-green-100
            rounded-2xl
            p-6
        ">

            <div className="
                flex
                items-start
                justify-between
                gap-4
            ">

                <div>

                    <h4 className="
                        font-bold
                        text-gray-800
                        text-lg
                    ">

                        {quiz.title}

                    </h4>


                    {quiz.description && (

                        <p className="
                            text-gray-600
                            text-sm
                            mt-2
                            leading-6
                        ">

                            {quiz.description}

                        </p>

                    )}

                </div>


                <FaQuestionCircle
                    className="
                        text-green-600
                        text-2xl
                        flex-shrink-0
                    "
                />

            </div>


            <div className="
                flex
                flex-wrap
                gap-4
                mt-5
                text-sm
                text-gray-600
            ">

                <span>

                    Questions :
                    {" "}
                    {quiz.questions?.length || 0}

                </span>


                <span>

                    Points :
                    {" "}
                    {quiz.totalPoints || 0}

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


            {/* ==========================================
                QUIZ DEJA ENVOYE
            ========================================== */}

            {!loading && submitted && (

                <div className="
                    mt-5
                    bg-white
                    border
                    border-green-200
                    rounded-xl
                    p-4
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                        text-green-700
                        font-semibold
                    ">

                        <FaCheckCircle />

                        Quiz envoyé au professeur

                    </div>


                    <p className="
                        text-sm
                        text-green-600
                        mt-2
                    ">

                        Votre quiz a bien été soumis.

                    </p>


                    {submission && (

                        <p className="
                            text-sm
                            text-gray-600
                            mt-1
                        ">

                            Score :
                            {" "}
                            <strong>
                                {submission.score}
                            </strong>
                            {" / "}
                            {submission.totalPoints}

                        </p>

                    )}

                </div>

            )}


            {/* ==========================================
                COMMENCER
            ========================================== */}

            {!loading && !submitted && (

                <button
                    type="button"
                    onClick={onStart}
                    className="
                        mt-5
                        inline-flex
                        items-center
                        gap-2
                        bg-green-600
                        hover:bg-green-700
                        text-white
                        px-5
                        py-3
                        rounded-xl
                        font-semibold
                        transition
                    "
                >

                    <FaPlay />

                    Commencer le quiz

                </button>

            )}


            {/* ==========================================
                CHARGEMENT ETAT
            ========================================== */}

            {loading && (

                <div className="
                    mt-5
                    text-sm
                    text-gray-500
                ">

                    Vérification du quiz...

                </div>

            )}

        </div>

    );

}


export default QuizPlayer;