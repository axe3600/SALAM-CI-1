// ======================================
// PAGE D'APPRENTISSAGE - ÉTUDIANT
// ======================================

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaBookOpen,
    FaCheckCircle,
    FaChevronLeft,
    FaChevronRight,
    FaFilePdf,
    FaPlayCircle,
    FaClock,
    FaGraduationCap
} from "react-icons/fa";

import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../services/api";


// ======================================
// COMPOSANT
// ======================================

function CourseLearn() {

    const { id } = useParams();

    const navigate = useNavigate();


    // ======================================
    // COURS
    // ======================================

    const [course, setCourse] = useState(null);


    // ======================================
    // INSCRIPTION
    // ======================================

    const [enrollment, setEnrollment] = useState(null);


    // ======================================
    // PROGRESSION
    // ======================================

    const [progress, setProgress] = useState(0);


    // ======================================
    // CHARGEMENT
    // ======================================

    const [loading, setLoading] = useState(true);


    // ======================================
    // ERREUR
    // ======================================

    const [error, setError] = useState("");


    // ======================================
    // MISE A JOUR PROGRESSION
    // ======================================

    const [updatingProgress, setUpdatingProgress] =
        useState(false);


    // ======================================
    // RECUPERER COURS + INSCRIPTION
    // ======================================

    const loadCourse = async () => {

        try {

            setLoading(true);

            setError("");


            // ==================================
            // COURS
            // ==================================

            const courseResponse =
                await API.get(
                    `/courses/${id}`
                );


            console.log(
                "COURS APPRENTISSAGE :",
                courseResponse.data
            );


            // ==================================
            // VERIFICATION INSCRIPTION
            // ==================================

            const enrollmentResponse =
                await API.get(
                    `/enrollments/check/${id}`
                );


            console.log(
                "INSCRIPTION APPRENTISSAGE :",
                enrollmentResponse.data
            );


            if (
                enrollmentResponse.data?.enrolled !== true
            ) {

                setError(
                    "Vous devez être inscrit à cette formation pour y accéder."
                );

                return;

            }


            // ==================================
            // ENREGISTRER LES DONNEES
            // ==================================

            setCourse(
                courseResponse.data
            );


            setEnrollment(
                enrollmentResponse.data.enrollment
            );


            setProgress(
                Number(
                    enrollmentResponse.data.enrollment?.progress
                ) || 0
            );

        }

        catch (error) {

            console.error(
                "Erreur chargement formation :",
                error
            );


            setError(

                error.response?.data?.message ||

                "Impossible d'accéder à cette formation."

            );

        }

        finally {

            setLoading(false);

        }

    };


    // ======================================
    // CHARGEMENT INITIAL
    // ======================================

    useEffect(() => {

        loadCourse();

    }, [id]);


    // ======================================
    // METTRE A JOUR LA PROGRESSION
    // ======================================

    const updateCourseProgress = async (
        newProgress
    ) => {

        try {

            setUpdatingProgress(true);


            const safeProgress =
                Math.min(
                    100,
                    Math.max(
                        0,
                        Number(newProgress)
                    )
                );


            const response =
                await API.patch(

                    `/enrollments/${id}/progress`,

                    {
                        progress:
                            safeProgress
                    }

                );


            console.log(
                "PROGRESSION MISE À JOUR :",
                response.data
            );


            setProgress(
                safeProgress
            );


            setEnrollment(
                response.data?.enrollment ||
                enrollment
            );

        }

        catch (error) {

            console.error(
                "Erreur progression :",
                error
            );


            alert(

                error.response?.data?.message ||

                "Impossible de mettre à jour la progression."

            );

        }

        finally {

            setUpdatingProgress(false);

        }

    };


    // ======================================
    // PROGRESSION SUIVANTE
    // ======================================

    const handleNext = async () => {

        if (progress >= 100) {

            return;

        }


        await updateCourseProgress(
            progress + 25
        );

    };


    // ======================================
    // PROGRESSION PRECEDENTE
    // ======================================

    const handlePrevious = async () => {

        if (progress <= 0) {

            return;

        }


        await updateCourseProgress(
            progress - 25
        );

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

                    <div className="text-center">

                        <div className="
                            w-14
                            h-14
                            border-4
                            border-purple-200
                            border-t-purple-600
                            rounded-full
                            animate-spin
                            mx-auto
                        " />


                        <p className="
                            mt-5
                            text-gray-500
                        ">

                            Chargement de la formation...

                        </p>

                    </div>

                </div>

            </DashboardLayout>

        );

    }


    // ======================================
    // ERREUR / ACCES REFUSE
    // ======================================

    if (error || !course) {

        return (

            <DashboardLayout>

                <div className="
                    min-h-[70vh]
                    flex
                    items-center
                    justify-center
                    px-4
                ">

                    <div className="
                        bg-white
                        rounded-3xl
                        shadow-md
                        p-10
                        text-center
                        max-w-xl
                        w-full
                    ">

                        <div className="
                            w-20
                            h-20
                            bg-purple-100
                            text-purple-600
                            rounded-full
                            flex
                            items-center
                            justify-center
                            mx-auto
                            mb-6
                        ">

                            <FaBookOpen
                                className="text-3xl"
                            />

                        </div>


                        <h1 className="
                            text-2xl
                            font-bold
                            text-gray-800
                        ">

                            Accès à la formation

                        </h1>


                        <p className="
                            text-gray-500
                            mt-4
                            leading-7
                        ">

                            {error ||
                                "Cette formation est introuvable."
                            }

                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/student-course/${id}`
                                )
                            }
                            className="
                                mt-7
                                inline-flex
                                items-center
                                gap-3
                                bg-purple-600
                                hover:bg-purple-700
                                text-white
                                px-6
                                py-3
                                rounded-xl
                                font-semibold
                                transition
                            "
                        >

                            <FaArrowLeft />

                            Retour à la formation

                        </button>

                    </div>

                </div>

            </DashboardLayout>

        );

    }


    // ======================================
    // ENSEIGNANT
    // ======================================

    const teacherName =
        course.teacher?.name ||
        "Enseignant";


    // ======================================
    // IMAGE
    // ======================================

    const imageUrl =
        course.thumbnail &&
        course.thumbnail.startsWith("http")

            ? course.thumbnail

            : "/images/course-placeholder.jpg";


    return (

        <DashboardLayout>


            {/* ======================================
                RETOUR
            ====================================== */}

            <button
                type="button"
                onClick={() => navigate("/student-courses")}
                className="
                    inline-flex
                    items-center
                    gap-3
                    text-gray-600
                    hover:text-purple-600
                    font-semibold
                    transition
                "
            >

                <FaArrowLeft />

                Retour aux détails

            </button>


            {/* ======================================
                HEADER
            ====================================== */}

            <div className="
                bg-white
                rounded-3xl
                shadow-md
                overflow-hidden
                mt-6
            ">

                <div className="
                    grid
                    lg:grid-cols-[280px_1fr]
                ">


                    {/* IMAGE */}

                    <div className="
                        h-52
                        lg:h-full
                        min-h-[220px]
                    ">

                        <img
                            src={imageUrl}
                            alt={course.title}
                            className="
                                w-full
                                h-full
                                object-cover
                            "
                            onError={(event) => {

                                event.currentTarget.onerror =
                                    null;

                                event.currentTarget.src =
                                    "/images/course-placeholder.jpg";

                            }}
                        />

                    </div>


                    {/* INFORMATIONS */}

                    <div className="p-7">

                        <div className="
                            flex
                            flex-wrap
                            items-center
                            gap-3
                        ">

                            <span className="
                                bg-purple-100
                                text-purple-700
                                px-4
                                py-1.5
                                rounded-full
                                text-sm
                                font-semibold
                            ">

                                {course.category}

                            </span>


                            <span className="
                                bg-green-100
                                text-green-700
                                px-4
                                py-1.5
                                rounded-full
                                text-sm
                                font-semibold
                            ">

                                Formation active

                            </span>

                        </div>


                        <h1 className="
                            text-3xl
                            md:text-4xl
                            font-bold
                            text-gray-900
                            mt-4
                        ">

                            {course.title}

                        </h1>


                        <p className="
                            text-gray-500
                            mt-3
                        ">

                            Formateur :

                            <span className="
                                font-semibold
                                text-gray-700
                                ml-2
                            ">

                                {teacherName}

                            </span>

                        </p>


                        {/* PROGRESSION */}

                        <div className="mt-7">

                            <div className="
                                flex
                                justify-between
                                items-center
                                mb-2
                            ">

                                <span className="
                                    font-semibold
                                    text-gray-700
                                ">

                                    Votre progression

                                </span>


                                <span className="
                                    font-bold
                                    text-purple-600
                                ">

                                    {progress}%

                                </span>

                            </div>


                            <div className="
                                w-full
                                h-3
                                bg-gray-200
                                rounded-full
                                overflow-hidden
                            ">

                                <div
                                    className="
                                        h-full
                                        bg-gradient-to-r
                                        from-purple-600
                                        to-indigo-600
                                        rounded-full
                                        transition-all
                                        duration-500
                                    "
                                    style={{
                                        width:
                                            `${progress}%`
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ======================================
                ZONE D'APPRENTISSAGE
            ====================================== */}

            <div className="
                grid
                lg:grid-cols-[1fr_330px]
                gap-8
                mt-8
            ">


                {/* ==================================
                    CONTENU
                ================================== */}

                <main className="
                    bg-white
                    rounded-3xl
                    shadow-md
                    overflow-hidden
                ">


                    {/* TITRE */}

                    <div className="
                        p-7
                        border-b
                        border-gray-100
                    ">

                        <div className="
                            flex
                            items-center
                            gap-3
                            text-purple-600
                        ">

                            <FaPlayCircle
                                className="text-2xl"
                            />


                            <span className="
                                text-sm
                                font-semibold
                            ">

                                CONTENU DE LA FORMATION

                            </span>

                        </div>


                        <h2 className="
                            text-2xl
                            font-bold
                            text-gray-900
                            mt-3
                        ">

                            Bienvenue dans votre formation

                        </h2>

                    </div>


                    {/* VIDEO */}

                    {course.video ? (

                        <div className="
                            bg-black
                            aspect-video
                        ">

                            <video
                                controls
                                className="
                                    w-full
                                    h-full
                                "
                                src={course.video}
                            >

                                Votre navigateur ne supporte
                                pas la lecture vidéo.

                            </video>

                        </div>

                    ) : (

                        <div className="
                            bg-gray-100
                            aspect-video
                            flex
                            items-center
                            justify-center
                        ">

                            <div className="
                                text-center
                                text-gray-500
                            ">

                                <FaPlayCircle
                                    className="
                                        text-6xl
                                        mx-auto
                                        mb-4
                                        text-purple-300
                                    "
                                />

                                <p>
                                    Aucune vidéo disponible
                                </p>

                            </div>

                        </div>

                    )}


                    {/* DESCRIPTION */}

                    <div className="p-7">

                        <h3 className="
                            text-xl
                            font-bold
                            text-gray-800
                            mb-4
                        ">

                            À propos de ce cours

                        </h3>


                        <p className="
                            text-gray-600
                            leading-8
                            whitespace-pre-line
                        ">

                            {course.description}

                        </p>

                    </div>


                    {/* NAVIGATION */}

                    <div className="
                        p-7
                        border-t
                        border-gray-100
                        flex
                        justify-between
                        gap-4
                    ">

                        <button
                            type="button"
                            onClick={handlePrevious}
                            disabled={
                                progress <= 0 ||
                                updatingProgress
                            }
                            className="
                                inline-flex
                                items-center
                                gap-2
                                px-5
                                py-3
                                rounded-xl
                                bg-gray-100
                                hover:bg-gray-200
                                text-gray-700
                                font-semibold
                                transition
                                disabled:opacity-40
                                disabled:cursor-not-allowed
                            "
                        >

                            <FaChevronLeft />

                            Précédent

                        </button>


                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={
                                progress >= 100 ||
                                updatingProgress
                            }
                            className="
                                inline-flex
                                items-center
                                gap-2
                                px-5
                                py-3
                                rounded-xl
                                bg-purple-600
                                hover:bg-purple-700
                                text-white
                                font-semibold
                                transition
                                disabled:opacity-40
                                disabled:cursor-not-allowed
                            "
                        >

                            {progress >= 100
                                ? "Formation terminée"
                                : updatingProgress
                                ? "Enregistrement..."
                                : "Continuer"
                            }

                            {progress < 100 && (
                                <FaChevronRight />
                            )}

                        </button>

                    </div>

                </main>


                {/* ==================================
                    SIDEBAR
                ================================== */}

                <aside className="space-y-6">


                    {/* PROGRESSION */}

                    <div className="
                        bg-white
                        rounded-3xl
                        shadow-md
                        p-7
                    ">

                        <div className="
                            flex
                            items-center
                            gap-3
                            mb-6
                        ">

                            <div className="
                                w-12
                                h-12
                                rounded-2xl
                                bg-purple-100
                                text-purple-600
                                flex
                                items-center
                                justify-center
                            ">

                                <FaGraduationCap />

                            </div>


                            <div>

                                <h3 className="
                                    font-bold
                                    text-gray-800
                                ">

                                    Ma progression

                                </h3>

                                <p className="
                                    text-sm
                                    text-gray-500
                                ">

                                    Suivi de votre apprentissage

                                </p>

                            </div>

                        </div>


                        <div className="
                            text-4xl
                            font-bold
                            text-purple-600
                        ">

                            {progress}%

                        </div>


                        <p className="
                            text-sm
                            text-gray-500
                            mt-2
                        ">

                            {progress >= 100
                                ? "Formation terminée 🎉"
                                : "Continuez vos efforts !"
                            }

                        </p>

                    </div>


                    {/* INFORMATIONS */}

                    <div className="
                        bg-white
                        rounded-3xl
                        shadow-md
                        p-7
                    ">

                        <h3 className="
                            font-bold
                            text-xl
                            text-gray-800
                            mb-5
                        ">

                            Ressources

                        </h3>


                        {/* PDF */}

                        {course.pdf ? (

                            <a
                                href={course.pdf}
                                target="_blank"
                                rel="noreferrer"
                                className="
                                    flex
                                    items-center
                                    gap-4
                                    p-4
                                    rounded-2xl
                                    bg-red-50
                                    text-red-700
                                    hover:bg-red-100
                                    transition
                                "
                            >

                                <FaFilePdf
                                    className="text-2xl"
                                />


                                <div>

                                    <p className="font-semibold">

                                        Support PDF

                                    </p>

                                    <p className="
                                        text-xs
                                        text-red-500
                                    ">

                                        Ouvrir le document

                                    </p>

                                </div>

                            </a>

                        ) : (

                            <div className="
                                flex
                                items-center
                                gap-4
                                p-4
                                rounded-2xl
                                bg-gray-50
                                text-gray-400
                            ">

                                <FaFilePdf
                                    className="text-2xl"
                                />

                                <span>
                                    Aucun PDF disponible
                                </span>

                            </div>

                        )}


                        {/* DUREE */}

                        <div className="
                            flex
                            items-center
                            gap-4
                            mt-4
                            p-4
                            rounded-2xl
                            bg-gray-50
                        ">

                            <FaClock
                                className="
                                    text-purple-600
                                "
                            />

                            <div>

                                <p className="
                                    font-semibold
                                    text-gray-700
                                ">

                                    Durée

                                </p>

                                <p className="
                                    text-sm
                                    text-gray-500
                                ">

                                    {course.duration ||
                                        "Non définie"
                                    }

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* CERTIFICAT */}

                    {progress >= 100 && (

                        <div className="
                            bg-green-50
                            border
                            border-green-200
                            rounded-3xl
                            p-7
                        ">

                            <FaCheckCircle
                                className="
                                    text-green-600
                                    text-3xl
                                    mb-4
                                "
                            />


                            <h3 className="
                                font-bold
                                text-green-800
                            ">

                                Formation terminée !

                            </h3>


                            <p className="
                                text-sm
                                text-green-700
                                mt-2
                                leading-6
                            ">

                                Félicitations ! Vous avez
                                terminé cette formation.

                            </p>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/student-certificates"
                                    )
                                }
                                className="
                                    w-full
                                    mt-5
                                    bg-green-600
                                    hover:bg-green-700
                                    text-white
                                    py-3
                                    rounded-xl
                                    font-semibold
                                "
                            >

                                Voir mes certificats

                            </button>

                        </div>

                    )}

                </aside>

            </div>

        </DashboardLayout>

    );

}

export default CourseLearn;