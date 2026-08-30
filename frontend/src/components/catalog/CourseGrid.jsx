// ======================================
// IMPORTS
// ======================================

import { useEffect, useState } from "react";
import API from "../../services/api";
import CourseCard from "./CourseCard";


// ======================================
// COMPOSANT
// ======================================

function CourseGrid({
    selectedCategory,
    search
}) {

    // ======================================
    // ETAT DES COURS
    // ======================================

    const [courses, setCourses] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ======================================
    // RECUPERER LES COURS
    // ======================================

    useEffect(() => {

        const fetchCourses = async () => {

            try {

                setLoading(true);

                setError("");

                // ======================================
                // RECUPERATION
                // ======================================

                const response = await API.get(
                    "/courses",
                    {
                        params: {
                            page: 1,
                            limit: 100
                        }
                    }
                );

                console.log(
                    "COURS REÇUS :",
                    response.data
                );

                // ======================================
                // RECUPERATION DES DONNEES
                // ======================================

                const data = response.data;

                let coursesData = [];

                if (Array.isArray(data)) {

                    coursesData = data;

                }

                else if (
                    Array.isArray(data.courses)
                ) {

                    coursesData = data.courses;

                }

                else if (
                    Array.isArray(data.data)
                ) {

                    coursesData = data.data;

                }

                setCourses(coursesData);

            }

            catch (error) {

                console.error(
                    "Erreur récupération cours :",
                    error
                );

                setError(
                    "Impossible de charger les cours."
                );

            }

            finally {

                setLoading(false);

            }

        };

        fetchCourses();

    }, []);


    // ======================================
    // FILTRAGE
    // ======================================

    const filteredCourses = courses.filter(
        (course) => {

            // ======================================
            // SEULS LES COURS PUBLIES ET ACTIFS
            // ======================================

            if (
                course.status &&
                course.status !== "Publié"
            ) {

                return false;

            }

            if (
                course.isActive !== undefined &&
                course.isActive === false
            ) {

                return false;

            }


            // ======================================
            // CATEGORIE
            // ======================================

            if (
                selectedCategory &&
                selectedCategory !== "Toutes"
            ) {

                const courseCategory =
                    typeof course.category === "string"

                        ? course.category

                        : course.category?.name || "";

                if (
                    courseCategory !==
                    selectedCategory
                ) {

                    return false;

                }

            }


            // ======================================
            // RECHERCHE
            // ======================================

            const searchValue =
            typeof search === "string"
                ? search.trim().toLowerCase()
                : "";
        
            if (searchValue) {

                const title =
                    course.title
                        ?.toLowerCase() || "";

                const description =
                    course.description
                        ?.toLowerCase() || "";

                const teacherName =
                    typeof course.teacher === "object"

                        ? course.teacher?.name
                            ?.toLowerCase() || ""

                        : "";

                const category =
                    typeof course.category === "string"

                        ? course.category
                            ?.toLowerCase() || ""

                        : course.category?.name
                            ?.toLowerCase() || "";


                const matches =

                    title.includes(searchValue) ||

                    description.includes(searchValue) ||

                    teacherName.includes(searchValue) ||

                    category.includes(searchValue);


                if (!matches) {

                    return false;

                }

            }


            return true;

        }
    );


    // ======================================
    // CHARGEMENT
    // ======================================

    if (loading) {

        return (

            <div className="
                bg-white
                rounded-2xl
                shadow-md
                p-10
                text-center
            ">

                <div className="
                    w-10
                    h-10
                    border-4
                    border-purple-200
                    border-t-purple-600
                    rounded-full
                    animate-spin
                    mx-auto
                    mb-4
                " />

                <p className="text-gray-500">

                    Chargement des cours...

                </p>

            </div>

        );

    }


    // ======================================
    // ERREUR
    // ======================================

    if (error) {

        return (

            <div className="
                bg-white
                rounded-2xl
                shadow-md
                p-10
                text-center
            ">

                <p className="text-red-500">

                    {error}

                </p>

            </div>

        );

    }


    // ======================================
    // AFFICHAGE
    // ======================================

    return (

        <>

            {/* ======================================
                TITRE
            ====================================== */}

            <h2 className="
                text-2xl
                font-bold
                text-gray-800
                mb-6
            ">

                {
                    selectedCategory &&
                    selectedCategory !== "Toutes"

                        ? selectedCategory

                        : "Tous les cours"
                }

            </h2>


            {/* ======================================
                AUCUN COURS
            ====================================== */}

            {filteredCourses.length === 0 ? (

                <div className="
                    bg-white
                    rounded-2xl
                    shadow-md
                    p-10
                    text-center
                ">

                    <div className="
                        text-5xl
                        mb-4
                    ">

                        📚

                    </div>

                    <h3 className="
                        text-xl
                        font-bold
                        text-gray-800
                        mb-2
                    ">

                        Aucun cours disponible

                    </h3>

                    <p className="
                        text-gray-500
                    ">

                        Aucun cours ne correspond
                        à votre recherche.

                    </p>

                </div>

            ) : (

                /* ======================================
                    GRILLE
                ====================================== */

                <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-3
                    gap-8
                ">

                    {

                        filteredCourses.map(
                            (course) => (

                                <CourseCard

                                    key={
                                        course._id
                                    }

                                    course={
                                        course
                                    }

                                />

                            )
                        )

                    }

                </div>

            )}

        </>

    );

}

export default CourseGrid;