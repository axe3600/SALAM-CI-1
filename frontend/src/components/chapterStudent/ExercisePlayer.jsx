import {
    FaClipboardList,
    FaExternalLinkAlt,
    FaCalendarAlt
} from "react-icons/fa";

function ExercisePlayer({ exercise, getFileUrl }) {

    if (!exercise) {
        return null;
    }

    const attachmentUrl =
        exercise.attachment
            ? getFileUrl(exercise.attachment)
            : "";

    return (
        <div className="
            bg-orange-50
            border
            border-orange-100
            rounded-2xl
            p-6
        ">

            <div className="flex items-start gap-4">

                <div className="
                    w-12
                    h-12
                    rounded-xl
                    bg-orange-100
                    text-orange-600
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                ">

                    <FaClipboardList className="text-xl" />

                </div>

                <div>

                    <h4 className="
                        text-lg
                        font-bold
                        text-gray-800
                    ">
                        {exercise.title}
                    </h4>

                    {exercise.description && (
                        <p className="
                            text-gray-600
                            mt-3
                            leading-7
                        ">
                            {exercise.description}
                        </p>
                    )}

                </div>

            </div>

            {exercise.instructions && (
                <div className="
                    mt-5
                    bg-white
                    rounded-xl
                    border
                    border-orange-100
                    p-5
                ">

                    <p className="
                        font-semibold
                        text-gray-700
                        mb-2
                    ">
                        Consignes
                    </p>

                    <p className="
                        text-gray-600
                        whitespace-pre-line
                        leading-7
                    ">
                        {exercise.instructions}
                    </p>

                </div>
            )}

            <div className="
                flex
                flex-wrap
                gap-4
                mt-5
                text-sm
                text-gray-600
            ">

                <span>
                    Points : {exercise.points || 0}
                </span>

                {exercise.dueDate && (
                    <span className="
                        flex
                        items-center
                        gap-2
                    ">
                        <FaCalendarAlt />

                        Date limite :{" "}
                        {new Date(
                            exercise.dueDate
                        ).toLocaleDateString("fr-FR")}
                    </span>
                )}

            </div>

            {attachmentUrl && (
                <a
                    href={attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="
                        mt-5
                        inline-flex
                        items-center
                        gap-2
                        bg-orange-600
                        hover:bg-orange-700
                        text-white
                        px-5
                        py-3
                        rounded-xl
                        font-semibold
                        transition
                    "
                >
                    Voir la pièce jointe
                    <FaExternalLinkAlt />
                </a>
            )}

        </div>
    );
}

export default ExercisePlayer;