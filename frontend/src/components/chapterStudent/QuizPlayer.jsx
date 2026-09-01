import {
    FaQuestionCircle,
    FaPlay
} from "react-icons/fa";

function QuizPlayer({ quiz, onStart }) {

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

                <FaQuestionCircle className="
                    text-green-600
                    text-2xl
                    flex-shrink-0
                " />

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
                    Questions : {quiz.questions?.length || 0}
                </span>

                <span>
                    Points : {quiz.totalPoints || 0}
                </span>

                {quiz.duration && (
                    <span>
                        Durée : {quiz.duration} min
                    </span>
                )}

            </div>

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

        </div>
    );
}

export default QuizPlayer;