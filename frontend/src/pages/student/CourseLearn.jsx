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
    FaGraduationCap,
    FaQuestionCircle,
    FaClipboardList,
    FaExternalLinkAlt
} from "react-icons/fa";

import DashboardLayout from "../../layouts/DashboardLayout";
import API from "../../services/api";

import VideoPlayer from "../../components/chapterStudent/VideoPlayer";
import PdfViewer from "../../components/chapterStudent/PdfViewer";
import QuizPlayer from "../../components/chapterStudent/QuizPlayer";
import ExercisePlayer from "../../components/chapterStudent/ExercisePlayer";


// ======================================
// COMPOSANT
// ======================================

function CourseLearn() {

    const { id } = useParams();

    const navigate = useNavigate();

// ======================================
// URL DU BACKEND POUR LES FICHIERS
// ======================================
const BACKEND_URL =
(
    import.meta.env.VITE_API_URL ||
    "https://salam-ci-backend.onrender.com/api"
).replace(/\/api\/?$/, "");

// ======================================
// CONSTRUIRE L'URL D'UN FICHIER
// ======================================
const getFileUrl = (filePath) => {

    if (!filePath) {
        return "";
    }

    if (
        filePath.startsWith("http://") ||
        filePath.startsWith("https://")
    ) {
        return filePath;
    }

    return `${BACKEND_URL}/${filePath.replace(/^\/+/, "")}`;
};



    // ======================================
    // COURS
    // ======================================

    const [course, setCourse] = useState(null);


    // ======================================
    // INSCRIPTION
    // ======================================

    const [enrollment, setEnrollment] = useState(null);


    // ======================================
    // CHAPITRES
    // ======================================

    const [chapters, setChapters] = useState([]);


    // ======================================
    // CHAPITRE ACTUEL
    // ======================================

    const [currentChapterIndex, setCurrentChapterIndex] =
        useState(0);


    // ======================================
    // CONTENUS
    // ======================================

    const [videos, setVideos] = useState([]);

    const [pdfs, setPdfs] = useState([]);

    const [quizzes, setQuizzes] = useState([]);

    const [exercises, setExercises] = useState([]);


    // ======================================
    // PROGRESSION
    // ======================================

    const [progress, setProgress] = useState(0);


    // ======================================
    // CHARGEMENT
    // ======================================

    const [loading, setLoading] = useState(true);

    const [loadingContent, setLoadingContent] =
        useState(false);


    // ======================================
    // ERREUR
    // ======================================

    const [error, setError] = useState("");


    // ======================================
    // PROGRESSION
    // ======================================

    const [updatingProgress, setUpdatingProgress] =
        useState(false);


    // ======================================
    // CHAPITRE ACTUEL
    // ======================================

    const currentChapter =
        chapters[currentChapterIndex] || null;


    // ======================================
    // CHARGER LE COURS
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
            // INSCRIPTION
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


            // ==================================
            // CHAPITRES
            // ==================================

            const chaptersResponse =
                await API.get(
                    `/chapters/course/${id}`
                );


            console.log(
                "CHAPITRES APPRENTISSAGE :",
                chaptersResponse.data
            );


            const chaptersData =
                Array.isArray(chaptersResponse.data)
                    ? chaptersResponse.data
                    : [];


            setChapters(
                chaptersData
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
    // CHARGER LE CONTENU DU CHAPITRE
    // ======================================

    const loadChapterContent = async (
        chapterId
    ) => {

        if (!chapterId) {

            setVideos([]);

            setPdfs([]);

            setQuizzes([]);

            setExercises([]);

            return;

        }


        try {

            setLoadingContent(true);


            console.log(
                "CHARGEMENT CONTENU CHAPITRE :",
                chapterId
            );


            // ==================================
            // LES 4 CONTENUS EN PARALLELE
            // ==================================

            const [

                videosResponse,

                pdfsResponse,

                quizzesResponse,

                exercisesResponse

            ] = await Promise.all([

                API.get(
                    `/videos/chapter/${chapterId}`
                ),

                API.get(
                    `/pdfs/chapter/${chapterId}`
                ),

                API.get(
                    `/quizzes/chapter/${chapterId}`
                ),

                API.get(
                    `/exercises/chapter/${chapterId}`
                )

            ]);


            // ==================================
            // VIDEOS
            // ==================================

            setVideos(

                Array.isArray(
                    videosResponse.data
                )

                    ? videosResponse.data

                    : []

            );


            // ==================================
            // PDF
            // ==================================

            setPdfs(

                Array.isArray(
                    pdfsResponse.data
                )

                    ? pdfsResponse.data

                    : []

            );


            // ==================================
            // QUIZ
            // ==================================

            setQuizzes(

                Array.isArray(
                    quizzesResponse.data
                )

                    ? quizzesResponse.data

                    : []

            );


            // ==================================
            // EXERCICES
            // ==================================

            setExercises(

                Array.isArray(
                    exercisesResponse.data
                )

                    ? exercisesResponse.data

                    : []

            );


            console.log(
                "VIDEOS :",
                videosResponse.data
            );

            console.log(
                "PDFS :",
                pdfsResponse.data
            );

            console.log(
                "QUIZ :",
                quizzesResponse.data
            );

            console.log(
                "EXERCICES :",
                exercisesResponse.data
            );


        }

        catch (error) {

            console.error(
                "Erreur chargement contenu chapitre :",
                error
            );


            setVideos([]);

            setPdfs([]);

            setQuizzes([]);

            setExercises([]);

        }

        finally {

            setLoadingContent(false);

        }

    };


    // ======================================
    // CHARGEMENT INITIAL
    // ======================================

    useEffect(() => {

        loadCourse();

    }, [id]);


    // ======================================
    // CHARGER LE PREMIER CHAPITRE
    // ======================================

    useEffect(() => {

        if (chapters.length > 0) {

            setCurrentChapterIndex(0);

        }

    }, [chapters]);


    // ======================================
    // CHARGER LE CONTENU DU CHAPITRE
    // ======================================

    useEffect(() => {

        if (currentChapter?._id) {

            loadChapterContent(
                currentChapter._id
            );

        }

    }, [currentChapter?._id]);


    // ======================================
    // PROGRESSION
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
    // CHAPITRE SUIVANT
    // ======================================

    const handleNext = async () => {

        if (
            currentChapterIndex <
            chapters.length - 1
        ) {

            setCurrentChapterIndex(
                currentChapterIndex + 1
            );

            return;

        }


        if (progress < 100) {

            await updateCourseProgress(
                100
            );

        }

    };


    // ======================================
    // CHAPITRE PRECEDENT
    // ======================================

    const handlePrevious = () => {

        if (
            currentChapterIndex > 0
        ) {

            setCurrentChapterIndex(
                currentChapterIndex - 1
            );

        }

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
    // ERREUR
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
    // INFOS
    // ======================================

    const teacherName =
        course.teacher?.name ||
        "Enseignant";


    const imageUrl =
        course.thumbnail &&
        course.thumbnail.startsWith("http")

            ? course.thumbnail

            : "/images/course-placeholder.jpg";


    // ======================================
    // RENDU
    // ======================================

    return (

        <DashboardLayout>


            {/* ==================================
                RETOUR
            ================================== */}

            <button
                type="button"
                onClick={() =>
                    navigate(
                        `/student-course/${id}`
                    )
                }
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


            {/* ==================================
                HEADER
            ================================== */}

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
                        />

                    </div>


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


                        <div className="mt-7">

                            <div className="
                                flex
                                justify-between
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


            {/* ==================================
                CHAPITRES
            ================================== */}

            {chapters.length > 0 && (

                <div className="
                    bg-white
                    rounded-3xl
                    shadow-md
                    mt-8
                    p-6
                ">

                    <div className="
                        flex
                        flex-wrap
                        justify-between
                        items-center
                        gap-4
                    ">

                        <div>

                            <p className="
                                text-sm
                                text-purple-600
                                font-semibold
                            ">

                                CHAPITRE {currentChapterIndex + 1}

                            </p>


                            <h2 className="
                                text-2xl
                                font-bold
                                text-gray-900
                                mt-1
                            ">

                                {currentChapter?.title}

                            </h2>

                        </div>


                        <div className="
                            text-sm
                            text-gray-500
                        ">

                            {chapters.length} chapitre
                            {chapters.length > 1 ? "s" : ""}

                        </div>

                    </div>


                    {/* SELECTEUR CHAPITRES */}

                    <div className="
                        flex
                        flex-wrap
                        gap-2
                        mt-5
                    ">

                        {chapters.map(
                            (chapter, index) => (

                                <button
                                    key={chapter._id}
                                    type="button"
                                    onClick={() =>
                                        setCurrentChapterIndex(
                                            index
                                        )
                                    }
                                    className={`
                                        px-4
                                        py-2
                                        rounded-xl
                                        font-semibold
                                        text-sm
                                        transition
                                        ${
                                            index ===
                                            currentChapterIndex

                                                ? "bg-purple-600 text-white"

                                                : "bg-gray-100 text-gray-700 hover:bg-purple-100"
                                        }
                                    `}
                                >

                                    Chapitre {index + 1}

                                </button>

                            )
                        )}

                    </div>

                </div>

            )}


            {/* ==================================
                CONTENU
            ================================== */}

            <div className="
                grid
                lg:grid-cols-[1fr_330px]
                gap-8
                mt-8
            ">


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

                                CONTENU DU CHAPITRE

                            </span>

                        </div>


                        <h2 className="
                            text-2xl
                            font-bold
                            text-gray-900
                            mt-3
                        ">

                            {currentChapter?.title ||
                                "Contenu de la formation"
                            }

                        </h2>


                        {currentChapter?.description && (

                            <p className="
                                text-gray-500
                                mt-3
                                whitespace-pre-line
                            ">

                                {currentChapter.description}

                            </p>

                        )}

                    </div>


                    {/* CHARGEMENT CONTENU */}

                    {loadingContent ? (

                        <div className="
                            min-h-[400px]
                            flex
                            items-center
                            justify-center
                        ">

                            <div className="text-center">

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

                                    Chargement du contenu...

                                </p>

                            </div>

                        </div>

                    ) : (

                        <div className="p-7 space-y-8">


                            {/* ==========================
                                VIDEOS
                            ========================== */}

                            {videos.length > 0 && (

                                <section>

                                    <div className="
                                        flex
                                        items-center
                                        gap-3
                                        mb-4
                                    ">

                                        <FaPlayCircle
                                            className="
                                                text-purple-600
                                                text-xl
                                            "
                                        />

                                        <h3 className="
                                            text-xl
                                            font-bold
                                            text-gray-800
                                        ">

                                            Vidéo du chapitre

                                        </h3>

                                    </div>


                                    <div className="
                                        space-y-5
                                    ">

                                      {videos.map((video) => (
                                        <VideoPlayer
                                          key={video._id}
                                          video={video}
                                          getFileUrl={getFileUrl}
                                        />
                                      ))}

                                    </div>

                                </section>

                            )}


                            {/* ==========================
                                PDF
                            ========================== */}
                            {pdfs.map((pdf) => (
                              <PdfViewer
                                key={pdf._id}
                                pdf={pdf}
                                getFileUrl={getFileUrl}
                              />
                            ))}


                            {/* ==========================
                                QUIZ
                            ========================== */}
                            {quizzes.map((quiz) => (
                              <QuizPlayer
                                key={quiz._id}
                                quiz={quiz}
                                onStart={() =>
                                  navigate(`/student-quiz/${quiz._id}`)
                                }
                              />
                            ))}


                            {/* ==========================
                                EXERCICES
                            ========================== */}
                            {exercises.map((exercise) => (
                              <ExercisePlayer
                                key={exercise._id}
                                exercise={exercise}
                                getFileUrl={getFileUrl}
                              />
                            ))}


                            {/* ==========================
                                AUCUN CONTENU
                            ========================== */}

                            {!videos.length &&
                                !pdfs.length &&
                                !quizzes.length &&
                                !exercises.length && (

                                    <div className="
                                        min-h-[350px]
                                        flex
                                        items-center
                                        justify-center
                                        bg-gray-50
                                        rounded-2xl
                                    ">

                                        <div className="
                                            text-center
                                            text-gray-500
                                        ">

                                            <FaBookOpen
                                                className="
                                                    text-5xl
                                                    mx-auto
                                                    mb-4
                                                    text-purple-300
                                                "
                                            />


                                            <p className="
                                                font-semibold
                                            ">

                                                Aucun contenu disponible

                                            </p>


                                            <p className="
                                                text-sm
                                                mt-2
                                            ">

                                                L'enseignant n'a pas encore
                                                ajouté de contenu à ce chapitre.

                                            </p>

                                        </div>

                                    </div>

                                )}

                        </div>

                    )}


                    {/* ==================================
                        NAVIGATION CHAPITRES
                    ================================== */}

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
                                currentChapterIndex <= 0 ||
                                loadingContent
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
                                updatingProgress ||
                                loadingContent ||
                                chapters.length === 0
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
                                disabled:opacity-40
                                disabled:cursor-not-allowed
                            "
                        >

                            {currentChapterIndex <
                            chapters.length - 1

                                ? "Chapitre suivant"

                                : progress >= 100
                                    ? "Formation terminée"
                                    : updatingProgress
                                        ? "Enregistrement..."
                                        : "Terminer la formation"
                            }


                            <FaChevronRight />

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


                    {/* RESSOURCES */}

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


                        <div className="
                            space-y-3
                        ">


                            <div className="
                                p-4
                                rounded-2xl
                                bg-purple-50
                            ">

                                <p className="
                                    text-sm
                                    text-gray-500
                                ">

                                    Vidéos

                                </p>


                                <p className="
                                    text-xl
                                    font-bold
                                    text-purple-600
                                ">

                                    {videos.length}

                                </p>

                            </div>


                            <div className="
                                p-4
                                rounded-2xl
                                bg-red-50
                            ">

                                <p className="
                                    text-sm
                                    text-gray-500
                                ">

                                    PDF

                                </p>


                                <p className="
                                    text-xl
                                    font-bold
                                    text-red-600
                                ">

                                    {pdfs.length}

                                </p>

                            </div>


                            <div className="
                                p-4
                                rounded-2xl
                                bg-green-50
                            ">

                                <p className="
                                    text-sm
                                    text-gray-500
                                ">

                                    Quiz

                                </p>


                                <p className="
                                    text-xl
                                    font-bold
                                    text-green-600
                                ">

                                    {quizzes.length}

                                </p>

                            </div>


                            <div className="
                                p-4
                                rounded-2xl
                                bg-orange-50
                            ">

                                <p className="
                                    text-sm
                                    text-gray-500
                                ">

                                    Exercices

                                </p>


                                <p className="
                                    text-xl
                                    font-bold
                                    text-orange-600
                                ">

                                    {exercises.length}

                                </p>

                            </div>


                            <div className="
                                flex
                                items-center
                                gap-4
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