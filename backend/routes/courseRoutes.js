import express from "express"

import upload from "../middleware/uploadMiddleware.js"
import authMiddleware from "../middleware/authMiddleware.js"
import adminMiddleware from "../middleware/adminMiddleware.js";
import {

  createCourse,
  getCourses,
  getTeacherCourses,
  getCourseStats,
  getCoursesByCategory,
  getCourseById,
  publishCourse,
  suspendCourse,
  updateCourse,
  updateCoursePrice,
  approveCoursePrice,
  requestCoursePriceChange,
  deleteCourse

} from "../controllers/courseController.js"

const router = express.Router()


// =========================
// CREATE COURSE
// =========================

router.post(

  "/create",

  upload.fields([
    { name: "thumbnail" },
    { name: "pdf" },
    { name: "video" }
  ]),

  createCourse

)


// ======================================
// COURS DE L'ENSEIGNANT CONNECTÉ
// ======================================

router.get(

  "/teacher",

  authMiddleware,

  getTeacherCourses

)


// ======================================
// STATISTIQUES
// ======================================

router.get(

  "/stats",

  getCourseStats

)


// ======================================
// COURS PAR CATÉGORIE
// ======================================

router.get(

  "/category/:category",

  getCoursesByCategory

)


// ======================================
// DÉFINIR LE PRIX D'UN COURS
// PATCH /api/courses/:id/price
// ENSEIGNANT UNIQUEMENT
// ======================================

router.patch(

  "/:id/price",

  authMiddleware,

  updateCoursePrice

)


// ======================================
// APPROUVER LE PRIX
// PATCH /api/courses/:id/price/approve
// ADMIN UNIQUEMENT
// ======================================
router.patch(

  "/:id/price/approve",

  authMiddleware,

  adminMiddleware,

  approveCoursePrice

)


// ======================================
// DEMANDER UNE MODIFICATION DU PRIX
// PATCH /api/courses/:id/price/request-change
// ADMIN UNIQUEMENT
// ======================================
router.patch(

  "/:id/price/request-change",

  authMiddleware,

  adminMiddleware,

  requestCoursePriceChange

)


// ======================================
// RÉCUPÉRER UN COURS
// ======================================

router.get(

  "/:id",

  getCourseById

)


// ======================================
// PUBLIER
// ======================================

router.patch(

  "/:id/publish",

  publishCourse

)


// ======================================
// SUSPENDRE
// ======================================

router.patch(

  "/:id/suspend",

  suspendCourse

)


// ======================================
// MODIFIER
// ======================================

router.put(

  "/:id",

  upload.fields([
    { name: "thumbnail" },
    { name: "pdf" },
    { name: "video" }
  ]),

  updateCourse

)


// ======================================
// SUPPRIMER
// ======================================

router.delete(

  "/:id",

  deleteCourse

)


// ======================================
// LISTE DES COURS
// ======================================

router.get(

  "/",

  getCourses

)

export default router