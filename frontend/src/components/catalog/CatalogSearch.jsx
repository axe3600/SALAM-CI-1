// ======================================
// ICÔNE
// ======================================

import {
    FaSearch
} from "react-icons/fa";


// ======================================
// RECHERCHE DU CATALOGUE
// ======================================

function CatalogSearch({

    search,

    setSearch,

    onSearch

}) {

    // ======================================
    // ENTRÉE CLAVIER
    // ======================================

    const handleKeyDown = (event) => {

        if (
            event.key === "Enter"
        ) {

            onSearch();

        }

    };


    return (

        <div
            className="
                bg-white
                rounded-2xl
                shadow-md
                p-6
                mb-8
            "
        >

            {/* ==================================
                TITRE
            ================================== */}

            <h2
                className="
                    text-xl
                    font-bold
                    text-gray-800
                    mb-4
                "
            >

                Rechercher un cours

            </h2>


            {/* ==================================
                INPUT + BOUTON
            ================================== */}

            <div
                className="
                    flex
                    flex-col
                    md:flex-row
                    gap-4
                "
            >

                {/* ==================================
                    INPUT
                ================================== */}

                <div
                    className="
                        relative
                        flex-1
                    "
                >

                    <FaSearch
                        className="
                            absolute
                            left-5
                            top-1/2
                            -translate-y-1/2
                            text-gray-400
                        "
                    />


                    <input

                        type="text"

                        value={
                            typeof search === "string"
                                ? search
                                : ""
                        }

                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }

                        onKeyDown={
                            handleKeyDown
                        }

                        placeholder="Rechercher un cours, un enseignant..."

                        className="
                            w-full
                            pl-14
                            pr-4
                            py-4
                            rounded-xl
                            border
                            border-gray-300
                            focus:outline-none
                            focus:ring-2
                            focus:ring-purple-500
                        "

                    />

                </div>


                {/* ==================================
                    BOUTON
                ================================== */}

                <button

                    type="button"

                    onClick={
                        onSearch
                    }

                    className="
                        bg-gradient-to-r
                        from-purple-600
                        to-indigo-600
                        text-white
                        px-8
                        py-3
                        rounded-xl
                        hover:scale-105
                        transition-all
                        font-semibold
                    "

                >

                    Rechercher

                </button>

            </div>

        </div>

    );

}


export default CatalogSearch;