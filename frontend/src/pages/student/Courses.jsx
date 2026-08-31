// ======================================
// MES COURS - ÉTUDIANT
// ======================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaSearch,
    FaPlay,
    FaBookOpen
} from "react-icons/fa";

import DashboardLayout from "../../layouts/DashboardLayout";

import API from "../../services/api";


// ======================================
// COMPOSANT
// ======================================

function Courses() {

    const navigate = useNavigate();


    // ======================================
    // INSCRIPTIONS
    // ======================================

    const [enrollments, setEnrollments] = useState([]);


    // ======================================
    // RECHERCHE
    // ======================================

    const [search, setSearch] = useState("");


    // ======================================
    // CATEGORIE
    // ======================================

    const [selectedCategory, setSelectedCategory] =
        useState("Toutes");


    // ======================================
    // CHARGEMENT
    // ======================================

    const [loading, setLoading] = useState(true);


    // ======================================
    // ERREUR
    // ======================================

    const [error, setError] = useState("");


    // ======================================
    // RECUPERER MES COURS
    // ======================================

    const getMyCourses = async () => {

        try {

            setLoading(true);

            setError("");


            const response = await API.get(
                "/enrollments/my-courses"
            );


            console.log(
                "MES COURS :",
                response.data
            );


            const data = response.data;


            if (
                Array.isArray(data?.enrollments)
            ) {

                setEnrollments(
                    data.enrollments
                );

            }

            else {

                setEnrollments([]);

            }

        }

        catch (error) {

            console.error(
                "Erreur récupération mes cours :",
                error
            );


            setError(

                error.response?.data?.message ||

                "Impossible de récupérer vos cours."

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

        getMyCourses();

    }, []);


    // ======================================
    // TRANSFORMATION DES DONNEES
    // ======================================

    const courses = enrollments

        .filter(
            (enrollment) =>
                enrollment.course
        )

        .map(
            (enrollment) => ({

                enrollmentId:
                    enrollment._id,

                course:
                    enrollment.course,

                title:
                    enrollment.course?.title ||
                    "Cours sans titre",

                teacher:
                    enrollment.course?.teacher?.name ||
                    "Enseignant",

                category:
                    enrollment.course?.category ||
                    "Non catégorisé",

                progress:
                    Number(enrollment.progress) || 0,

                image:
                    enrollment.course?.thumbnail ||
                    "/images/course-placeholder.jpg",

                completed:
                    enrollment.completed === true

            })
        );


    // ======================================
    // FILTRAGE
    // ======================================

    const filteredCourses =
        courses.filter((course) => {

            // ======================================
            // CATEGORIE
            // ======================================

            if (
                selectedCategory !== "Toutes" &&
                course.category !== selectedCategory
            ) {

                return false;

            }


            // ======================================
            // RECHERCHE
            // ======================================

            if (
                search.trim()
            ) {

                const value =
                    search
                        .trim()
                        .toLowerCase();


                const title =
                    course.title
                        .toLowerCase();


                const teacher =
                    course.teacher
                        .toLowerCase();


                const category =
                    course.category
                        .toLowerCase();


                if (

                    !title.includes(value) &&

                    !teacher.includes(value) &&

                    !category.includes(value)

                ) {

                    return false;

                }

            }


            return true;

        });


    // ======================================
    // CATEGORIES DISPONIBLES
    // ======================================

    const categories = [

        "Toutes",

        ...new Set(

            courses
                .map(
                    (course) =>
                        course.category
                )
                .filter(Boolean)

        )

    ];


    // ======================================
    // ACCEDER AU COURS
    // ======================================

    const handleContinueCourse = (
        courseId
    ) => {

        navigate(
            `/student-course/${courseId}/learn`
        );

    };


    // ======================================
    // CHARGEMENT
    // ======================================

    if (loading) {

        return (

            <DashboardLayout>

                <div className="
                    bg-white
                    rounded-3xl
                    shadow
                    p-12
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
                        mb-5
                    " />

                    <p className="
                        text-gray-500
                    ">

                        Chargement de vos cours...

                    </p>

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
                    bg-white
                    rounded-3xl
                    shadow
                    p-12
                    text-center
                ">

                    <div className="
                        text-6xl
                        mb-5
                    ">

                        ⚠️

                    </div>


                    <h2 className="
                        text-2xl
                        font-bold
                        text-gray-800
                    ">

                        Impossible de charger vos cours

                    </h2>


                    <p className="
                        text-gray-500
                        mt-3
                    ">

                        {error}

                    </p>


                    <button
                        onClick={getMyCourses}
                        className="
                            mt-6
                            bg-purple-600
                            hover:bg-purple-700
                            text-white
                            px-6
                            py-3
                            rounded-xl
                            font-semibold
                        "
                    >

                        Réessayer

                    </button>

                </div>

            </DashboardLayout>

        );

    }


    return (

        <DashboardLayout>


            {/* ======================================
                HEADER
            ====================================== */}

            <div>

                <h1 className="
                    text-5xl
                    font-bold
                    text-gray-900
                ">

                    Mes Cours

                </h1>


                <p className="
                    text-gray-500
                    mt-2
                ">

                    Continuez votre apprentissage

                </p>

            </div>


            {/* ======================================
                RECHERCHE
            ====================================== */}

            <div className="
                bg-white
                rounded-2xl
                shadow
                p-5
                mt-8
            ">

                <div className="
                    flex
                    items-center
                    gap-4
                ">

                    <FaSearch
                        className="
                            text-gray-400
                        "
                    />


                    <input

                        type="text"

                        value={search}

                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }

                        placeholder="
                            Rechercher un cours...
                        "

                        className="
                            w-full
                            outline-none
                        "

                    />

                </div>

            </div>


            {/* ======================================
                FILTRES
            ====================================== */}

            <div className="
                flex
                gap-3
                mt-6
                flex-wrap
            ">

                {categories.map(
                    (category) => (

                        <button

                            key={category}

                            type="button"

                            onClick={() =>
                                setSelectedCategory(
                                    category
                                )
                            }

                            className={`
                                px-5
                                py-2
                                rounded-full
                                transition
                                ${
                                    selectedCategory ===
                                    category

                                    ? "bg-purple-600 text-white"

                                    : "bg-white shadow text-gray-700 hover:bg-gray-100"
                                }
                            `}

                        >

                            {category}

                        </button>

                    )
                )}

            </div>


            {/* ======================================
                NOMBRE DE COURS
            ====================================== */}

            <div className="
                flex
                items-center
                gap-3
                mt-8
                text-gray-600
            ">

                <FaBookOpen
                    className="
                        text-purple-600
                    "
                />

                <span>

                    {filteredCourses.length}

                    {" "}

                    {filteredCourses.length > 1
                        ? "cours"
                        : "cours"
                    }

                </span>

            </div>


            {/* ======================================
                AUCUN COURS
            ====================================== */}

            {filteredCourses.length === 0 ? (

                <div className="
                    bg-white
                    rounded-3xl
                    shadow
                    p-12
                    text-center
                    mt-8
                ">

                    <div className="
                        text-6xl
                        mb-5
                    ">

                        📚

                    </div>


                    <h2 className="
                        text-2xl
                        font-bold
                        text-gray-800
                    ">

                        Aucun cours

                    </h2>


                    <p className="
                        text-gray-500
                        mt-3
                    ">

                        Vous n'avez pas encore
                        de formation correspondant
                        à votre recherche.

                    </p>


                    <button

                        type="button"

                        onClick={() =>
                            navigate("/catalog")
                        }

                        className="
                            mt-6
                            bg-purple-600
                            hover:bg-purple-700
                            text-white
                            px-6
                            py-3
                            rounded-xl
                            font-semibold
                        "
                    >

                        Découvrir les formations

                    </button>

                </div>

            ) : (


                /* ======================================
                    LISTE DES COURS
                ====================================== */

                <div className="
                    grid
                    md:grid-cols-2
                    xl:grid-cols-3
                    gap-8
                    mt-8
                ">

                    {filteredCourses.map(
                        (course) => (

                            <div

                                key={
                                    course.enrollmentId
                                }

                                className="
                                    bg-white
                                    rounded-3xl
                                    shadow
                                    overflow-hidden
                                    hover:shadow-xl
                                    transition
                                "
                            >

                                {/* IMAGE */}

                                <div className="
                                    relative
                                ">

                                    <img

                                        src={
                                            course.image
                                        }

                                        alt={
                                            course.title
                                        }

                                        className="
                                            w-full
                                            h-48
                                            object-cover
                                        "

                                        onError={(event) => {

                                            event.currentTarget.onerror =
                                                null;

                                            event.currentTarget.src =
                                                "/images/course-placeholder.jpg";

                                        }}

                                    />


                                    {/* CATEGORIE */}

                                    <span className="
                                        absolute
                                        top-4
                                        left-4
                                        bg-purple-600
                                        text-white
                                        px-3
                                        py-1
                                        rounded-full
                                        text-xs
                                        font-semibold
                                    ">

                                        {course.category}

                                    </span>

                                </div>


                                {/* CONTENU */}

                                <div className="
                                    p-6
                                ">

                                    <h2 className="
                                        text-xl
                                        font-bold
                                        text-gray-800
                                    ">

                                        {course.title}

                                    </h2>


                                    <p className="
                                        text-gray-500
                                        mt-2
                                    ">

                                        {course.teacher}

                                    </p>


                                    {/* ==================================
                                        PROGRESSION
                                    ================================== */}

                                    <div className="
                                        mt-6
                                    ">

                                        <div className="
                                            flex
                                            justify-between
                                            text-sm
                                            mb-2
                                        ">

                                            <span>
                                                Progression
                                            </span>


                                            <span className="
                                                font-semibold
                                            ">

                                                {course.progress}%

                                            </span>

                                        </div>


                                        <div className="
                                            w-full
                                            bg-gray-200
                                            h-3
                                            rounded-full
                                            overflow-hidden
                                        ">

                                            <div

                                                className="
                                                    bg-purple-600
                                                    h-3
                                                    rounded-full
                                                    transition-all
                                                "

                                                style={{
                                                    width:
                                                        `${course.progress}%`
                                                }}

                                            />

                                        </div>

                                    </div>


                                    {/* ==================================
                                        STATUT
                                    ================================== */}

                                    {course.completed && (

                                        <div className="
                                            mt-4
                                            text-sm
                                            font-semibold
                                            text-green-600
                                        ">

                                            ✓ Formation terminée

                                        </div>

                                    )}


                                    {/* ==================================
                                        BOUTON
                                    ================================== */}

                                    <button

                                        type="button"

                                        onClick={() =>
                                            handleContinueCourse(
                                                course.course._id
                                            )
                                        }

                                        className="
                                            mt-6
                                            w-full
                                            bg-purple-600
                                            hover:bg-purple-700
                                            transition
                                            text-white
                                            py-3
                                            rounded-xl
                                            flex
                                            items-center
                                            justify-center
                                            gap-3
                                            font-semibold
                                        "
                                    >

                                        <FaPlay />

                                        {course.completed
                                            ? "Revoir le cours"
                                            : "Continuer le cours"
                                        }

                                    </button>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </DashboardLayout>

    );

}

export default Courses;