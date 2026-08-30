import { useState } from "react";

// ======================================
// LAYOUT ÉTUDIANT
// ======================================
import DashboardLayout from "../../layouts/DashboardLayout";

// ======================================
// COMPOSANTS DU CATALOGUE
// ======================================
import CatalogHero from "../../components/catalog/CatalogHero";
import CatalogSearch from "../../components/catalog/CatalogSearch";
import CategoryFilter from "../../components/catalog/CategoryFilter";
import CourseGrid from "../../components/catalog/CourseGrid";

function Catalog() {

    // ======================================
    // CATÉGORIE SÉLECTIONNÉE
    // ======================================
    const [selectedCategory, setSelectedCategory] =
        useState("Toutes");

    // ======================================
    // RECHERCHE
    // ======================================
    const [search, setSearch] = useState("");

    // ======================================
    // CHANGEMENT DE CATÉGORIE
    // ======================================
    const handleCategoryChange = (category) => {

        console.log(
            "Catégorie sélectionnée :",
            category
        );

        setSelectedCategory(category);

    };

    // ======================================
    // LANCER LA RECHERCHE
    // ======================================
    const handleSearch = () => {

        console.log(
            "Recherche :",
            search
        );

        // La recherche est déjà stockée
        // dans l'état "search".
        // CourseGrid se mettra automatiquement
        // à jour.
    };

    return (

        <DashboardLayout>

            {/* ======================================
                HERO
            ====================================== */}
            <CatalogHero />

            {/* ======================================
                RECHERCHE
            ====================================== */}
            <CatalogSearch

                search={search}

                setSearch={setSearch}

                onSearch={handleSearch}

            />

            {/* ======================================
                CATEGORIES
            ====================================== */}
            <CategoryFilter

                selectedCategory={
                    selectedCategory
                }

                onCategoryChange={
                    handleCategoryChange
                }

            />

            {/* ======================================
                COURS
            ====================================== */}
            <CourseGrid

                selectedCategory={
                    selectedCategory
                }

                search={
                    search
                }

            />

        </DashboardLayout>

    );

}

export default Catalog;