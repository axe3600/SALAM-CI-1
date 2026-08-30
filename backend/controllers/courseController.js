import Course from "../models/Course.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs/promises";
import User from "../models/User.js";
import notificationService from "../services/notificationService.js";
import emailService from "../services/emailService.js";

// ======================================
// CRÉER UN COURS
// POST /api/courses/create
// ======================================
export const createCourse = async (req, res) => {

  try {

    // =========================
    // DONNÉES REÇUES
    // =========================
    const {

      title,
      description,
      category,
      teacher

    } = req.body

    // =========================
    // FICHIERS UPLOADÉS
    // =========================

    let thumbnail = "";
    if (req.files?.thumbnail?.[0]) {
    
        const filePath = req.files.thumbnail[0].path;
    
        const result = await cloudinary.uploader.upload(
            filePath,
            {
                folder: "salam-ci/courses",
                resource_type: "image"
            }
        );
    
        thumbnail = result.secure_url;
    
        // Supprimer le fichier temporaire local
        await fs.unlink(filePath);
    
    }

    const pdf =

    req.files?.pdf?.[0]?.path.replace(/\\/g, "/") || "";

    const video =

    req.files?.video?.[0]?.path.replace(/\\/g, "/") || "";
    
    // =========================
    // CRÉATION DU COURS
    // =========================
    const course = await Course.create({

      title,

      description,

      category,

      teacher,

      thumbnail,

      pdf,

      video,

      // =========================
      // ÉTAT INITIAL
      // =========================
      status: "En attente",

      isActive: true,

      studentsCount: 0,

      views: 0,

      downloads: 0,

      publishedAt: null

    })

    // =========================
    // RÉPONSE
    // =========================
    res.status(201).json({

      message: "Cours créé avec succès.",

      course

    })

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}


// ======================================
// RÉCUPÉRER LES COURS
// AVEC PAGINATION
// GET /api/courses?page=1&limit=10
// ======================================
export const getCourses = async (req, res) => {

  try {

    // =========================
    // PARAMÈTRES DE PAGINATION
    // =========================
    const page = parseInt(req.query.page) || 1

    const limit = parseInt(req.query.limit) || 10

    // =========================
    // CALCUL DU SKIP
    // =========================
    const skip = (page - 1) * limit

    // =========================
    // NOMBRE TOTAL DE COURS
    // =========================
    const totalCourses = await Course.countDocuments()

    // =========================
    // NOMBRE TOTAL DE PAGES
    // =========================
    const totalPages = Math.ceil(

      totalCourses / limit

    )

    // =========================
    // RÉCUPÉRATION DES COURS
    // =========================
    const courses = await Course.find()
   
      // Nom et email de l'enseignant
      .populate(
        "teacher",
        "name email"
      )

      .populate(
        "category",
        "name"
      )

      // Plus récent en premier
      .sort({
        createdAt: -1
      })

      .skip(skip)
      .limit(limit)

    // =========================
    // RÉPONSE
    // =========================
    res.status(200).json({

      courses,

      currentPage: page,

      totalPages,

      totalCourses,

      limit

    })

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}


// =====================================================
// COURS DE L'ENSEIGNANT CONNECTE
// GET /api/courses/teacher
// =====================================================

export const getTeacherCourses = async (req, res) => {

  try {

      const courses = await Course.find({

          teacher: req.user.id

      })

      .populate(

          "category",

          "name"

      )

      .sort({

          createdAt: -1

      });

      res.status(200).json({

          success: true,

          courses

      });

  }

  catch (error) {

      console.log(error);

      res.status(500).json({

          success: false,

          message: error.message

      });

  }

};

// ======================================
// RÉCUPÉRER LES STATISTIQUES
// GET /api/courses/stats
// ======================================
export const getCourseStats = async (req, res) => {

  try {

      // =========================
      // NOMBRE DE COURS
      // =========================

      const totalCourses = await Course.countDocuments();

      const publishedCourses = await Course.countDocuments({
          status: "Publié"
      });

      const draftCourses = await Course.countDocuments({
          status: "En attente"
      });

      const suspendedCourses = await Course.countDocuments({
          status: "Suspendu"
      });

      // =========================
      // SOMME DES STATISTIQUES
      // =========================

      const stats = await Course.aggregate([

          {

              $group: {

                  _id: null,

                  totalStudents: {
                      $sum: "$studentsCount"
                  },

                  totalViews: {
                      $sum: "$views"
                  },

                  totalDownloads: {
                      $sum: "$downloads"
                  }

              }

          }

      ]);

      res.json({

          totalCourses,

          publishedCourses,

          draftCourses,

          suspendedCourses,

          totalStudents: stats[0]?.totalStudents || 0,

          totalViews: stats[0]?.totalViews || 0,

          totalDownloads: stats[0]?.totalDownloads || 0

      });

  }

  catch (error) {

      console.log(error);

      res.status(500).json({

          message: error.message

      });

  }

};


// =========================
// COURS D'UNE CATEGORIE
// =========================

export const getCoursesByCategory = async (req, res) => {

  console.log("Reçu :", JSON.stringify(req.params.category))

  const allCourses = await Course.find()

  allCourses.forEach(course => {
      console.log("Mongo :", JSON.stringify(course.category))
  })

  const courses = await Course.find({
      category: req.params.category
  })

  console.log("Trouvés :", courses.length)

  res.json(courses)
}


// ======================================
// RÉCUPÉRER UN COURS
// GET /api/courses/:id
// ======================================
export const getCourseById = async (req, res) => {

  try {

    // =========================
    // ID DU COURS
    // =========================
    const { id } = req.params

    // =========================
    // RECHERCHE DU COURS
    // =========================
    const course = await Course.findById(id)

      .populate(

        "teacher",

        "name email role"

      )

    // =========================
    // COURS INTROUVABLE
    // =========================
    if (!course) {

      return res.status(404).json({

        message: "Cours introuvable."

      })

    }

    // =========================
    // RÉPONSE
    // =========================
    res.status(200).json(course)

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}

// ======================================
// PUBLIER UN COURS
// PATCH /api/courses/:id/publish
// ======================================
export const publishCourse = async (req, res) => {

  try {

    const { id } = req.params

    const course = await Course.findById(id)

    if (!course) {

      return res.status(404).json({

        message: "Cours introuvable."

      })

    }

    if (course.status === "Publié") {

      return res.status(400).json({

        message: "Ce cours est déjà publié."

      })

    }

    course.status = "Publié"

    course.isActive = true

    course.publishedAt = new Date()

    await course.save()

    res.status(200).json({

      message: "Cours publié avec succès.",

      course

    })

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}

// ======================================
// SUSPENDRE UN COURS
// PATCH /api/courses/:id/suspend
// ======================================
export const suspendCourse = async (req, res) => {

  try {

    const { id } = req.params

    const course = await Course.findById(id)

    if (!course) {

      return res.status(404).json({

        message: "Cours introuvable."

      })

    }

    if (course.status === "Suspendu") {

      return res.status(400).json({

        message: "Ce cours est déjà suspendu."

      })

    }

    course.status = "Suspendu"

    course.isActive = false

    await course.save()

    res.status(200).json({

      message: "Cours suspendu avec succès.",

      course

    })

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}


// ======================================
// MODIFIER UN COURS
// PUT /api/courses/:id
// ======================================
export const updateCourse = async (req, res) => {

  try {

    const { id } = req.params

    const {

      title,

      description,

      category,

      teacher

    } = req.body

    const course = await Course.findById(id)

    if (!course) {

      return res.status(404).json({

        message: "Cours introuvable."

      })

    }

    // =========================
    // MISE À JOUR DES CHAMPS
    // =========================

    course.title = title

    course.description = description

    course.category = category

    course.teacher = teacher

    // =========================
    // FICHIERS (si envoyés)
    // =========================

    if (req.files?.thumbnail?.[0]) {

      course.thumbnail = req.files.thumbnail[0].path

    }

    if (req.files?.pdf?.[0]) {

      course.pdf = req.files.pdf[0].path

    }

    if (req.files?.video?.[0]) {

      course.video = req.files.video[0].path

    }

    await course.save()

    res.status(200).json({

      message: "Cours modifié avec succès.",

      course

    })

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}


// ======================================
// SUPPRIMER UN COURS
// DELETE /api/courses/:id
// ======================================
export const deleteCourse = async (req, res) => {

  try {

    const { id } = req.params

    const course = await Course.findById(id)

    if (!course) {

      return res.status(404).json({

        message: "Cours introuvable."

      })

    }

    await course.deleteOne()

    res.status(200).json({

      message: "Cours supprimé avec succès."

    })

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}

// ======================================
// DÉFINIR LE PRIX D'UN COURS
// PATCH /api/courses/:id/price
// ENSEIGNANT UNIQUEMENT
// ======================================
export const updateCoursePrice = async (req, res) => {

  try {

    const { id } = req.params

    const { price } = req.body

    // =========================
    // VÉRIFICATION DU PRIX
    // =========================

    if (
      price === undefined ||
      price === null ||
      price === ""
    ) {

      return res.status(400).json({

        success: false,

        message: "Veuillez renseigner le prix de la formation."

      })

    }

    const numericPrice = Number(price)

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {

      return res.status(400).json({

        success: false,

        message: "Le prix doit être un montant valide."

      })

    }

    // =========================
    // RÉCUPÉRER LE COURS
    // =========================

    const course = await Course.findById(id)

    if (!course) {

      return res.status(404).json({

        success: false,

        message: "Cours introuvable."

      })

    }

    // =========================
    // VÉRIFIER L'ENSEIGNANT
    // =========================

    if (
      course.teacher.toString() !==
      req.user._id.toString()
    ) {

      return res.status(403).json({

        success: false,

        message:
          "Vous n'êtes pas autorisé à modifier le prix de ce cours."

      })

    }

    // =========================
    // VÉRIFIER LE STATUT DU COURS
    // =========================

    if (course.status !== "En attente") {

      return res.status(400).json({

        success: false,

        message:
          "Le prix ne peut être défini que pour un cours en attente."

      })

    }

    // =========================
    // VÉRIFIER LE STATUT DU PRIX
    // =========================

    if (
      course.priceStatus ===
      "En attente de validation"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Le prix de ce cours est déjà en attente de validation."

      })

    }

    // =========================
    // ENREGISTRER LE PRIX
    // =========================

    course.price = numericPrice

    course.priceStatus =
      "En attente de validation"

    // Effacer l'ancien message admin
    // après une nouvelle soumission

    course.adminMessage = ""

    await course.save()

    // =========================
    // RÉPONSE
    // =========================

    return res.status(200).json({

      success: true,

      message:
        "Prix enregistré et envoyé pour validation.",

      course

    })

  }

  catch (error) {

    console.error(
      "ERREUR DÉFINITION PRIX :",
      error
    )

    return res.status(500).json({

      success: false,

      message:
        "Impossible d'enregistrer le prix de la formation."

    })

  }

}


// ======================================
// APPROUVER LE PRIX D'UN COURS
// PATCH /api/courses/:id/price/approve
// ADMIN UNIQUEMENT
// ======================================
export const approveCoursePrice = async (req, res) => {

  try {

    const { id } = req.params

    // =========================
    // RÉCUPÉRER LE COURS
    // =========================

    const course = await Course.findById(id)
      .populate(
        "teacher",
        "name email"
      )

    if (!course) {

      return res.status(404).json({

        success: false,

        message: "Cours introuvable."

      })

    }

    // =========================
    // VÉRIFICATION DU PRIX
    // =========================

    if (
      course.price === null ||
      course.price === undefined
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Ce cours ne possède pas encore de prix."

      })

    }

    // =========================
    // VÉRIFICATION DU STATUT
    // =========================

    if (
      course.priceStatus !==
      "En attente de validation"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Ce prix n'est pas en attente de validation."

      })

    }

    // =========================
    // VALIDATION
    // =========================

    course.priceStatus = "Validé"

    course.status = "Publié"

    course.isActive = true

    course.publishedAt = new Date()

    course.adminMessage = ""

    await course.save()

    // =========================
    // NOTIFICATION PROFESSEUR
    // =========================

    try {

      await notificationService.create({

        recipient: course.teacher._id,

        sender: req.user._id,

        title: "Cours approuvé",

        message:
          `Votre cours « ${course.title} » a été approuvé et publié au prix de ${course.price.toLocaleString("fr-FR")} FCFA.`,

        type: "course",

        entityType: "course",

        entityId: course._id

      })

    }

    catch (notificationError) {

      console.error(
        "Erreur notification approbation cours :",
        notificationError.message
      )

    }

    // =========================
    // EMAIL PROFESSEUR
    // =========================

    try {

      await emailService.sendMail({

        to: course.teacher.email,

        subject:
          "Votre formation a été approuvée - SALAM CI",

        html: `

          <h2>Votre formation a été approuvée 🎉</h2>

          <p>
            Bonjour ${course.teacher.name},
          </p>

          <p>
            Nous avons le plaisir de vous informer que votre
            formation <strong>« ${course.title} »</strong>
            a été approuvée par l'administration de SALAM CI.
          </p>

          <p>
            <strong>Prix validé :</strong>
            ${course.price.toLocaleString("fr-FR")} FCFA
          </p>

          <p>
            Votre formation est maintenant
            <strong>publiée sur la plateforme</strong>.
          </p>

          <p>
            Merci pour votre contribution à SALAM CI.
          </p>

        `

      })

    }

    catch (emailError) {

      console.error(
        "Erreur email approbation cours :",
        emailError.message
      )

    }

    // =========================
    // RÉPONSE
    // =========================

    return res.status(200).json({

      success: true,

      message:
        "Prix validé et cours publié avec succès.",

      course

    })

  }

  catch (error) {

    console.error(
      "ERREUR APPROBATION PRIX :",
      error
    )

    return res.status(500).json({

      success: false,

      message:
        "Impossible de valider le prix du cours."

    })

  }

}


// ======================================
// DEMANDER UNE MODIFICATION DU PRIX
// PATCH /api/courses/:id/price/request-change
// ADMIN UNIQUEMENT
// ======================================
export const requestCoursePriceChange = async (req, res) => {

  try {

    const { id } = req.params

    const { message } = req.body

    // =========================
    // MESSAGE OBLIGATOIRE
    // =========================

    if (
      !message ||
      !message.trim()
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Veuillez saisir un message pour l'enseignant."

      })

    }

    // =========================
    // RÉCUPÉRER LE COURS
    // =========================

    const course = await Course.findById(id)
      .populate(
        "teacher",
        "name email"
      )

    if (!course) {

      return res.status(404).json({

        success: false,

        message:
          "Cours introuvable."

      })

    }

    // =========================
    // VÉRIFICATION DU PRIX
    // =========================

    if (
      course.price === null ||
      course.price === undefined
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Ce cours ne possède pas encore de prix."

      })

    }

    // =========================
    // VÉRIFICATION DU STATUT
    // =========================

    if (
      course.priceStatus !==
      "En attente de validation"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Ce prix n'est pas en attente de validation."

      })

    }

    // =========================
    // DEMANDE DE MODIFICATION
    // =========================

    course.priceStatus =
      "Modification demandée"

    course.status =
      "En attente"

    course.adminMessage =
      message.trim()

    course.isActive = true

    course.publishedAt = null

    await course.save()

    // =========================
    // NOTIFICATION PROFESSEUR
    // =========================

    try {

      await notificationService.create({

        recipient: course.teacher._id,

        sender: req.user._id,

        title:
          "Modification du prix demandée",

        message:
          `L'administration demande une modification du prix de votre cours « ${course.title} ». Consultez le message de l'administration.`,

        type: "course",

        entityType: "course",

        entityId: course._id

      })

    }

    catch (notificationError) {

      console.error(
        "Erreur notification modification prix :",
        notificationError.message
      )

    }

    // =========================
    // EMAIL PROFESSEUR
    // =========================

    try {

      await emailService.sendMail({

        to: course.teacher.email,

        subject:
          "Modification du prix demandée - SALAM CI",

        html: `

          <h2>Modification du prix demandée</h2>

          <p>
            Bonjour ${course.teacher.name},
          </p>

          <p>
            L'administration de SALAM CI a examiné
            votre formation
            <strong>« ${course.title} »</strong>.
          </p>

          <p>
            Le prix proposé de
            <strong>
              ${course.price.toLocaleString("fr-FR")} FCFA
            </strong>
            nécessite une modification.
          </p>

          <p>
            <strong>Message de l'administration :</strong>
          </p>

          <div
            style="
              background:#f5f5f5;
              padding:20px;
              border-radius:10px;
              margin:15px 0;
            "
          >
            ${course.adminMessage}
          </div>

          <p>
            Connectez-vous à votre espace enseignant afin
            de modifier le prix et de le soumettre à nouveau
            pour validation.
          </p>

        `

      })

    }

    catch (emailError) {

      console.error(
        "Erreur email modification prix :",
        emailError.message
      )

    }

    // =========================
    // RÉPONSE
    // =========================

    return res.status(200).json({

      success: true,

      message:
        "Demande de modification envoyée à l'enseignant.",

      course

    })

  }

  catch (error) {

    console.error(
      "ERREUR DEMANDE MODIFICATION PRIX :",
      error
    )

    return res.status(500).json({

      success: false,

      message:
        "Impossible d'envoyer la demande de modification."

    })

  }

}