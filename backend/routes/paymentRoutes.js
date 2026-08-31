import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
    createPayment,
    getPayment,
    simulatePaymentSuccess
} from "../controllers/paymentController.js";

const router = express.Router();


// =====================================================
// CREER UN PAIEMENT
// POST /api/payments/create
// =====================================================

router.post(

    "/create",

    authMiddleware,

    createPayment

);


// =====================================================
// SIMULER PAIEMENT REUSSI
// POST /api/payments/test/:paymentId/success
// =====================================================

router.post(

    "/test/:paymentId/success",

    authMiddleware,

    simulatePaymentSuccess

);


// =====================================================
// RECUPERER UN PAIEMENT
// GET /api/payments/:paymentId
// =====================================================

router.get(

    "/:paymentId",

    authMiddleware,

    getPayment

);


export default router;