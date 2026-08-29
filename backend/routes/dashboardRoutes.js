import express from "express"

import authMiddleware from "../middleware/authMiddleware.js"

import adminMiddleware from "../middleware/adminMiddleware.js"

import maintenanceMiddleware from "../middleware/maintenanceMiddleware.js"

import {
  getDashboardStats
} from "../controllers/dashboardController.js"


const router = express.Router()


// =====================================================
// DASHBOARD ADMINISTRATEUR
// GET /api/dashboard
// =====================================================

router.get(

  "/",

  authMiddleware,

  adminMiddleware,

  maintenanceMiddleware,

  getDashboardStats

)


export default router