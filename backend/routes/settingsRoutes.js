import express from "express"

import {
  getSettings,
  updateSettings,
  changeAdminPassword
} from "../controllers/settingsController.js"

import authMiddleware from "../middleware/authMiddleware.js"
import adminMiddleware from "../middleware/adminMiddleware.js"

const router = express.Router()


// =====================================================
// RÉCUPÉRER LES PARAMÈTRES
// GET /api/settings
// =====================================================

router.get(
  "/",
  getSettings
)


// =====================================================
// MODIFIER LES PARAMÈTRES
// PUT /api/settings
// ADMIN UNIQUEMENT
// =====================================================

router.put(
  "/",
  authMiddleware,
  adminMiddleware,
  updateSettings
)


// =====================================================
// CHANGER MOT DE PASSE ADMIN
// PUT /api/settings/change-password
// ADMIN UNIQUEMENT
// =====================================================

router.put(
  "/change-password",
  authMiddleware,
  adminMiddleware,
  changeAdminPassword
)


export default router