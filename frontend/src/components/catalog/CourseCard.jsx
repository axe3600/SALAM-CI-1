// ======================================
// ICÔNES
// ======================================
import {
    FaStar,
    FaUsers,
    FaClock,
    FaSignal,
    FaArrowRight,
    FaEye,
    FaDownload
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

function CourseCard({ course }) {

    // ======================================
    // NAVIGATION
    // ======================================
    const navigate = useNavigate();

    // ======================================
    // NOM DE L'ENSEIGNANT
    // Compatible avec objet MongoDB ou texte
    // ======================================
    const teacherName =
        typeof course.teacher === "object"
            ? course.teacher?.name || "Enseignant"
            : course.teacher || "Enseignant";

    // ======================================
    // PREMIÈRE LETTRE DE L'ENSEIGNANT
    // ======================================
    const teacherInitial =
        teacherName.charAt(0).toUpperCase();

    // ======================================
    // IMAGE DU COURS
    // ======================================
    const courseImage =
        course.thumbnail ||
        course.image ||
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3";

    // ======================================
    // PRIX
    // ======================================
    const formattedPrice =
        course.price !== null &&
        course.price !== undefined
            ? `${Number(course.price).toLocaleString("fr-FR")} FCFA`
            : "Prix non défini";

    // ======================================
    // VOIR LE COURS
    // ======================================
    const handleViewCourse = () => {

        // ID MongoDB réel
        const courseId = course._id || course.id;

        if (!courseId) {
            console.error(
                "❌ Impossible d'ouvrir le cours : ID manquant",
                course
            );

            return;
        }

        navigate(`/student-course/${courseId}`);

    };

    return (

        <div
            className="
                group
                bg-white
                rounded-3xl
                overflow-hidden
                shadow-md
                hover:shadow-2xl
                hover:-translate-y-2
                transition-all
                duration-300
                border
                border-gray-100
            "
        >

            {/* ======================================
                IMAGE
            ====================================== */}
            <div className="relative h-52 overflow-hidden">

                <img
                    src={courseImage}
                    alt={course.title}
                    className="
                        w-full
                        h-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-105
                    "
                />

                {/* Overlay */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/30
                        via-transparent
                        to-transparent
                        pointer-events-none
                    "
                />

                {/* Catégorie */}
                <span
                    className="
                        absolute
                        top-4
                        left-4
                        bg-white
                        text-purple-700
                        text-xs
                        font-bold
                        px-3
                        py-1.5
                        rounded-full
                        shadow-md
                    "
                >
                    {course.category}
                </span>

            </div>


            {/* ======================================
                CONTENU
            ====================================== */}
            <div className="p-5">

                {/* ======================================
                    TITRE
                ====================================== */}
                <h2
                    className="
                        text-lg
                        font-bold
                        text-gray-900
                        mb-2
                        line-clamp-2
                        min-h-[56px]
                        group-hover:text-purple-700
                        transition-colors
                    "
                >
                    {course.title}
                </h2>


                {/* ======================================
                    ENSEIGNANT
                ====================================== */}
                <div className="flex items-center gap-2 mb-5">

                    <div
                        className="
                            w-8
                            h-8
                            rounded-full
                            bg-gradient-to-r
                            from-purple-500
                            to-indigo-500
                            flex
                            items-center
                            justify-center
                            text-white
                            text-xs
                            font-bold
                        "
                    >
                        {teacherInitial}
                    </div>

                    <span className="text-sm text-gray-600">
                        {teacherName}
                    </span>

                </div>


                {/* ======================================
                    NOTE
                ====================================== */}
                {course.rating !== undefined && (

                    <div className="flex items-center gap-2 mb-4">

                        <FaStar className="text-yellow-400" />

                        <span className="font-bold text-gray-800">
                            {course.rating}
                        </span>

                    </div>

                )}


                {/* ======================================
                    STATISTIQUES
                ====================================== */}
                <div
                    className="
                        grid
                        grid-cols-3
                        gap-2
                        mb-5
                        text-xs
                        text-gray-500
                    "
                >

                    {/* Étudiants */}
                    <div className="flex flex-col items-center gap-1">

                        <FaUsers className="text-purple-500" />

                        <span className="font-semibold text-gray-700">
                            {course.students ?? course.studentsCount ?? 0}
                        </span>

                        <span>
                            Étudiants
                        </span>

                    </div>


                    {/* Vues */}
                    <div className="flex flex-col items-center gap-1">

                        <FaEye className="text-blue-500" />

                        <span className="font-semibold text-gray-700">
                            {course.views ?? 0}
                        </span>

                        <span>
                            Vues
                        </span>

                    </div>


                    {/* Téléchargements */}
                    <div className="flex flex-col items-center gap-1">

                        <FaDownload className="text-green-500" />

                        <span className="font-semibold text-gray-700">
                            {course.downloads ?? 0}
                        </span>

                        <span>
                            Téléchargements
                        </span>

                    </div>

                </div>


                {/* ======================================
                    DURÉE / NIVEAU
                ====================================== */}
                {(course.duration || course.level) && (

                    <div
                        className="
                            flex
                            justify-between
                            items-center
                            text-sm
                            text-gray-500
                            mb-5
                            border-t
                            border-gray-100
                            pt-4
                        "
                    >

                        {course.duration && (

                            <div className="flex items-center gap-2">

                                <FaClock className="text-purple-500" />

                                {course.duration}

                            </div>

                        )}

                        {course.level && (

                            <div className="flex items-center gap-2">

                                <FaSignal className="text-purple-500" />

                                {course.level}

                            </div>

                        )}

                    </div>

                )}


                {/* ======================================
                    PRIX
                ====================================== */}
                <div
                    className="
                        bg-purple-50
                        rounded-xl
                        px-4
                        py-3
                        mb-4
                    "
                >

                    <span
                        className={`
                            text-lg
                            font-bold
                            ${
                                course.price !== null &&
                                course.price !== undefined
                                    ? "text-purple-700"
                                    : "text-gray-500"
                            }
                        `}
                    >
                        {formattedPrice}
                    </span>

                </div>


                {/* ======================================
                    BOUTON VOIR LE COURS
                ====================================== */}
                <button
                    type="button"
                    onClick={handleViewCourse}
                    className="
                        w-full
                        flex
                        items-center
                        justify-center
                        gap-3
                        bg-gradient-to-r
                        from-purple-600
                        to-indigo-600
                        text-white
                        py-3
                        rounded-xl
                        font-semibold
                        shadow-md
                        hover:shadow-lg
                        hover:scale-[1.02]
                        transition-all
                        duration-300
                    "
                >

                    <span>
                        Voir le cours
                    </span>

                    <FaArrowRight
                        className="
                            transition-transform
                            duration-300
                            group-hover:translate-x-1
                        "
                    />

                </button>

            </div>

        </div>

    );

}

export default CourseCard;