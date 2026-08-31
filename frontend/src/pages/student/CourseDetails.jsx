// ======================================
// PAGE DÉTAIL DU COURS - ÉTUDIANT
// ======================================

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaStar,
    FaUsers,
    FaEye,
    FaDownload,
    FaFilePdf,
    FaPlayCircle,
    FaBookOpen
} from "react-icons/fa";

import API from "../../services/api";


// ======================================
// COMPOSANT
// ======================================

function CourseDetails() {

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
    const [enrolled, setEnrolled] = useState(false);
    const [enrollmentLoading, setEnrollmentLoading] = useState(true);
    const [enrollmentSubmitting, setEnrollmentSubmitting] = useState(false);

    // ======================================
    // CHARGEMENT
    // ======================================

    const [loading, setLoading] = useState(true);


    // ======================================
    // ERREUR
    // ======================================

    const [error, setError] = useState("");


    // ======================================
    // RÉCUPÉRER LE COURS
    // ======================================
    const getCourse = async () => {

        try {

            setLoading(true);

            setError("");

            const res = await API.get(
                `/courses/${id}`
            );

            console.log(
                "Cours étudiant :",
                res.data
            );

            setCourse(res.data);

        }

        catch (error) {

            console.error(
                "Erreur récupération cours :",
                error
            );

            setError(
                error.response?.data?.message ||
                "Impossible de charger le cours."
            );

        }

        finally {

            setLoading(false);

        }

    };

// ======================================
// VÉRIFIER L'INSCRIPTION
// ======================================
const checkStudentEnrollment = async () => {

    try {

        setEnrollmentLoading(true);

        const res = await API.get(
            `/enrollments/check/${id}`
        );

        console.log(
            "INSCRIPTION :",
            res.data
        );

        setEnrolled(
            res.data?.enrolled === true
        );

        setEnrollment(
            res.data?.enrollment || null
        );

    }

    catch (error) {

        console.error(
            "Erreur vérification inscription :",
            error
        );

        setEnrolled(false);

        setEnrollment(null);

    }

    finally {

        setEnrollmentLoading(false);

    }

};

// ======================================
// ACCEDER A LA FORMATION
// ======================================
const handleAccessCourse = async () => {

    // ======================================
    // DEJA INSCRIT
    // ======================================

    if (enrolled) {

        navigate(
            `/student-course/${id}/learn`
        );

        return;

    }


    // ======================================
    // CREER LE PAIEMENT
    // ======================================

    try {

        setEnrollmentSubmitting(true);

        setError("");


        const res = await API.post(

            "/payments/create",

            {
                courseId: id
            }

        );


        console.log(

            "PAIEMENT :",

            res.data

        );


        // ======================================
        // FORMATION GRATUITE
        // ======================================

        if (res.data?.free) {

            setEnrolled(true);

            setEnrollment(
                res.data?.enrollment || null
            );


            navigate(
                `/student-course/${id}/learn`
            );


            return;

        }


        // ======================================
        // PAIEMENT TEST
        // ======================================

        if (res.data?.paymentUrl) {

            if (
                res.data.paymentUrl.startsWith("/")
            ) {

                navigate(
                    res.data.paymentUrl
                );

            }

            else {

                window.location.href =
                    res.data.paymentUrl;

            }


            return;

        }


        // ======================================
        // AUCUNE URL
        // ======================================

        throw new Error(

            "Aucune page de paiement n'a été générée."

        );

    }

    catch (error) {

        console.error(

            "Erreur création paiement :",

            error

        );


        alert(

            error.response?.data?.message ||

            error.message ||

            "Impossible d'initialiser le paiement."

        );

    }

    finally {

        setEnrollmentSubmitting(false);

    }

};

    // ======================================
    // CHARGEMENT INITIAL
    // ======================================

    useEffect(() => {

        getCourse();
    
        checkStudentEnrollment();
    
    }, [id]);


    // ======================================
    // CHARGEMENT
    // ======================================

    if (loading) {

        return (

            <div className="min-h-screen bg-gray-50 flex items-center justify-center">

                <div className="text-center">

                    <div
                        className="
                            w-14
                            h-14
                            border-4
                            border-purple-600
                            border-t-transparent
                            rounded-full
                            animate-spin
                            mx-auto
                        "
                    />

                    <p className="mt-5 text-gray-500">

                        Chargement du cours...

                    </p>

                </div>

            </div>

        );

    }


    // ======================================
    // ERREUR
    // ======================================

    if (error || !course) {

        return (

            <div className="min-h-screen bg-gray-50 p-8">

                <button
                    onClick={() => navigate(-1)}
                    className="
                        flex
                        items-center
                        gap-3
                        bg-white
                        px-5
                        py-3
                        rounded-xl
                        shadow-sm
                        hover:shadow-md
                        transition
                    "
                >

                    <FaArrowLeft className="text-purple-600" />

                    Retour

                </button>


                <div className="max-w-2xl mx-auto mt-20 bg-white rounded-3xl shadow-md p-10 text-center">

                    <div className="text-6xl mb-5">

                        📚

                    </div>

                    <h1 className="text-2xl font-bold">

                        Cours introuvable

                    </h1>

                    <p className="text-gray-500 mt-3">

                        {error ||
                            "Ce cours n'existe pas ou n'est plus disponible."
                        }

                    </p>

                </div>

            </div>

        );

    }


    // ======================================
    // ENSEIGNANT
    // ======================================

    const teacherName =
        course.teacher?.name ||
        "Enseignant";


    // ======================================
    // PRIX
    // ======================================

    const hasPrice =
        typeof course.price === "number";


    // ======================================
    // IMAGE
    // ======================================

    const imageUrl =
        course.thumbnail
            ? course.thumbnail.startsWith("http")
                ? course.thumbnail
                : `https://salam-ci-backend.onrender.com/${course.thumbnail}`
            : "/images/course-placeholder.jpg";


    return (

        <div className="min-h-screen bg-gray-50 p-6 md:p-8">


            {/* ======================================
                RETOUR
            ====================================== */}

            <button
                onClick={() => navigate(-1)}
                className="
                    inline-flex
                    items-center
                    gap-3
                    bg-white
                    px-5
                    py-3
                    rounded-xl
                    shadow-sm
                    hover:shadow-md
                    transition
                    font-semibold
                    text-gray-700
                "
            >

                <FaArrowLeft className="text-purple-600" />

                Retour au catalogue

            </button>


            {/* ======================================
                CONTENU PRINCIPAL
            ====================================== */}

            <div className="max-w-7xl mx-auto mt-8">


                {/* ======================================
                    HERO DU COURS
                ====================================== */}

                <div className="bg-white rounded-3xl shadow-md overflow-hidden">


                    <div className="grid lg:grid-cols-2">


                        {/* ==================================
                            IMAGE
                        ================================== */}

                        <div className="relative">

                            <img
                                src={imageUrl}
                                alt={course.title}
                                className="
                                    w-full
                                    h-full
                                    min-h-[350px]
                                    lg:min-h-[450px]
                                    object-cover
                                "
                                onError={(e) => {

                                    e.currentTarget.onerror = null;

                                    e.currentTarget.src =
                                        "/images/course-placeholder.jpg";

                                }}
                            />


                            {/* CATÉGORIE */}

                            <span
                                className="
                                    absolute
                                    top-6
                                    left-6
                                    bg-purple-600
                                    text-white
                                    px-4
                                    py-2
                                    rounded-full
                                    text-sm
                                    font-semibold
                                "
                            >

                                {course.category}

                            </span>

                        </div>


                        {/* ==================================
                            INFORMATIONS
                        ================================== */}

                        <div className="p-8 lg:p-12">


                            {/* TITRE */}

                            <h1
                                className="
                                    text-3xl
                                    md:text-4xl
                                    font-bold
                                    text-gray-800
                                "
                            >

                                {course.title}

                            </h1>


                            {/* ENSEIGNANT */}

                            <p className="text-gray-500 mt-4">

                                Formateur :

                                <span className="font-semibold text-gray-700 ml-2">

                                    {teacherName}

                                </span>

                            </p>


                            {/* NOTE */}

                            <div className="flex items-center gap-2 mt-6">

                                <FaStar className="text-yellow-400" />

                                <span className="font-semibold">

                                    {course.rating || "Nouveau"}

                                </span>

                            </div>


                            {/* ==================================
                                PRIX
                            ================================== */}

                            <div
                                className="
                                    mt-8
                                    bg-purple-50
                                    rounded-2xl
                                    p-5
                                "
                            >

                                <p className="text-gray-500">

                                    Prix de la formation

                                </p>

                                <p
                                    className="
                                        text-3xl
                                        font-bold
                                        text-purple-700
                                        mt-1
                                    "
                                >

                                    {hasPrice
                                        ? `${course.price.toLocaleString("fr-FR")} FCFA`
                                        : "Gratuit"
                                    }

                                </p>

                            </div>


                            {/* ==================================
                                STATISTIQUES
                            ================================== */}

                            <div
                                className="
                                    grid
                                    grid-cols-3
                                    gap-4
                                    mt-8
                                "
                            >

                                <div className="text-center">

                                    <FaUsers
                                        className="
                                            mx-auto
                                            text-purple-600
                                            mb-2
                                        "
                                    />

                                    <p className="font-bold">

                                        {course.studentsCount || 0}

                                    </p>

                                    <p className="text-xs text-gray-500">

                                        Étudiants

                                    </p>

                                </div>


                                <div className="text-center">

                                    <FaEye
                                        className="
                                            mx-auto
                                            text-blue-600
                                            mb-2
                                        "
                                    />

                                    <p className="font-bold">

                                        {course.views || 0}

                                    </p>

                                    <p className="text-xs text-gray-500">

                                        Vues

                                    </p>

                                </div>


                                <div className="text-center">

                                    <FaDownload
                                        className="
                                            mx-auto
                                            text-green-600
                                            mb-2
                                        "
                                    />

                                    <p className="font-bold">

                                        {course.downloads || 0}

                                    </p>

                                    <p className="text-xs text-gray-500">

                                        Téléchargements

                                    </p>

                                </div>

                            </div>


                            {/* ==================================
                                ACTION
                            ================================== */}

                            <button
                                type="button"
                                onClick={handleAccessCourse}
                                disabled={
                                    enrollmentLoading ||
                                    enrollmentSubmitting
                                }
                                className="
                                  w-full
                                  mt-8
                                  bg-gradient-to-r
                                  from-purple-600
                                  to-indigo-600
                                  text-white
                                  py-4
                                  rounded-xl
                                  font-semibold
                                  text-lg
                                  shadow-md
                                  hover:shadow-xl
                                  hover:scale-[1.02]
                                  transition-all
                                  duration-300
                                  disabled:opacity-60
                                  disabled:cursor-not-allowed
                                  disabled:hover:scale-100
                                "
                            >
                              {enrollmentLoading
                                ? "Vérification..."
                                : enrollmentSubmitting
                                ? "Traitement..."
                                : enrolled
                                ? "Continuer la formation"
                                : course.price === null ||
                                course.price === undefined ||
                                Number(course.price) === 0
                                ? "Commencer gratuitement"
                                : "Acheter la formation"
                              }
                            </button>

                        </div>

                    </div>

                </div>


                {/* ======================================
                    DESCRIPTION
                ====================================== */}

                <div className="bg-white rounded-3xl shadow-md p-8 mt-8">

                    <h2
                        className="
                            text-2xl
                            font-bold
                            text-gray-800
                            mb-5
                        "
                    >

                        À propos de cette formation

                    </h2>

                    <p
                        className="
                            text-gray-600
                            leading-8
                            whitespace-pre-line
                        "
                    >

                        {course.description}

                    </p>

                </div>


                {/* ======================================
                    RESSOURCES
                ====================================== */}

                <div className="grid md:grid-cols-2 gap-6 mt-8">


                    {/* ==================================
                        PDF
                    ================================== */}

                    <div
                        className="
                            bg-white
                            rounded-3xl
                            shadow-md
                            p-7
                        "
                    >

                        <div className="flex items-center gap-4">

                            <div
                                className="
                                    w-14
                                    h-14
                                    bg-red-100
                                    text-red-600
                                    rounded-2xl
                                    flex
                                    items-center
                                    justify-center
                                "
                            >

                                <FaFilePdf className="text-2xl" />

                            </div>

                            <div>

                                <h3 className="font-bold text-xl">

                                    Support PDF

                                </h3>

                                <p className="text-gray-500">

                                    {course.pdf
                                        ? "Document disponible"
                                        : "Aucun document disponible"
                                    }

                                </p>

                            </div>

                        </div>


                        {course.pdf && (

                            <a
                                href={course.pdf}
                                target="_blank"
                                rel="noreferrer"
                                className="
                                    block
                                    text-center
                                    mt-6
                                    bg-red-600
                                    hover:bg-red-700
                                    text-white
                                    py-3
                                    rounded-xl
                                    font-semibold
                                "
                            >

                                Ouvrir le PDF

                            </a>

                        )}

                    </div>


                    {/* ==================================
                        VIDÉO
                    ================================== */}

                    <div
                        className="
                            bg-white
                            rounded-3xl
                            shadow-md
                            p-7
                        "
                    >

                        <div className="flex items-center gap-4">

                            <div
                                className="
                                    w-14
                                    h-14
                                    bg-purple-100
                                    text-purple-600
                                    rounded-2xl
                                    flex
                                    items-center
                                    justify-center
                                "
                            >

                                <FaPlayCircle className="text-2xl" />

                            </div>

                            <div>

                                <h3 className="font-bold text-xl">

                                    Vidéo du cours

                                </h3>

                                <p className="text-gray-500">

                                    {course.video
                                        ? "Vidéo disponible"
                                        : "Aucune vidéo disponible"
                                    }

                                </p>

                            </div>

                        </div>


                        {course.video && (

                            <a
                                href={course.video}
                                target="_blank"
                                rel="noreferrer"
                                className="
                                    block
                                    text-center
                                    mt-6
                                    bg-purple-600
                                    hover:bg-purple-700
                                    text-white
                                    py-3
                                    rounded-xl
                                    font-semibold
                                "
                            >

                                Regarder la vidéo

                            </a>

                        )}

                    </div>

                </div>


                {/* ======================================
                    INFORMATIONS
                ====================================== */}

                <div className="bg-white rounded-3xl shadow-md p-8 mt-8">

                    <h2 className="text-2xl font-bold mb-6">

                        Informations

                    </h2>


                    <div className="grid md:grid-cols-2 gap-6">

                        <div>

                            <p className="text-gray-500">

                                Catégorie

                            </p>

                            <p className="font-semibold mt-1">

                                {course.category}

                            </p>

                        </div>


                        <div>

                            <p className="text-gray-500">

                                Enseignant

                            </p>

                            <p className="font-semibold mt-1">

                                {teacherName}

                            </p>

                        </div>


                        <div>

                            <p className="text-gray-500">

                                Statut

                            </p>

                            <span
                                className="
                                    inline-block
                                    mt-2
                                    bg-green-100
                                    text-green-700
                                    px-4
                                    py-2
                                    rounded-full
                                    font-semibold
                                "
                            >

                                {course.status}

                            </span>

                        </div>


                        <div>

                            <p className="text-gray-500">

                                Publication

                            </p>

                            <p className="font-semibold mt-1">

                                {course.publishedAt
                                    ? new Date(
                                        course.publishedAt
                                    ).toLocaleDateString("fr-FR")
                                    : "Non disponible"
                                }

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default CourseDetails;