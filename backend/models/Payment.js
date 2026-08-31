import mongoose from "mongoose";

// =====================================================
// MODELE : PAIEMENT D'UNE FORMATION
// =====================================================

const paymentSchema = new mongoose.Schema(

    {

        // =====================================================
        // ETUDIANT
        // =====================================================

        student: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },


        // =====================================================
        // COURS
        // =====================================================

        course: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Course",

            required: true

        },


        // =====================================================
        // MONTANT
        // =====================================================

        amount: {

            type: Number,

            required: true,

            min: 0

        },


        // =====================================================
        // DEVISE
        // =====================================================

        currency: {

            type: String,

            default: "XOF",

            trim: true

        },


        // =====================================================
        // REFERENCE INTERNE SALAM CI
        // =====================================================

        transactionId: {

            type: String,

            required: true,

            unique: true,

            index: true

        },


        // =====================================================
        // REFERENCE DU PRESTATAIRE
        // =====================================================

        providerTransactionId: {

            type: String,

            default: "",

            trim: true

        },


        // =====================================================
        // PRESTATAIRE
        // =====================================================

        provider: {

            type: String,

            enum: [

                "test",

                "cinetpay",

                "paydunya",

                "hub2"

            ],

            default: "test"

        },


        // =====================================================
        // STATUT
        // =====================================================

        status: {

            type: String,

            enum: [

                "pending",

                "success",

                "failed",

                "cancelled"

            ],

            default: "pending"

        },


        // =====================================================
        // DATE DU PAIEMENT
        // =====================================================

        paidAt: {

            type: Date,

            default: null

        },


        // =====================================================
        // INFORMATIONS SUPPLEMENTAIRES
        // =====================================================

        metadata: {

            type: mongoose.Schema.Types.Mixed,

            default: {}

        }

    },

    {

        timestamps: true

    }

);


// =====================================================
// INDEX
// =====================================================

paymentSchema.index({

    student: 1,

    course: 1

});

paymentSchema.index({

    status: 1

});


// =====================================================
// EXPORT
// =====================================================

export default mongoose.model(

    "Payment",

    paymentSchema

);