// ======================================
// IMPORTS
// ======================================

import { useEffect, useState } from "react";

import {
    FaBookOpen,
    FaGraduationCap,
    FaUsers
} from "react-icons/fa";

import API from "../../services/api";


// ======================================
// COMPOSANT
// ======================================

function CatalogHero() {

    // ======================================
    // STATISTIQUES
    // ======================================

    const [stats, setStats] = useState({

        courses: 0,

        teachers: 0,

        students: 0

    });


    const [loading, setLoading] = useState(true);


    // ======================================
    // RÉCUPÉRER LES STATISTIQUES
    // ======================================

    useEffect(() => {

        const fetchStats = async () => {

            try {

                const response =
                    await API.get("/courses/stats");

                console.log(
                    "STATISTIQUES CATALOGUE :",
                    response.data
                );


                setStats({

                    courses:
                        response.data.publishedCourses ?? 0,

                    teachers:
                        response.data.totalTeachers ?? 0,

                    students:
                        response.data.totalStudents ?? 0

                });

            }

            catch (error) {

                console.error(
                    "Erreur récupération statistiques catalogue :",
                    error
                );

            }

            finally {

                setLoading(false);

            }

        };


        fetchStats();

    }, []);


    // ======================================
    // FORMATAGE DES NOMBRES
    // ======================================

    const formatNumber = (number) => {

        return Number(number).toLocaleString("fr-FR");

    };


    // ======================================
    // AFFICHAGE
    // ======================================

    return (

        <section
            className="
                bg-gradient-to-r
                from-indigo-900
                via-purple-800
                to-indigo-700
                rounded-3xl
                p-10
                text-white
                shadow-xl
                mb-8
            "
        >

            {/* ======================================
                CONTENU PRINCIPAL
            ====================================== */}

            <div
                className="
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    gap-8
                "
            >

                {/* ==================================
                    TEXTE
                ================================== */}

                <div>

                    <h1
                        className="
                            text-5xl
                            font-extrabold
                        "
                    >

                        Catalogue des cours

                    </h1>


                    <p
                        className="
                            mt-4
                            text-lg
                            text-indigo-100
                            max-w-2xl
                            leading-relaxed
                        "
                    >

                        Découvrez les meilleurs cours proposés par nos enseignants
                        et développez vos compétences grâce à une plateforme
                        d'apprentissage moderne.

                    </p>

                </div>


                {/* ==================================
                    STATISTIQUES DYNAMIQUES
                ================================== */}

                <div
                    className="
                        grid
                        grid-cols-3
                        gap-5
                    "
                >

                    {/* ==================================
                        COURS
                    ================================== */}

                    <div
                        className="
                            bg-white/10
                            backdrop-blur
                            rounded-2xl
                            p-5
                            text-center
                            min-w-[110px]
                        "
                    >

                        <FaBookOpen
                            className="
                                mx-auto
                                text-3xl
                                mb-3
                                text-yellow-300
                            "
                        />


                        <h2
                            className="
                                text-3xl
                                font-bold
                            "
                        >

                            {loading
                                ? "..."
                                : formatNumber(stats.courses)
                            }

                        </h2>


                        <p
                            className="
                                text-sm
                                text-indigo-100
                            "
                        >

                            Cours

                        </p>

                    </div>


                    {/* ==================================
                        ENSEIGNANTS
                    ================================== */}

                    <div
                        className="
                            bg-white/10
                            backdrop-blur
                            rounded-2xl
                            p-5
                            text-center
                            min-w-[110px]
                        "
                    >

                        <FaGraduationCap
                            className="
                                mx-auto
                                text-3xl
                                mb-3
                                text-green-300
                            "
                        />


                        <h2
                            className="
                                text-3xl
                                font-bold
                            "
                        >

                            {loading
                                ? "..."
                                : formatNumber(stats.teachers)
                            }

                        </h2>


                        <p
                            className="
                                text-sm
                                text-indigo-100
                            "
                        >

                            Enseignants

                        </p>

                    </div>


                    {/* ==================================
                        ÉTUDIANTS
                    ================================== */}

                    <div
                        className="
                            bg-white/10
                            backdrop-blur
                            rounded-2xl
                            p-5
                            text-center
                            min-w-[110px]
                        "
                    >

                        <FaUsers
                            className="
                                mx-auto
                                text-3xl
                                mb-3
                                text-pink-300
                            "
                        />


                        <h2
                            className="
                                text-3xl
                                font-bold
                            "
                        >

                            {loading
                                ? "..."
                                : formatNumber(stats.students)
                            }

                        </h2>


                        <p
                            className="
                                text-sm
                                text-indigo-100
                            "
                        >

                            Étudiants

                        </p>

                    </div>

                </div>

            </div>

        </section>

    );

}

export default CatalogHero;