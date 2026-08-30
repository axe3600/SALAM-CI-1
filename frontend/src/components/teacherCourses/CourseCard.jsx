// ======================================
// ICÔNES
// ======================================

import {
    FaUsers,
    FaFilePdf,
    FaBookOpen,
    FaEye,
    FaChartLine,
    FaStar,
    FaMoneyBillWave,
    FaTimes,
    FaCheck,
    FaClock
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

import courseService from "../../services/courseService";


function CourseCard({ course }) {

    // ======================================
    // ÉTAT MODAL PRIX
    // ======================================

    const [showPriceModal, setShowPriceModal] = useState(false);

    const [price, setPrice] = useState(
        course.price !== null &&
        course.price !== undefined
            ? course.price
            : ""
    );

    const [savingPrice, setSavingPrice] = useState(false);

    // ======================================
    // ÉTAT LOCAL DU COURS
    // ======================================

    const [courseData, setCourseData] = useState(course);


    // ======================================
    // FORMATAGE DU PRIX
    // ======================================

    const formatPrice = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "Prix non défini";
        }

        return `${Number(value).toLocaleString("fr-FR")} FCFA`;

    };


    // ======================================
    // OUVRIR LA MODAL
    // ======================================

    const openPriceModal = () => {

        setPrice(
            courseData.price !== null &&
            courseData.price !== undefined
                ? courseData.price
                : ""
        );

        setShowPriceModal(true);

    };


    // ======================================
    // FERMER LA MODAL
    // ======================================

    const closePriceModal = () => {

        if (savingPrice) {
            return;
        }

        setShowPriceModal(false);

    };


    // ======================================
    // ENREGISTRER LE PRIX
    // ======================================

    const handleSavePrice = async (e) => {

        e.preventDefault();

        // =========================
        // VALIDATION
        // =========================

        if (
            price === "" ||
            price === null ||
            price === undefined
        ) {

            toast.error(
                "Veuillez renseigner le prix de la formation."
            );

            return;

        }

        const numericPrice = Number(price);

        if (
            !Number.isFinite(numericPrice) ||
            numericPrice < 0
        ) {

            toast.error(
                "Veuillez renseigner un prix valide."
            );

            return;

        }

        // =========================
        // ENREGISTREMENT
        // =========================

        try {

            setSavingPrice(true);

            const response =
                await courseService.updateCoursePrice(
                    courseData._id,
                    numericPrice
                );

            // =========================
            // METTRE À JOUR LA CARTE
            // =========================

            if (response?.course) {

                setCourseData(response.course);

            }
            else {

                setCourseData((previous) => ({
                    ...previous,
                    price: numericPrice,
                    priceStatus:
                        "En attente de validation"
                }));

            }

            setShowPriceModal(false);

            toast.success(
                response?.message ||
                "Prix enregistré et envoyé pour validation."
            );

        }

        catch (error) {

            console.error(
                "Erreur définition prix :",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Impossible d'enregistrer le prix."
            );

        }

        finally {

            setSavingPrice(false);

        }

    };


    // ======================================
    // STATUT DU PRIX
    // ======================================

    const priceStatus =
        courseData.priceStatus ||
        "Non défini";


    // ======================================
    // COULEUR DU STATUT
    // ======================================

    const getPriceStatusClass = () => {

        if (
            priceStatus ===
            "Validé"
        ) {

            return "bg-green-100 text-green-700";

        }

        if (
            priceStatus ===
            "Modification demandée"
        ) {

            return "bg-red-100 text-red-700";

        }

        if (
            priceStatus ===
            "En attente de validation"
        ) {

            return "bg-orange-100 text-orange-700";

        }

        return "bg-gray-100 text-gray-600";

    };


    // ======================================
    // BOUTON PRIX
    // ======================================

    const canSetPrice =
        courseData.status === "En attente" &&
        (
            priceStatus === "Non défini" ||
            priceStatus === "Modification demandée"
        );


    return (

        <>

            {/* ======================================
                CARTE
            ====================================== */}

            <div
                className="
                    bg-white
                    rounded-3xl
                    overflow-hidden
                    shadow-md
                    hover:shadow-2xl
                    hover:-translate-y-2
                    transition-all
                    duration-300
                "
            >

                {/* ======================================
                    IMAGE
                ====================================== */}

                <div className="relative">

                    <img
                        className="
                            w-full
                            h-56
                            object-cover
                        "
                        src={
                            courseData.thumbnail
                                ? courseData.thumbnail.startsWith("http")
                                    ? courseData.thumbnail
                                    : `https://salam-ci-backend.onrender.com/${courseData.thumbnail}`
                                : "/images/course-placeholder.jpg"
                        }
                        alt={
                            courseData.title ||
                            "Image du cours"
                        }
                        onError={(e) => {

                            e.currentTarget.onerror = null;

                            e.currentTarget.src =
                                "/images/course-placeholder.jpg";

                        }}
                    />

                    {/* ======================================
                        BADGE STATUT COURS
                    ====================================== */}

                    <span
                        className={`
                            absolute
                            top-4
                            left-4
                            px-4
                            py-2
                            rounded-full
                            text-sm
                            font-semibold
                            text-white

                            ${
                                courseData.status === "Publié"
                                    ? "bg-green-600"
                                    : courseData.status === "Suspendu"
                                        ? "bg-red-600"
                                        : "bg-orange-500"
                            }
                        `}
                    >

                        {courseData.status}

                    </span>

                </div>


                {/* ======================================
                    CONTENU
                ====================================== */}

                <div className="p-6">

                    {/* Catégorie */}

                    <p className="text-purple-600 font-semibold">

                        {courseData.category}

                    </p>


                    {/* Titre */}

                    <h2 className="text-2xl font-bold mt-2">

                        {courseData.title}

                    </h2>


                    {/* Note */}

                    <div className="flex items-center gap-2 mt-3">

                        <FaStar className="text-yellow-400" />

                        <span className="font-semibold">

                            {courseData.status}

                        </span>

                    </div>


                    {/* ======================================
                        PRIX
                    ====================================== */}

                    <div
                        className="
                            mt-5
                            p-4
                            rounded-2xl
                            bg-gray-50
                            border
                            border-gray-100
                        "
                    >

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-3">

                                <div
                                    className="
                                        w-10
                                        h-10
                                        rounded-xl
                                        bg-purple-100
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >

                                    <FaMoneyBillWave
                                        className="
                                            text-purple-600
                                        "
                                    />

                                </div>

                                <div>

                                    <p className="text-xs text-gray-500">

                                        Prix de la formation

                                    </p>

                                    <p className="font-bold text-lg">

                                        {formatPrice(
                                            courseData.price
                                        )}

                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="mt-3">

                            <span
                                className={`
                                    inline-flex
                                    px-3
                                    py-1
                                    rounded-full
                                    text-xs
                                    font-semibold
                                    ${getPriceStatusClass()}
                                `}
                            >

                                {priceStatus}

                            </span>

                        </div>

                    </div>


                    {/* ======================================
                        STATISTIQUES
                    ====================================== */}

                    <div className="space-y-4 mt-6 text-gray-700">

                        <div className="flex items-center gap-3">

                            <FaUsers className="text-blue-600" />

                            <span>

                                <strong>
                                    {courseData.studentsCount || 0}
                                </strong>{" "}
                                étudiants

                            </span>

                        </div>


                        <div className="flex items-center gap-3">

                            <FaEye className="text-purple-600" />

                            <span>

                                <strong>
                                    {courseData.views || 0}
                                </strong>{" "}
                                vues

                            </span>

                        </div>


                        <div className="flex items-center gap-3">

                            <FaFilePdf className="text-red-600" />

                            <span>

                                <strong>
                                    {courseData.downloads || 0}
                                </strong>{" "}
                                téléchargements

                            </span>

                        </div>


                        <div className="flex items-center gap-3">

                            📅

                            <span>

                                {
                                    courseData.publishedAt
                                        ? new Date(
                                            courseData.publishedAt
                                        ).toLocaleDateString(
                                            "fr-FR"
                                        )
                                        : "Non publié"
                                }

                            </span>

                        </div>

                    </div>


                    {/* ======================================
                        ACTIONS
                    ====================================== */}

                    <div className="grid grid-cols-2 gap-3 mt-8">

                        {/* VOIR */}

                        <Link
                            to={`/teacher-course-preview/${courseData._id}`}
                            className="
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                py-3
                                rounded-xl
                                flex
                                items-center
                                justify-center
                                gap-2
                                transition
                                hover:scale-105
                            "
                        >

                            <FaEye />

                            Voir

                        </Link>


                        {/* DÉFINIR LE PRIX */}
{canSetPrice ? (
    <button
      type="button"
      onClick={openPriceModal}
      className="
        bg-green-600
        hover:bg-green-700
        text-white
        py-3
        rounded-xl
        flex
        items-center
        justify-center
        gap-2
        transition
        hover:scale-105
      "
    >
      <FaMoneyBillWave />

      {priceStatus === "Modification demandée"
        ? "Modifier le prix"
        : "Définir le prix"
      }

    </button>

) : (

    <div
      className="
        bg-gray-100
        text-gray-500
        py-3
        rounded-xl
        flex
        items-center
        justify-center
        gap-2
        text-sm
        font-medium
      "
    >
      {priceStatus === "Validé" ? (
        <>
            <FaCheck />
            Prix validé
        </>

      ) : priceStatus === "En attente de validation" ? (
        <>
            <FaClock />
            Prix en attente
        </>

      ) : courseData.status === "Publié" ? (
        <>
            <FaMoneyBillWave />
            Prix non défini
        </>

      ) : (
        <>
            <FaClock />
            Prix en attente
        </>

      )}
    </div>
)}


                        {/* GÉRER LE CONTENU */}
                        <Link
                            to={`/teacher-course-content/${courseData._id}`}
                            className="
                                col-span-2
                                bg-purple-600
                                hover:bg-purple-700
                                text-white
                                py-3
                                rounded-xl
                                flex
                                items-center
                                justify-center
                                gap-2
                                transition
                                hover:scale-105
                            "
                        >

                            <FaBookOpen />

                            Gérer le contenu

                        </Link>


                        {/* STATISTIQUES */}

                        <Link
                            to={`/teacher-course-statistics/${courseData._id}`}
                            className="
                                col-span-2
                                border
                                border-gray-300
                                hover:bg-gray-100
                                py-3
                                rounded-xl
                                flex
                                items-center
                                justify-center
                                gap-2
                                transition
                                hover:scale-105
                            "
                        >

                            <FaChartLine />

                            Statistiques

                        </Link>

                    </div>

                </div>

            </div>


            {/* ======================================
                MODAL PRIX
            ====================================== */}

            {showPriceModal && (

                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        bg-black/50
                        backdrop-blur-sm
                        p-4
                    "
                    onMouseDown={(e) => {

                        if (
                            e.target === e.currentTarget
                        ) {

                            closePriceModal();

                        }

                    }}
                >

                    <div
                        className="
                            bg-white
                            w-full
                            max-w-md
                            rounded-3xl
                            shadow-2xl
                            p-8
                        "
                    >

                        {/* HEADER */}

                        <div className="flex items-start justify-between">

                            <div>

                                <div
                                    className="
                                        w-12
                                        h-12
                                        rounded-2xl
                                        bg-purple-100
                                        flex
                                        items-center
                                        justify-center
                                        mb-4
                                    "
                                >

                                    <FaMoneyBillWave
                                        className="
                                            text-purple-600
                                            text-xl
                                        "
                                    />

                                </div>

                                <h2 className="text-2xl font-bold">

                                    {
                                        priceStatus ===
                                        "Modification demandée"
                                            ? "Modifier le prix"
                                            : "Définir le prix"
                                    }

                                </h2>

                                <p className="text-gray-500 mt-2">

                                    {
                                        priceStatus ===
                                        "Modification demandée"
                                            ? "Modifiez le prix demandé par l'administrateur."
                                            : "Définissez le prix de votre formation."
                                    }

                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={closePriceModal}
                                className="
                                    text-gray-400
                                    hover:text-gray-700
                                    transition
                                "
                            >

                                <FaTimes />

                            </button>

                        </div>


                        {/* MESSAGE ADMIN */}

                        {
                            priceStatus ===
                            "Modification demandée" &&
                            courseData.adminMessage && (

                                <div
                                    className="
                                        mt-6
                                        p-4
                                        rounded-2xl
                                        bg-red-50
                                        border
                                        border-red-100
                                    "
                                >

                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            text-red-700
                                        "
                                    >

                                        Message de l'administrateur

                                    </p>

                                    <p
                                        className="
                                            text-sm
                                            text-red-600
                                            mt-2
                                        "
                                    >

                                        {courseData.adminMessage}

                                    </p>

                                </div>

                            )
                        }


                        {/* FORMULAIRE */}

                        <form
                            onSubmit={handleSavePrice}
                            className="mt-6"
                        >

                            <label
                                className="
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                    mb-2
                                "
                            >

                                Prix de la formation

                            </label>

                            <div className="relative">

                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={price}
                                    onChange={(e) =>
                                        setPrice(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Ex : 25000"
                                    className="
                                        w-full
                                        border
                                        border-gray-300
                                        rounded-2xl
                                        px-5
                                        py-4
                                        pr-20
                                        text-lg
                                        font-semibold
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-purple-500
                                    "
                                    disabled={savingPrice}
                                />

                                <span
                                    className="
                                        absolute
                                        right-5
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-500
                                        font-semibold
                                    "
                                >

                                    FCFA

                                </span>

                            </div>


                            <p className="text-xs text-gray-400 mt-2">

                                Entrez uniquement le montant en FCFA.

                            </p>


                            {/* BOUTONS */}

                            <div
                                className="
                                    flex
                                    gap-3
                                    mt-8
                                "
                            >

                                <button
                                    type="button"
                                    onClick={closePriceModal}
                                    disabled={savingPrice}
                                    className="
                                        flex-1
                                        border
                                        border-gray-300
                                        text-gray-700
                                        py-3
                                        rounded-xl
                                        hover:bg-gray-100
                                        transition
                                    "
                                >

                                    Annuler

                                </button>


                                <button
                                    type="submit"
                                    disabled={savingPrice}
                                    className="
                                        flex-1
                                        bg-purple-600
                                        hover:bg-purple-700
                                        text-white
                                        py-3
                                        rounded-xl
                                        transition
                                        disabled:opacity-60
                                    "
                                >

                                    {
                                        savingPrice
                                            ? "Enregistrement..."
                                            : "Enregistrer le prix"
                                    }

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </>

    );

}

export default CourseCard;