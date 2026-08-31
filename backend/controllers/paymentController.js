import Payment from "../models/Payment.js";
import paymentService from "../services/paymentService.js";
import User from "../models/User.js";

// =====================================================
// INITIALISER UN PAIEMENT
// POST /api/payments/create
// =====================================================

export const createPayment = async (req, res) => {

    try {

        const { courseId } = req.body;


        // =================================================
        // VERIFIER COURSE ID
        // =================================================

        if (!courseId) {

            return res.status(400).json({

                success: false,

                message:
                    "L'identifiant du cours est obligatoire."

            });

        }


        // =================================================
        // VERIFIER ETUDIANT
        // =================================================

        const student =
            await User.findById(req.user._id);


        if (!student) {

            return res.status(404).json({

                success: false,

                message:
                    "Étudiant introuvable."

            });

        }


        // =================================================
        // CREER PAIEMENT
        // =================================================

        const result =
            await paymentService.createPayment(

                student,

                courseId

            );


        return res.status(

            result.free ? 201 : 201

        ).json(result);

    }

    catch (error) {

        console.error(

            "ERREUR CREATION PAIEMENT :",

            error

        );


        return res.status(400).json({

            success: false,

            message:
                error.message ||
                "Impossible de créer le paiement."

        });

    }

};


// =====================================================
// RECUPERER UN PAIEMENT
// GET /api/payments/:paymentId
// =====================================================

export const getPayment = async (req, res) => {

    try {

        const { paymentId } = req.params;


        if (!paymentId) {

            return res.status(400).json({

                success: false,

                message:
                    "Identifiant du paiement manquant."

            });

        }


        const student =
            await User.findById(req.user._id);


        if (!student) {

            return res.status(404).json({

                success: false,

                message:
                    "Étudiant introuvable."

            });

        }


        const result =
            await paymentService.getPayment(

                paymentId,

                student

            );


        return res.status(200).json(result);

    }

    catch (error) {

        console.error(

            "ERREUR RECUPERATION PAIEMENT :",

            error

        );


        return res.status(404).json({

            success: false,

            message:
                error.message ||
                "Paiement introuvable."

        });

    }

};


// =====================================================
// SIMULER UN PAIEMENT REUSSI
// POST /api/payments/test/:paymentId/success
// =====================================================

export const simulatePaymentSuccess = async (
    req,
    res
) => {

    try {

        const { paymentId } = req.params;


        if (!paymentId) {

            return res.status(400).json({

                success: false,

                message:
                    "Identifiant du paiement manquant."

            });

        }


        // =================================================
        // MODE TEST
        // =================================================

        if (
            process.env.PAYMENT_MODE !== "test"
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Le mode paiement test est désactivé."

            });

        }


        // =================================================
        // ETUDIANT
        // =================================================

        const student =
            await User.findById(req.user._id);


        if (!student) {

            return res.status(404).json({

                success: false,

                message:
                    "Étudiant introuvable."

            });

        }


        // =================================================
        // CONFIRMER PAIEMENT
        // =================================================

        const result =
            await paymentService.simulateSuccess(

                student,

                paymentId

            );


        return res.status(200).json(result);

    }

    catch (error) {

        console.error(

            "ERREUR PAIEMENT TEST :",

            error

        );


        return res.status(400).json({

            success: false,

            message:
                error.message ||
                "Impossible de confirmer le paiement."

        });

    }

};


export default {

    createPayment,

    getPayment,

    simulatePaymentSuccess

};