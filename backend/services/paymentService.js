import crypto from "crypto";

import Payment from "../models/Payment.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

// =====================================================
// SERVICE DES PAIEMENTS
// =====================================================

class PaymentService {


    // =====================================================
    // GENERER UNE REFERENCE
    // =====================================================

    generateTransactionId() {

        const random = crypto
            .randomBytes(6)
            .toString("hex")
            .toUpperCase();

        return `SALAM-TEST-${Date.now()}-${random}`;

    }


    // =====================================================
    // CREER UN PAIEMENT
    // =====================================================

    async createPayment(student, courseId) {

        // =================================================
        // VERIFIER LE COURS
        // =================================================

        const course = await Course.findById(courseId);

        if (!course) {

            throw new Error(
                "Cours introuvable."
            );

        }


        // =================================================
        // VERIFIER DISPONIBILITE
        // =================================================

        if (

            course.status !== "Publié" ||

            course.isActive !== true

        ) {

            throw new Error(
                "Cette formation n'est pas disponible."
            );

        }


        // =================================================
        // VERIFIER SI DEJA INSCRIT
        // =================================================

        const existingEnrollment =
            await Enrollment.findOne({

                student: student._id,

                course: course._id

            });


        if (existingEnrollment) {

            throw new Error(
                "Vous êtes déjà inscrit à cette formation."
            );

        }


        // =================================================
        // VERIFIER LE PRIX
        // =================================================

        const amount = Number(course.price);


        if (

            !Number.isFinite(amount) ||

            amount < 0

        ) {

            throw new Error(
                "Le prix de cette formation est invalide."
            );

        }


        // =================================================
        // FORMATION GRATUITE
        // =================================================

        if (amount === 0) {

            const enrollment =
                await Enrollment.create({

                    student: student._id,

                    course: course._id

                });


            await Course.findByIdAndUpdate(

                course._id,

                {

                    $inc: {

                        studentsCount: 1

                    }

                }

            );


            return {

                success: true,

                free: true,

                message:
                    "Inscription gratuite effectuée avec succès.",

                enrollment

            };

        }


        // =================================================
        // VERIFIER PAIEMENT EN ATTENTE
        // =================================================

        const existingPayment =
            await Payment.findOne({

                student: student._id,

                course: course._id,

                status: "pending"

            });


        if (existingPayment) {

            return {

                success: true,

                test: true,

                payment: existingPayment,

                paymentId:
                    existingPayment._id,

                transactionId:
                    existingPayment.transactionId,

                paymentUrl:
                    `/payment-test/${existingPayment._id}`

            };

        }


        // =================================================
        // GENERER REFERENCE
        // =================================================

        const transactionId =
            this.generateTransactionId();


        // =================================================
        // CREER LE PAIEMENT
        // =================================================

        const payment =
            await Payment.create({

                student: student._id,

                course: course._id,

                amount,

                currency: "XOF",

                transactionId,

                provider: "test",

                status: "pending"

            });


        // =================================================
        // REPONSE MODE TEST
        // =================================================

        return {

            success: true,

            test: true,

            message:
                "Paiement test créé avec succès.",

            payment,

            paymentId:
                payment._id,

            transactionId,

            paymentUrl:
                `/payment-test/${payment._id}`

        };

    }


    // =====================================================
    // RECUPERER UN PAIEMENT
    // =====================================================

    async getPayment(paymentId, student) {

        const payment =
            await Payment.findById(paymentId)

                .populate({

                    path: "course",

                    populate: {

                        path: "teacher",

                        select: "name email"

                    }

                });


        if (!payment) {

            throw new Error(
                "Paiement introuvable."
            );

        }


        // =================================================
        // SECURITE
        // =================================================

        if (

            payment.student.toString() !==

            student._id.toString()

        ) {

            throw new Error(
                "Accès refusé."
            );

        }


        return {

            success: true,

            payment

        };

    }


    // =====================================================
    // SIMULER UN PAIEMENT REUSSI
    // =====================================================

    async simulateSuccess(student, paymentId) {

        // =================================================
        // RECHERCHER LE PAIEMENT
        // =================================================

        const payment =
            await Payment.findById(paymentId);


        if (!payment) {

            throw new Error(
                "Paiement introuvable."
            );

        }


        // =================================================
        // SECURITE
        // =================================================

        if (

            payment.student.toString() !==

            student._id.toString()

        ) {

            throw new Error(
                "Accès refusé."
            );

        }


        // =================================================
        // VERIFIER LE MODE TEST
        // =================================================

        if (payment.provider !== "test") {

            throw new Error(
                "Ce paiement n'est pas un paiement test."
            );

        }


        // =================================================
        // DEJA PAYE
        // =================================================

        if (payment.status === "success") {

            const existingEnrollment =
                await Enrollment.findOne({

                    student: payment.student,

                    course: payment.course

                });


            return {

                success: true,

                alreadyPaid: true,

                message:
                    "Ce paiement est déjà confirmé.",

                payment,

                enrollment:
                    existingEnrollment || null

            };

        }


        // =================================================
        // METTRE LE PAIEMENT EN SUCCESS
        // =================================================

        payment.status = "success";

        payment.paidAt = new Date();


        await payment.save();


        // =================================================
        // VERIFIER INSCRIPTION
        // =================================================

        let enrollment =
            await Enrollment.findOne({

                student: payment.student,

                course: payment.course

            });


        // =================================================
        // CREER INSCRIPTION
        // =================================================

        if (!enrollment) {

            enrollment =
                await Enrollment.create({

                    student: payment.student,

                    course: payment.course,

                    progress: 0,

                    completed: false,

                    certificateIssued: false,

                    status: "active"

                });


            // =================================================
            // AUGMENTER LE NOMBRE D'ETUDIANTS
            // =================================================

            await Course.findByIdAndUpdate(

                payment.course,

                {

                    $inc: {

                        studentsCount: 1

                    }

                }

            );

        }


        // =================================================
        // REPONSE
        // =================================================

        return {

            success: true,

            paid: true,

            enrolled: true,

            message:
                "Paiement confirmé et inscription réussie.",

            payment,

            enrollment

        };

    }

}


export default new PaymentService();