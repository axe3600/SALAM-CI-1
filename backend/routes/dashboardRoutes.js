import express from "express"

import authMiddleware from "../middleware/authMiddleware.js"

import adminMiddleware from "../middleware/adminMiddleware.js"

import maintenanceMiddleware from "../middleware/maintenanceMiddleware.js"

import {

  getDashboardStats,

  getTeacherDashboardStats

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


// =====================================================
// DASHBOARD ENSEIGNANT
// GET /api/dashboard/teacher
// =====================================================

router.get(

  "/teacher",

  authMiddleware,

  maintenanceMiddleware,

  getTeacherDashboardStats

)


export default router