import { useEffect, useState } from "react";
import API from "../../services/api";

function CategoryFilter({
    selectedCategory,
    onCategoryChange
}) {

    // ======================================
    // CATEGORIES
    // ======================================

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // ======================================
    // RECUPERER LES CATEGORIES
    // ======================================

    useEffect(() => {

        const fetchCategories = async () => {

            try {

                setLoading(true);

                setError("");

                const response = await API.get(
                    "/categories/list"
                );

                console.log(
                    "CATÉGORIES REÇUES :",
                    response.data
                );

                // ======================================
                // COMPATIBLE AVEC PLUSIEURS FORMATS
                // ======================================

                const data = response.data;

                let categoriesData = [];

                if (Array.isArray(data)) {

                    categoriesData = data;

                }

                else if (
                    Array.isArray(data.categories)
                ) {

                    categoriesData = data.categories;

                }

                else if (
                    Array.isArray(data.data)
                ) {

                    categoriesData = data.data;

                }

                setCategories(
                    categoriesData
                );

            }

            catch (error) {

                console.error(
                    "Erreur récupération catégories :",
                    error
                );

                setError(
                    "Impossible de charger les catégories."
                );

            }

            finally {

                setLoading(false);

            }

        };

        fetchCategories();

    }, []);

    // ======================================
    // NORMALISER LE NOM
    // ======================================

    const getCategoryName = (category) => {

        if (typeof category === "string") {

            return category;

        }

        return category?.name || "";

    };

    // ======================================
    // CHARGEMENT
    // ======================================

    if (loading) {

        return (

            <div className="bg-white rounded-2xl shadow-md p-6 mb-8">

                <h2 className="text-xl font-bold text-gray-800 mb-5">

                    Catégories

                </h2>

                <div className="flex flex-wrap gap-4">

                    <div className="
                        h-10
                        w-24
                        bg-gray-100
                        rounded-full
                        animate-pulse
                    " />

                    <div className="
                        h-10
                        w-36
                        bg-gray-100
                        rounded-full
                        animate-pulse
                    " />

                    <div className="
                        h-10
                        w-40
                        bg-gray-100
                        rounded-full
                        animate-pulse
                    " />

                </div>

            </div>

        );

    }

    // ======================================
    // AFFICHAGE
    // ======================================

    return (

        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">

            {/* ======================================
                TITRE
            ====================================== */}

            <h2 className="text-xl font-bold text-gray-800 mb-5">

                Catégories

            </h2>

            {/* ======================================
                ERREUR
            ====================================== */}

            {error && (

                <p className="text-red-500 text-sm mb-4">

                    {error}

                </p>

            )}

            {/* ======================================
                LISTE
            ====================================== */}

            <div className="flex flex-wrap gap-4">

                {/* ======================================
                    TOUTES
                ====================================== */}

                <button

                    onClick={() =>
                        onCategoryChange("Toutes")
                    }

                    className={`
                        px-6
                        py-3
                        rounded-full
                        font-medium
                        transition-all
                        duration-300
                        ${
                            selectedCategory === "Toutes"

                                ? `
                                    bg-gradient-to-r
                                    from-purple-600
                                    to-indigo-600
                                    text-white
                                    shadow-md
                                  `

                                : `
                                    bg-gray-100
                                    text-gray-700
                                    hover:bg-gradient-to-r
                                    hover:from-purple-600
                                    hover:to-indigo-600
                                    hover:text-white
                                  `
                        }
                    `}

                >

                    Toutes

                </button>

                {/* ======================================
                    CATEGORIES MONGODB
                ====================================== */}

                {categories.map(
                    (category, index) => {

                        const name =
                            getCategoryName(category);

                        if (!name) return null;

                        return (

                            <button

                                key={
                                    category._id ||
                                    category.id ||
                                    index
                                }

                                onClick={() =>
                                    onCategoryChange(name)
                                }

                                className={`
                                    px-6
                                    py-3
                                    rounded-full
                                    font-medium
                                    transition-all
                                    duration-300
                                    ${
                                        selectedCategory === name

                                            ? `
                                                bg-gradient-to-r
                                                from-purple-600
                                                to-indigo-600
                                                text-white
                                                shadow-md
                                              `

                                            : `
                                                bg-gray-100
                                                text-gray-700
                                                hover:bg-gradient-to-r
                                                hover:from-purple-600
                                                hover:to-indigo-600
                                                hover:text-white
                                              `
                                    }
                                `}

                            >

                                {name}

                            </button>

                        );

                    }
                )}

            </div>

            {/* ======================================
                AUCUNE CATEGORIE
            ====================================== */}

            {!categories.length && !error && (

                <p className="text-gray-500 text-sm">

                    Aucune catégorie disponible pour le moment.

                </p>

            )}

        </div>

    );

}

export default CategoryFilter;