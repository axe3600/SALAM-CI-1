// ======================================
// PAGE PAIEMENT TEST
// ======================================

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaCheckCircle,
    FaCreditCard,
    FaSpinner,
    FaTimesCircle
} from "react-icons/fa";

import API from "../../services/api";


// ======================================
// COMPOSANT
// ======================================

function PaymentTest() {

    const { paymentId } = useParams();

    const navigate = useNavigate();


    // ======================================
    // ETATS
    // ======================================

    const [payment, setPayment] = useState(null);

    const [loading, setLoading] = useState(true);

    const [processing, setProcessing] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState(false);


    // ======================================
    // RECUPERER LE PAIEMENT
    // ======================================

    const getPayment = async () => {

        try {

            setLoading(true);

            setError("");


            const response = await API.get(

                `/payments/${paymentId}`

            );


            console.log(

                "PAIEMENT TEST :",

                response.data

            );


            setPayment(

                response.data?.payment || null

            );

        }

        catch (error) {

            console.error(

                "ERREUR PAIEMENT :",

                error

            );


            setError(

                error.response?.data?.message ||

                "Impossible de charger le paiement."

            );

        }

        finally {

            setLoading(false);

        }

    };


    // ======================================
    // CONFIRMER PAIEMENT TEST
    // ======================================

    const handleTestPayment = async () => {

        try {

            setProcessing(true);

            setError("");


            const response = await API.post(

                `/payments/test/${paymentId}/success`

            );


            console.log(

                "PAIEMENT CONFIRME :",

                response.data

            );


            if (response.data?.success) {

                setSuccess(true);


                // ==================================
                // REDIRECTION
                // ==================================

                setTimeout(() => {

                    navigate(

                        "/student-courses",

                        {
                            replace: true
                        }

                    );

                }, 2000);

            }

            else {

                setError(

                    response.data?.message ||

                    "Le paiement n'a pas pu être confirmé."

                );

            }

        }

        catch (error) {

            console.error(

                "ERREUR CONFIRMATION :",

                error

            );


            setError(

                error.response?.data?.message ||

                "Impossible de confirmer le paiement."

            );

        }

        finally {

            setProcessing(false);

        }

    };


    // ======================================
    // CHARGEMENT
    // ======================================

    useEffect(() => {

        getPayment();

    }, [paymentId]);


    // ======================================
    // LOADING
    // ======================================

    if (loading) {

        return (

            <div className="
                min-h-screen
                bg-gray-50
                flex
                items-center
                justify-center
                p-6
            ">

                <div className="text-center">

                    <FaSpinner
                        className="
                            text-5xl
                            text-purple-600
                            animate-spin
                            mx-auto
                        "
                    />

                    <p className="
                        mt-5
                        text-gray-500
                    ">

                        Chargement du paiement...

                    </p>

                </div>

            </div>

        );

    }


    // ======================================
    // ERREUR
    // ======================================

    if (error && !success) {

        return (

            <div className="
                min-h-screen
                bg-gray-50
                flex
                items-center
                justify-center
                p-6
            ">

                <div className="
                    max-w-lg
                    w-full
                    bg-white
                    rounded-3xl
                    shadow-xl
                    p-10
                    text-center
                ">

                    <FaTimesCircle
                        className="
                            text-6xl
                            text-red-500
                            mx-auto
                        "
                    />

                    <h1 className="
                        text-2xl
                        font-bold
                        text-gray-800
                        mt-6
                    ">

                        Erreur de paiement

                    </h1>


                    <p className="
                        text-gray-500
                        mt-4
                    ">

                        {error}

                    </p>


                    <button
                        onClick={() =>
                            navigate("/catalog")
                        }
                        className="
                            mt-8
                            w-full
                            bg-purple-600
                            hover:bg-purple-700
                            text-white
                            py-4
                            rounded-xl
                            font-semibold
                            transition
                        "
                    >

                        Retour au catalogue

                    </button>

                </div>

            </div>

        );

    }


    // ======================================
    // PAIEMENT REUSSI
    // ======================================

    if (success) {

        return (

            <div className="
                min-h-screen
                bg-gray-50
                flex
                items-center
                justify-center
                p-6
            ">

                <div className="
                    max-w-lg
                    w-full
                    bg-white
                    rounded-3xl
                    shadow-xl
                    p-10
                    text-center
                ">

                    <div className="
                        w-24
                        h-24
                        bg-green-100
                        rounded-full
                        flex
                        items-center
                        justify-center
                        mx-auto
                    ">

                        <FaCheckCircle
                            className="
                                text-6xl
                                text-green-500
                            "
                        />

                    </div>


                    <h1 className="
                        text-3xl
                        font-bold
                        text-gray-800
                        mt-7
                    ">

                        Paiement réussi 🎉

                    </h1>


                    <p className="
                        text-gray-500
                        mt-4
                    ">

                        Votre formation a été ajoutée
                        à votre espace étudiant.

                    </p>


                    <p className="
                        text-sm
                        text-gray-400
                        mt-6
                    ">

                        Redirection vers Mes cours...

                    </p>

                </div>

            </div>

        );

    }


    // ======================================
    // DONNEES COURS
    // ======================================

    const course = payment?.course;

    const courseTitle =
        course?.title ||
        "Formation";


    const amount =
        Number(payment?.amount || 0);


    // ======================================
    // PAGE
    // ======================================

    return (

        <div className="
            min-h-screen
            bg-gray-50
            flex
            items-center
            justify-center
            p-6
        ">

            <div className="
                max-w-xl
                w-full
                bg-white
                rounded-3xl
                shadow-xl
                overflow-hidden
            ">


                {/* HEADER */}

                <div className="
                    bg-gradient-to-r
                    from-purple-600
                    to-indigo-600
                    p-8
                    text-white
                    text-center
                ">

                    <FaCreditCard
                        className="
                            text-5xl
                            mx-auto
                        "
                    />


                    <h1 className="
                        text-3xl
                        font-bold
                        mt-5
                    ">

                        Paiement de la formation

                    </h1>


                    <p className="
                        mt-2
                        text-purple-100
                    ">

                        Mode démonstration SALAM CI

                    </p>

                </div>


                {/* CONTENU */}

                <div className="p-8">


                    {/* MODE TEST */}

                    <div className="
                        bg-yellow-50
                        border
                        border-yellow-200
                        rounded-2xl
                        p-5
                    ">

                        <p className="
                            text-yellow-800
                            font-semibold
                        ">

                            🧪 Paiement en mode TEST

                        </p>


                        <p className="
                            text-yellow-700
                            text-sm
                            mt-2
                        ">

                            Aucun argent réel ne sera débité.
                            Cette page permet de tester le parcours
                            d'achat de SALAM CI.

                        </p>

                    </div>


                    {/* FORMATION */}

                    <div className="mt-7">

                        <p className="
                            text-gray-500
                            text-sm
                        ">

                            Formation

                        </p>


                        <h2 className="
                            text-2xl
                            font-bold
                            text-gray-800
                            mt-1
                        ">

                            {courseTitle}

                        </h2>

                    </div>


                    {/* REFERENCE */}

                    <div className="mt-6">

                        <p className="
                            text-gray-500
                            text-sm
                        ">

                            Référence

                        </p>


                        <p className="
                            font-semibold
                            text-gray-700
                            mt-1
                            break-all
                        ">

                            {payment?.transactionId}

                        </p>

                    </div>


                    {/* MONTANT */}

                    <div className="
                        mt-7
                        bg-purple-50
                        rounded-2xl
                        p-6
                        text-center
                    ">

                        <p className="
                            text-gray-500
                        ">

                            Montant à payer

                        </p>


                        <p className="
                            text-4xl
                            font-bold
                            text-purple-700
                            mt-2
                        ">

                            {amount.toLocaleString("fr-FR")}

                            {" "}

                            FCFA

                        </p>

                    </div>


                    {/* BOUTON */}

                    <button
                        type="button"
                        onClick={handleTestPayment}
                        disabled={processing}
                        className="
                            w-full
                            mt-8
                            bg-gradient-to-r
                            from-purple-600
                            to-indigo-600
                            hover:shadow-xl
                            text-white
                            py-4
                            rounded-xl
                            font-semibold
                            text-lg
                            transition
                            disabled:opacity-60
                            disabled:cursor-not-allowed
                        "
                    >

                        {processing ? (

                            <span className="
                                flex
                                items-center
                                justify-center
                                gap-3
                            ">

                                <FaSpinner
                                    className="
                                        animate-spin
                                    "
                                />

                                Confirmation...

                            </span>

                        ) : (

                            <span className="
                                flex
                                items-center
                                justify-center
                                gap-3
                            ">

                                <FaCheckCircle />

                                Simuler le paiement réussi

                            </span>

                        )}

                    </button>


                    {/* ANNULER */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(-1)
                        }
                        className="
                            w-full
                            mt-4
                            flex
                            items-center
                            justify-center
                            gap-2
                            text-gray-500
                            hover:text-purple-600
                            transition
                        "
                    >

                        <FaArrowLeft />

                        Annuler

                    </button>

                </div>

            </div>

        </div>

    );

}

export default PaymentTest;