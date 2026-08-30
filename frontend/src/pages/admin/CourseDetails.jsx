import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaCheckCircle,
    FaTimesCircle,
    FaEdit,
    FaTrash,
    FaBookOpen,
    FaUsers,
    FaEye,
    FaDownload,
    FaMoneyBillWave,
    FaClock,
    FaExclamationTriangle
} from "react-icons/fa";

import API from "../../services/api";
import { toast } from "react-toastify";

const CourseDetails = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    // =====================================================
    // COURS
    // =====================================================

    const [course, setCourse] = useState(null);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    // =====================================================
    // MODALS
    // =====================================================

    const [showEditModal, setShowEditModal] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [showPriceChangeModal, setShowPriceChangeModal] =
        useState(false);

    // =====================================================
    // MESSAGE ADMIN
    // =====================================================

    const [adminMessage, setAdminMessage] = useState("");

    const [priceActionLoading, setPriceActionLoading] =
        useState(false);

    // =====================================================
    // FORMULAIRE MODIFICATION
    // =====================================================

    const [formData, setFormData] = useState({

        title: "",

        description: "",

        category: "",

        teacher: ""

    });

    // =====================================================
    // LISTES
    // =====================================================

    const [categories, setCategories] = useState([]);

    const [teachers, setTeachers] = useState([]);


    // =====================================================
    // RÉCUPÉRER LE COURS
    // =====================================================

    const getCourse = async () => {

        try {

            setLoading(true);

            const res = await API.get(

                `/courses/${id}`

            );

            console.log(

                "Cours administrateur :",

                res.data

            );

            setCourse(res.data);

        }

        catch (error) {

            console.log(error);

            toast.error(

                "Impossible de charger le cours."

            );

        }

        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // CATÉGORIES
    // =====================================================

    const getCategories = async () => {

        try {

            const res = await API.get(

                "/categories/list"

            );

            setCategories(res.data);

        }

        catch (error) {

            console.log(error);

        }

    };


    // =====================================================
    // ENSEIGNANTS
    // =====================================================

    const getTeachers = async () => {

        try {

            const res = await API.get(

                "/users/teachers"

            );

            setTeachers(res.data);

        }

        catch (error) {

            console.log(error);

        }

    };


    // =====================================================
    // MODIFIER LE COURS
    // =====================================================

    const updateCourse = async () => {

        try {

            setSaving(true);

            const res = await API.put(

                `/courses/${id}`,

                {

                    title: formData.title,

                    description: formData.description,

                    category: formData.category,

                    teacher: formData.teacher

                }

            );

            toast.success(

                res.data.message ||

                "Cours modifié avec succès."

            );

            setShowEditModal(false);

            await getCourse();

        }

        catch (error) {

            console.log(error);

            toast.error(

                error.response?.data?.message ||

                "Erreur lors de la modification."

            );

        }

        finally {

            setSaving(false);

        }

    };


    // =====================================================
    // APPROUVER LE PRIX
    // PATCH /api/courses/:id/price/approve
    // =====================================================

    const approvePrice = async () => {

        try {

            setPriceActionLoading(true);

            const res = await API.patch(

                `/courses/${id}/price/approve`

            );

            toast.success(

                res.data.message ||

                "Prix accepté et cours publié."

            );

            await getCourse();

        }

        catch (error) {

            console.log(error);

            toast.error(

                error.response?.data?.message ||

                "Impossible d'approuver le prix."

            );

        }

        finally {

            setPriceActionLoading(false);

        }

    };


    // =====================================================
    // DEMANDER UNE MODIFICATION DU PRIX
    // PATCH /api/courses/:id/price/request-change
    // =====================================================

    const requestPriceChange = async () => {

        if (!adminMessage.trim()) {

            toast.error(

                "Veuillez saisir un message pour l'enseignant."

            );

            return;

        }

        try {

            setPriceActionLoading(true);

            const res = await API.patch(

                `/courses/${id}/price/request-change`,

                {

                    message: adminMessage.trim()

                }

            );

            toast.success(

                res.data.message ||

                "Demande de modification envoyée."

            );

            setShowPriceChangeModal(false);

            setAdminMessage("");

            await getCourse();

        }

        catch (error) {

            console.log(error);

            toast.error(

                error.response?.data?.message ||

                "Impossible d'envoyer la demande."

            );

        }

        finally {

            setPriceActionLoading(false);

        }

    };


    // =====================================================
    // PUBLIER
    // =====================================================

    const publishCourse = async () => {

        try {

            const res = await API.patch(

                `/courses/${id}/publish`

            );

            toast.success(

                res.data.message ||

                "Cours publié avec succès."

            );

            await getCourse();

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Impossible de publier le cours."

            );

        }

    };


    // =====================================================
    // SUSPENDRE
    // =====================================================

    const suspendCourse = async () => {

        try {

            const res = await API.patch(

                `/courses/${id}/suspend`

            );

            toast.success(

                res.data.message ||

                "Cours suspendu avec succès."

            );

            await getCourse();

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Impossible de suspendre le cours."

            );

        }

    };


    // =====================================================
    // SUPPRIMER
    // =====================================================

    const deleteCourse = async () => {

        try {

            const res = await API.delete(

                `/courses/${id}`

            );

            toast.success(

                res.data.message ||

                "Cours supprimé avec succès."

            );

            setShowDeleteModal(false);

            navigate("/admin-courses");

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Erreur lors de la suppression."

            );

        }

    };


    // =====================================================
    // CHARGEMENT INITIAL
    // =====================================================

    useEffect(() => {

        getCourse();

        getCategories();

        getTeachers();

    }, [id]);


    // =====================================================
    // REMPLIR LE FORMULAIRE
    // =====================================================

    useEffect(() => {

        if (course) {

            setFormData({

                title: course.title || "",

                description: course.description || "",

                category: course.category || "",

                teacher: course.teacher?._id || ""

            });

        }

    }, [course]);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="min-h-screen flex items-center justify-center">

                <div className="flex flex-col items-center">

                    <div
                        className="
                            w-14
                            h-14
                            border-4
                            border-purple-600
                            border-t-transparent
                            rounded-full
                            animate-spin
                        "
                    />

                    <p className="mt-5 text-gray-500">

                        Chargement du cours...

                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // COURS INTROUVABLE
    // =====================================================

    if (!course) {

        return (

            <div className="p-10">

                <h2 className="text-2xl font-bold">

                    Cours introuvable.

                </h2>

                <button
                    onClick={() => navigate("/admin-courses")}
                    className="
                        mt-5
                        bg-purple-600
                        text-white
                        px-5
                        py-3
                        rounded-xl
                    "
                >

                    Retour aux cours

                </button>

            </div>

        );

    }


    // =====================================================
    // CONDITIONS PRIX
    // =====================================================

    const hasPrice =

        course.price !== null &&

        course.price !== undefined;


    const pricePending =

        course.priceStatus ===

        "En attente de validation";


    const priceModificationRequested =

        course.priceStatus ===

        "Modification demandée";


    const priceValidated =

        course.priceStatus ===

        "Validé";


    // =====================================================
    // AFFICHAGE
    // =====================================================

    return (

        <div className="p-8 space-y-8">


            {/* =================================================
                RETOUR
            ================================================= */}

            <button
                onClick={() => navigate(-1)}
                className="
                    inline-flex
                    items-center
                    gap-3
                    bg-white
                    px-5
                    py-3
                    rounded-2xl
                    shadow-sm
                    hover:shadow-lg
                    transition
                    font-semibold
                    text-gray-700
                "
            >

                <FaArrowLeft className="text-purple-600" />

                Retour aux cours

            </button>


            {/* =================================================
                EN-TÊTE
            ================================================= */}

            <div
                className="
                    bg-white
                    rounded-3xl
                    shadow-sm
                    p-8
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        lg:flex-row
                        justify-between
                        gap-8
                    "
                >

                    <div className="flex-1">

                        <p className="text-purple-600 font-semibold">

                            {course.category}

                        </p>


                        <h1
                            className="
                                text-4xl
                                lg:text-5xl
                                font-bold
                                text-gray-800
                                mt-2
                            "
                        >

                            {course.title}

                        </h1>


                        <p
                            className="
                                text-gray-500
                                mt-5
                                leading-8
                            "
                        >

                            {course.description}

                        </p>


                        {/* =====================================
                            ACTIONS GÉNÉRALES
                        ===================================== */}

                        <div
                            className="
                                flex
                                flex-wrap
                                gap-4
                                mt-8
                            "
                        >

                            {/* MODIFIER */}

                            <button
                                onClick={() =>
                                    setShowEditModal(true)
                                }
                                className="
                                    bg-blue-600
                                    hover:bg-blue-700
                                    text-white
                                    px-6
                                    py-3
                                    rounded-xl
                                    font-semibold
                                    transition
                                "
                            >

                                <FaEdit className="inline mr-2" />

                                Modifier

                            </button>


                            {/* =================================
                                PRIX EN ATTENTE
                            ================================= */}

                            {
                                pricePending &&

                                <button
                                    onClick={approvePrice}
                                    disabled={priceActionLoading}
                                    className="
                                        bg-green-600
                                        hover:bg-green-700
                                        disabled:bg-green-300
                                        text-white
                                        px-6
                                        py-3
                                        rounded-xl
                                        font-semibold
                                        transition
                                    "
                                >

                                    <FaCheckCircle
                                        className="inline mr-2"
                                    />

                                    {
                                        priceActionLoading
                                            ? "Traitement..."
                                            : "Accepter le prix et publier"
                                    }

                                </button>
                            }


                            {/* =================================
                                DEMANDER MODIFICATION
                            ================================= */}

                            {
                                pricePending &&

                                <button
                                    onClick={() =>
                                        setShowPriceChangeModal(true)
                                    }
                                    disabled={priceActionLoading}
                                    className="
                                        bg-orange-500
                                        hover:bg-orange-600
                                        text-white
                                        px-6
                                        py-3
                                        rounded-xl
                                        font-semibold
                                        transition
                                    "
                                >

                                    <FaEdit
                                        className="inline mr-2"
                                    />

                                    Demander une modification

                                </button>
                            }


                            {/* =================================
                                COURS PUBLIÉ
                            ================================= */}

                            {
                                course.status === "Publié" &&

                                <button
                                    onClick={suspendCourse}
                                    className="
                                        bg-yellow-500
                                        hover:bg-yellow-600
                                        text-white
                                        px-6
                                        py-3
                                        rounded-xl
                                        font-semibold
                                    "
                                >

                                    ⛔ Suspendre

                                </button>
                            }


                            {/* =================================
                                SUPPRIMER
                            ================================= */}

                            <button
                                onClick={() =>
                                    setShowDeleteModal(true)
                                }
                                className="
                                    bg-red-600
                                    hover:bg-red-700
                                    text-white
                                    px-6
                                    py-3
                                    rounded-xl
                                    font-semibold
                                "
                            >

                                <FaTrash
                                    className="inline mr-2"
                                />

                                Supprimer

                            </button>

                        </div>

                    </div>


                    {/* =========================================
                        BADGE STATUT
                    ========================================= */}

                    <div>

                        <span
                            className={`
                                inline-flex
                                px-5
                                py-3
                                rounded-full
                                font-semibold

                                ${
                                    course.status === "Publié"
                                        ? "bg-green-100 text-green-700"
                                        : course.status === "Suspendu"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-orange-100 text-orange-700"
                                }
                            `}
                        >

                            {course.status}

                        </span>

                    </div>

                </div>

            </div>


            {/* =================================================
                BLOC PRIX
            ================================================= */}

            <div
                className={`
                    rounded-3xl
                    shadow-sm
                    p-8
                    border

                    ${
                        pricePending
                            ? "bg-orange-50 border-orange-200"
                            : priceModificationRequested
                            ? "bg-red-50 border-red-200"
                            : priceValidated
                            ? "bg-green-50 border-green-200"
                            : "bg-white border-gray-100"
                    }
                `}
            >

                <div className="flex flex-col lg:flex-row justify-between gap-6">

                    <div>

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    w-12
                                    h-12
                                    rounded-2xl
                                    bg-white
                                    flex
                                    items-center
                                    justify-center
                                    shadow-sm
                                "
                            >

                                <FaMoneyBillWave
                                    className="
                                        text-purple-600
                                        text-xl
                                    "
                                />

                            </div>


                            <div>

                                <p className="text-gray-500">

                                    Prix de la formation

                                </p>

                                <h2
                                    className="
                                        text-3xl
                                        font-bold
                                        text-gray-800
                                    "
                                >

                                    {
                                        hasPrice
                                            ? `${Number(
                                                course.price
                                            ).toLocaleString(
                                                "fr-FR"
                                            )} FCFA`
                                            : "Prix non défini"
                                    }

                                </h2>

                            </div>

                        </div>


                        {/* =====================================
                            STATUT DU PRIX
                        ===================================== */}

                        <div className="mt-5">

                            {
                                !hasPrice && (

                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            px-4
                                            py-2
                                            rounded-full
                                            bg-gray-200
                                            text-gray-600
                                            text-sm
                                            font-semibold
                                        "
                                    >

                                        <FaExclamationTriangle />

                                        Non défini

                                    </span>

                                )
                            }


                            {
                                pricePending && (

                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            px-4
                                            py-2
                                            rounded-full
                                            bg-orange-200
                                            text-orange-700
                                            text-sm
                                            font-semibold
                                        "
                                    >

                                        <FaClock />

                                        En attente de validation

                                    </span>

                                )
                            }


                            {
                                priceModificationRequested && (

                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            px-4
                                            py-2
                                            rounded-full
                                            bg-red-200
                                            text-red-700
                                            text-sm
                                            font-semibold
                                        "
                                    >

                                        <FaTimesCircle />

                                        Modification demandée

                                    </span>

                                )
                            }


                            {
                                priceValidated && (

                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            px-4
                                            py-2
                                            rounded-full
                                            bg-green-200
                                            text-green-700
                                            text-sm
                                            font-semibold
                                        "
                                    >

                                        <FaCheckCircle />

                                        Prix validé

                                    </span>

                                )
                            }

                        </div>

                    </div>


                    {/* =========================================
                        MESSAGE ADMIN EXISTANT
                    ========================================= */}

                    {
                        course.adminMessage && (

                            <div
                                className="
                                    lg:max-w-xl
                                    bg-white
                                    rounded-2xl
                                    p-5
                                    shadow-sm
                                    border
                                    border-red-100
                                "
                            >

                                <p
                                    className="
                                        text-sm
                                        font-semibold
                                        text-red-600
                                        mb-2
                                    "
                                >

                                    Message envoyé à l'enseignant

                                </p>

                                <p
                                    className="
                                        text-gray-600
                                        leading-7
                                    "
                                >

                                    {course.adminMessage}

                                </p>

                            </div>

                        )
                    }

                </div>

            </div>


            {/* =================================================
                STATISTIQUES
            ================================================= */}

            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-4
                    gap-6
                "
            >

                <div className="bg-white rounded-3xl shadow-sm p-6">

                    <div className="flex items-center gap-3">

                        <FaUsers className="text-blue-600 text-xl" />

                        <p className="text-gray-500">

                            Étudiants

                        </p>

                    </div>

                    <h2 className="text-4xl font-bold mt-3">

                        {course.studentsCount || 0}

                    </h2>

                </div>


                <div className="bg-white rounded-3xl shadow-sm p-6">

                    <div className="flex items-center gap-3">

                        <FaEye className="text-purple-600 text-xl" />

                        <p className="text-gray-500">

                            Vues

                        </p>

                    </div>

                    <h2 className="text-4xl font-bold mt-3">

                        {course.views || 0}

                    </h2>

                </div>


                <div className="bg-white rounded-3xl shadow-sm p-6">

                    <div className="flex items-center gap-3">

                        <FaDownload className="text-red-600 text-xl" />

                        <p className="text-gray-500">

                            Téléchargements

                        </p>

                    </div>

                    <h2 className="text-4xl font-bold mt-3">

                        {course.downloads || 0}

                    </h2>

                </div>


                <div className="bg-white rounded-3xl shadow-sm p-6">

                    <p className="text-gray-500">

                        Enseignant

                    </p>

                    <h2 className="text-xl font-bold mt-3">

                        {course.teacher?.name || "Non renseigné"}

                    </h2>

                    <p className="text-gray-400 text-sm mt-1">

                        {course.teacher?.email || ""}

                    </p>

                </div>

            </div>


            {/* =================================================
                RESSOURCES
            ================================================= */}

            <div className="grid lg:grid-cols-3 gap-6">


                {/* IMAGE */}

                <div className="bg-white rounded-3xl shadow-sm p-6">

                    <h2 className="text-xl font-bold mb-5">

                        Image du cours

                    </h2>

                    {
                        course.thumbnail ?

                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="
                                rounded-2xl
                                w-full
                                h-60
                                object-cover
                            "
                        />

                        :

                        <div
                            className="
                                h-60
                                rounded-2xl
                                bg-gray-100
                                flex
                                items-center
                                justify-center
                                text-gray-400
                            "
                        >

                            <FaBookOpen className="text-5xl" />

                        </div>
                    }

                </div>


                {/* PDF */}

                <div className="bg-white rounded-3xl shadow-sm p-6">

                    <h2 className="text-xl font-bold">

                        Support PDF

                    </h2>

                    <p className="text-gray-500 mt-3">

                        {
                            course.pdf

                                ? "Le cours possède un document PDF."

                                : "Aucun PDF disponible."
                        }

                    </p>

                    {
                        course.pdf && (

                            <a
                                href={course.pdf}
                                target="_blank"
                                rel="noreferrer"
                                className="
                                    inline-block
                                    mt-6
                                    bg-red-600
                                    hover:bg-red-700
                                    text-white
                                    px-5
                                    py-3
                                    rounded-xl
                                "
                            >

                                Ouvrir le PDF

                            </a>

                        )
                    }

                </div>


                {/* VIDÉO */}

                <div className="bg-white rounded-3xl shadow-sm p-6">

                    <h2 className="text-xl font-bold">

                        Vidéo

                    </h2>

                    <p className="text-gray-500 mt-3">

                        {
                            course.video

                                ? "Une vidéo est disponible."

                                : "Aucune vidéo disponible."
                        }

                    </p>

                    {
                        course.video && (

                            <a
                                href={course.video}
                                target="_blank"
                                rel="noreferrer"
                                className="
                                    inline-block
                                    mt-6
                                    bg-purple-600
                                    hover:bg-purple-700
                                    text-white
                                    px-5
                                    py-3
                                    rounded-xl
                                "
                            >

                                Regarder la vidéo

                            </a>

                        )
                    }

                </div>

            </div>


            {/* =================================================
                INFORMATIONS
            ================================================= */}

            <div className="bg-white rounded-3xl shadow-sm p-8">

                <h2 className="text-2xl font-bold mb-8">

                    Informations du cours

                </h2>

                <div className="grid md:grid-cols-2 gap-8">

                    <div>

                        <p className="text-gray-500">

                            Date de création

                        </p>

                        <h3 className="font-semibold mt-2">

                            {
                                course.createdAt

                                    ? new Date(
                                        course.createdAt
                                    ).toLocaleDateString(
                                        "fr-FR"
                                    )

                                    : "Non disponible"
                            }

                        </h3>

                    </div>


                    <div>

                        <p className="text-gray-500">

                            Date de publication

                        </p>

                        <h3 className="font-semibold mt-2">

                            {
                                course.publishedAt

                                    ? new Date(
                                        course.publishedAt
                                    ).toLocaleDateString(
                                        "fr-FR"
                                    )

                                    : "Non publié"
                            }

                        </h3>

                    </div>


                    <div>

                        <p className="text-gray-500">

                            Statut du prix

                        </p>

                        <h3 className="font-semibold mt-2">

                            {course.priceStatus || "Non défini"}

                        </h3>

                    </div>


                    <div>

                        <p className="text-gray-500">

                            Prix proposé

                        </p>

                        <h3 className="font-semibold mt-2">

                            {
                                hasPrice

                                    ? `${Number(
                                        course.price
                                    ).toLocaleString(
                                        "fr-FR"
                                    )} FCFA`

                                    : "Non défini"
                            }

                        </h3>

                    </div>

                </div>

            </div>


            {/* =================================================
                MODAL MODIFICATION COURS
            ================================================= */}

            {
                showEditModal && (

                    <div
                        className="
                            fixed
                            inset-0
                            bg-black/60
                            flex
                            items-center
                            justify-center
                            z-50
                            p-4
                        "
                    >

                        <div
                            className="
                                bg-white
                                rounded-3xl
                                shadow-2xl
                                w-full
                                max-w-3xl
                                p-8
                                max-h-[90vh]
                                overflow-y-auto
                            "
                        >

                            <div
                                className="
                                    flex
                                    justify-between
                                    items-center
                                    mb-8
                                "
                            >

                                <h2 className="text-3xl font-bold">

                                    Modifier le cours

                                </h2>

                                <button
                                    onClick={() =>
                                        setShowEditModal(false)
                                    }
                                    className="
                                        text-3xl
                                        text-gray-400
                                        hover:text-red-500
                                    "
                                >

                                    ×

                                </button>

                            </div>


                            <div className="space-y-6">


                                {/* TITRE */}

                                <div>

                                    <label className="font-semibold">

                                        Titre

                                    </label>

                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({

                                                ...formData,

                                                title: e.target.value

                                            })
                                        }
                                        className="
                                            w-full
                                            mt-2
                                            border
                                            rounded-xl
                                            p-3
                                            outline-none
                                            focus:ring-2
                                            focus:ring-purple-500
                                        "
                                    />

                                </div>


                                {/* DESCRIPTION */}

                                <div>

                                    <label className="font-semibold">

                                        Description

                                    </label>

                                    <textarea
                                        rows="5"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({

                                                ...formData,

                                                description:
                                                    e.target.value

                                            })
                                        }
                                        className="
                                            w-full
                                            mt-2
                                            border
                                            rounded-xl
                                            p-3
                                            outline-none
                                            focus:ring-2
                                            focus:ring-purple-500
                                        "
                                    />

                                </div>


                                {/* CATÉGORIE */}

                                <div>

                                    <label className="font-semibold">

                                        Catégorie

                                    </label>

                                    <select
                                        value={formData.category}
                                        onChange={(e) =>
                                            setFormData({

                                                ...formData,

                                                category:
                                                    e.target.value

                                            })
                                        }
                                        className="
                                            w-full
                                            mt-2
                                            border
                                            rounded-xl
                                            p-3
                                        "
                                    >

                                        <option value="">

                                            Sélectionner une catégorie

                                        </option>

                                        {
                                            categories.map(
                                                (category) => (

                                                    <option
                                                        key={
                                                            category._id
                                                        }
                                                        value={
                                                            category.name
                                                        }
                                                    >

                                                        {category.name}

                                                    </option>

                                                )
                                            )
                                        }

                                    </select>

                                </div>


                                {/* ENSEIGNANT */}

                                <div>

                                    <label className="font-semibold">

                                        Enseignant

                                    </label>

                                    <select
                                        value={formData.teacher}
                                        onChange={(e) =>
                                            setFormData({

                                                ...formData,

                                                teacher:
                                                    e.target.value

                                            })
                                        }
                                        className="
                                            w-full
                                            mt-2
                                            border
                                            rounded-xl
                                            p-3
                                        "
                                    >

                                        <option value="">

                                            Sélectionner un enseignant

                                        </option>

                                        {
                                            teachers.map(
                                                (teacher) => (

                                                    <option
                                                        key={
                                                            teacher._id
                                                        }
                                                        value={
                                                            teacher._id
                                                        }
                                                    >

                                                        {teacher.name}

                                                    </option>

                                                )
                                            )
                                        }

                                    </select>

                                </div>

                            </div>


                            <div
                                className="
                                    flex
                                    justify-end
                                    gap-4
                                    mt-10
                                "
                            >

                                <button
                                    onClick={() =>
                                        setShowEditModal(false)
                                    }
                                    className="
                                        px-6
                                        py-3
                                        rounded-xl
                                        bg-gray-200
                                        hover:bg-gray-300
                                    "
                                >

                                    Annuler

                                </button>


                                <button
                                    onClick={updateCourse}
                                    disabled={saving}
                                    className="
                                        px-6
                                        py-3
                                        rounded-xl
                                        bg-blue-600
                                        hover:bg-blue-700
                                        disabled:bg-blue-300
                                        text-white
                                    "
                                >

                                    {
                                        saving
                                            ? "Enregistrement..."
                                            : "Enregistrer"
                                    }

                                </button>

                            </div>

                        </div>

                    </div>

                )
            }


            {/* =================================================
                MODAL DEMANDE MODIFICATION PRIX
            ================================================= */}

            {
                showPriceChangeModal && (

                    <div
                        className="
                            fixed
                            inset-0
                            bg-black/60
                            flex
                            items-center
                            justify-center
                            z-50
                            p-4
                        "
                    >

                        <div
                            className="
                                bg-white
                                rounded-3xl
                                shadow-2xl
                                w-full
                                max-w-xl
                                p-8
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-4
                                    mb-6
                                "
                            >

                                <div
                                    className="
                                        w-14
                                        h-14
                                        rounded-full
                                        bg-orange-100
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >

                                    <FaEdit
                                        className="
                                            text-orange-500
                                            text-xl
                                        "
                                    />

                                </div>


                                <div>

                                    <h2 className="text-2xl font-bold">

                                        Demander une modification

                                    </h2>

                                    <p className="text-gray-500">

                                        Le prix proposé est :

                                        <strong className="ml-1">

                                            {
                                                hasPrice
                                                    ? `${Number(
                                                        course.price
                                                    ).toLocaleString(
                                                        "fr-FR"
                                                    )} FCFA`
                                                    : "-"
                                            }

                                        </strong>

                                    </p>

                                </div>

                            </div>


                            <div>

                                <label
                                    className="
                                        font-semibold
                                        text-gray-700
                                    "
                                >

                                    Message à l'enseignant

                                </label>

                                <textarea
                                    rows="6"
                                    value={adminMessage}
                                    onChange={(e) =>
                                        setAdminMessage(
                                            e.target.value
                                        )
                                    }
                                    placeholder="
                                        Exemple : Le prix proposé
                                        est trop élevé. Merci de
                                        revoir le tarif de cette
                                        formation.
                                    "
                                    className="
                                        w-full
                                        mt-3
                                        border
                                        border-gray-200
                                        rounded-2xl
                                        p-4
                                        outline-none
                                        resize-none
                                        focus:ring-2
                                        focus:ring-orange-400
                                    "
                                />

                                <p className="text-sm text-gray-400 mt-2">

                                    Ce message sera envoyé à l'enseignant
                                    dans ses notifications et par email.

                                </p>

                            </div>


                            <div
                                className="
                                    flex
                                    justify-end
                                    gap-4
                                    mt-8
                                "
                            >

                                <button
                                    onClick={() => {

                                        setShowPriceChangeModal(false);

                                        setAdminMessage("");

                                    }}
                                    disabled={priceActionLoading}
                                    className="
                                        px-6
                                        py-3
                                        rounded-xl
                                        bg-gray-200
                                        hover:bg-gray-300
                                    "
                                >

                                    Annuler

                                </button>


                                <button
                                    onClick={requestPriceChange}
                                    disabled={
                                        priceActionLoading ||
                                        !adminMessage.trim()
                                    }
                                    className="
                                        px-6
                                        py-3
                                        rounded-xl
                                        bg-orange-500
                                        hover:bg-orange-600
                                        disabled:bg-orange-300
                                        text-white
                                        font-semibold
                                    "
                                >

                                    {
                                        priceActionLoading
                                            ? "Envoi..."
                                            : "Envoyer la demande"
                                    }

                                </button>

                            </div>

                        </div>

                    </div>

                )
            }


            {/* =================================================
                MODAL SUPPRESSION
            ================================================= */}

            {
                showDeleteModal && (

                    <div
                        className="
                            fixed
                            inset-0
                            bg-black/60
                            flex
                            items-center
                            justify-center
                            z-50
                            p-4
                        "
                    >

                        <div
                            className="
                                bg-white
                                rounded-3xl
                                shadow-2xl
                                w-full
                                max-w-md
                                p-8
                            "
                        >

                            <div className="text-center">

                                <div
                                    className="
                                        w-20
                                        h-20
                                        rounded-full
                                        bg-red-100
                                        flex
                                        items-center
                                        justify-center
                                        mx-auto
                                    "
                                >

                                    <FaTrash
                                        className="
                                            text-red-600
                                            text-3xl
                                        "
                                    />

                                </div>


                                <h2
                                    className="
                                        text-2xl
                                        font-bold
                                        mt-6
                                    "
                                >

                                    Supprimer le cours ?

                                </h2>


                                <p
                                    className="
                                        text-gray-500
                                        mt-4
                                        leading-7
                                    "
                                >

                                    Vous êtes sur le point de
                                    supprimer définitivement ce cours.

                                    <br />

                                    Cette action est irréversible.

                                </p>


                                <div
                                    className="
                                        bg-gray-100
                                        rounded-2xl
                                        p-4
                                        mt-6
                                    "
                                >

                                    <p className="font-bold">

                                        {course.title}

                                    </p>

                                    <p className="text-gray-500 mt-1">

                                        {course.teacher?.name}

                                    </p>

                                </div>

                            </div>


                            <div
                                className="
                                    flex
                                    justify-end
                                    gap-4
                                    mt-8
                                "
                            >

                                <button
                                    onClick={() =>
                                        setShowDeleteModal(false)
                                    }
                                    className="
                                        px-6
                                        py-3
                                        rounded-xl
                                        bg-gray-200
                                        hover:bg-gray-300
                                    "
                                >

                                    Annuler

                                </button>


                                <button
                                    onClick={deleteCourse}
                                    className="
                                        px-6
                                        py-3
                                        rounded-xl
                                        bg-red-600
                                        hover:bg-red-700
                                        text-white
                                        font-semibold
                                    "
                                >

                                    Supprimer

                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

        </div>

    );

};

export default CourseDetails;