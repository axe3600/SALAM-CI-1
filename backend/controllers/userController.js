import User from "../models/User.js"
import bcrypt from "bcryptjs"
import fs from "fs"
import path from "path"

// ======================================
// CRÉER UN UTILISATEUR
// POST /api/users
// RÉSERVÉ AUX ADMINISTRATEURS
// ======================================
export const createUser = async (req, res) => {

  try {

    // =========================
    // DONNÉES REÇUES
    // =========================

    const {
      name,
      email,
      password,
      role
    } = req.body


    // =========================
    // VÉRIFICATION DES CHAMPS
    // =========================

    if (
      !name ||
      !email ||
      !password ||
      !role
    ) {

      return res.status(400).json({

        message:
          "Tous les champs sont obligatoires."

      })

    }


    // =========================
    // VÉRIFICATION DU RÔLE
    // =========================

    const allowedRoles = [

      "student",
      "teacher",
      "admin"

    ]

    if (!allowedRoles.includes(role)) {

      return res.status(400).json({

        message:
          "Rôle utilisateur invalide."

      })

    }


    // =========================
    // VÉRIFICATION EMAIL
    // =========================

    const normalizedEmail =
      email.trim().toLowerCase()


    const existingUser =
      await User.findOne({

        email: normalizedEmail

      })


    if (existingUser) {

      return res.status(400).json({

        message:
          "Cet email est déjà utilisé."

      })

    }


    // =========================
    // VÉRIFICATION MOT DE PASSE
    // =========================

    if (password.length < 6) {

      return res.status(400).json({

        message:
          "Le mot de passe doit contenir au moins 6 caractères."

      })

    }


    // =========================
    // HASH MOT DE PASSE
    // =========================

    const hashedPassword =
      await bcrypt.hash(password, 10)


    // =========================
    // CRÉATION UTILISATEUR
    // =========================

    const user = await User.create({

      name: name.trim(),

      email: normalizedEmail,

      password: hashedPassword,

      role,

      isOnline: false,

      isActive: true,

      sessionVersion: 0,

      twoFactorEnabled: false,

      twoFactorSecret: null

    })


    // =========================
    // UTILISATEUR SÉCURISÉ
    // =========================

    const safeUser =
      user.toObject()

    delete safeUser.password
    delete safeUser.twoFactorSecret


    // =========================
    // RÉPONSE
    // =========================

    return res.status(201).json({

      success: true,

      message:
        "Utilisateur créé avec succès.",

      user: safeUser

    })

  }

  catch (error) {

    console.error(
      "ERREUR CRÉATION UTILISATEUR :",
      error
    )

    return res.status(500).json({

      message:
        "Impossible de créer l'utilisateur."

    })

  }

}


// ======================================
// RÉCUPÉRER LES UTILISATEURS
// AVEC PAGINATION
// GET /api/users?page=1&limit=10
// ======================================
export const getUsers = async (req, res) => {

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
    // NOMBRE TOTAL
    // D'UTILISATEURS
    // =========================
    const totalUsers = await User.countDocuments()

    // =========================
    // NOMBRE TOTAL DE PAGES
    // =========================
    const totalPages = Math.ceil(

      totalUsers / limit

    )

    // =========================
    // UTILISATEURS DE LA PAGE
    // =========================
    const users = await User.find()

      .select("-password")

      .sort({

        createdAt: -1

      })

      .skip(skip)

      .limit(limit)

    // =========================
    // RÉPONSE
    // =========================
    res.status(200).json({

      users,

      currentPage: page,

      totalPages,

      totalUsers,

      limit

    })

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}


// ======================================
// RÉCUPÉRER LES ENSEIGNANTS
// GET /api/users/teachers
// ======================================
export const getTeachers = async (req, res) => {

  try {

    const teachers = await User.find({

      role: "teacher",

      isActive: true

    })

      .select("_id name")

      .sort({

        name: 1

      })

    res.status(200).json(teachers)

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}

// ======================================
// RÉCUPÉRER LES STATISTIQUES
// GET /api/users/stats
// ======================================
export const getUserStats = async (req, res) => {

  try {

    const total = await User.countDocuments()

    const students = await User.countDocuments({

      role: "student"

    })

    const teachers = await User.countDocuments({

      role: "teacher"

    })

    const admins = await User.countDocuments({

      role: "admin"

    })

    res.status(200).json({

      total,
      students,
      teachers,
      admins

    })

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}

// ======================================
// RÉCUPÉRER UN UTILISATEUR
// GET /api/users/:id
// ======================================
export const getUserById = async (req, res) => {

  try {

    const user = await User.findById(req.params.id)

      .select("-password")

    if (!user) {

      return res.status(404).json({

        message: "Utilisateur introuvable"

      })

    }

    res.status(200).json(user)

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    })

  }

}

// ======================================
// MODIFIER UN UTILISATEUR
// PUT /api/users/:id
// ======================================
export const updateUser = async (req, res) => {

  try {

    // =========================
    // ID UTILISATEUR
    // =========================
    const { id } = req.params

    // =========================
    // DONNÉES REÇUES
    // =========================
    const {
      name,
      email,
      role
    } = req.body

    // =========================
    // RECHERCHE UTILISATEUR
    // =========================
    const user = await User.findById(id)

    if (!user) {

      return res.status(404).json({

        message: "Utilisateur introuvable."

      })

    }

    // =========================
    // NORMALISATION EMAIL
    // =========================
    const normalizedEmail =
      email.trim().toLowerCase()

    // =========================
    // VÉRIFICATION EMAIL
    // =========================
    const emailExists = await User.findOne({

      email: normalizedEmail,

      _id: { $ne: id }

    })

    if (emailExists) {

      return res.status(400).json({

        message: "Cet email est déjà utilisé."

      })

    }

    // =========================
    // VÉRIFICATION DU RÔLE
    // =========================
    const allowedRoles = [

      "student",
      "teacher",
      "admin"

    ]

    if (!allowedRoles.includes(role)) {

      return res.status(400).json({

        message: "Rôle utilisateur invalide."

      })

    }

  // =========================
// ANCIEN RÔLE
// =========================
const oldRole = user.role

// =========================
// EMPÊCHER LA MODIFICATION
// DU DERNIER ADMIN
// =========================
if (
  oldRole === "admin" &&
  role !== "admin"
) {

  const adminCount = await User.countDocuments({
    role: "admin"
  })

  if (adminCount <= 1) {

    return res.status(400).json({

      message:
        "Impossible de retirer le rôle du dernier administrateur."

    })

  }

}

// =========================
// MISE À JOUR
// =========================
user.name = name.trim()
user.email = normalizedEmail

user.role = role

    // =========================
    // SI LE RÔLE CHANGE
    // =========================
    if (oldRole !== role) {

      // Déconnexion immédiate
      user.isOnline = false

      // Invalidation anciens JWT
      user.sessionVersion += 1

    }

    // =========================
    // SAUVEGARDE
    // =========================
    await user.save()

    // =========================
    // UTILISATEUR SÉCURISÉ
    // =========================
    const safeUser =
      user.toObject()

    delete safeUser.password
    delete safeUser.twoFactorSecret

    // =========================
    // RÉPONSE
    // =========================
    return res.status(200).json({

      success: true,

      message:
        "Utilisateur modifié avec succès.",

      user: safeUser

    })

  }

  catch (error) {

    console.error(
      "ERREUR MODIFICATION UTILISATEUR :",
      error
    )

    return res.status(500).json({

      message:
        "Impossible de modifier l'utilisateur."

    })

  }

}


// ======================================
// SUPPRIMER UN UTILISATEUR
// DELETE /api/users/:id
// ======================================
export const deleteUser = async (req, res) => {

  try {

    // =========================
    // ID UTILISATEUR
    // =========================
    const { id } = req.params

    // =========================
    // RECHERCHE UTILISATEUR
    // =========================
    const user = await User.findById(id)

    if (!user) {

      return res.status(404).json({

        message: "Utilisateur introuvable."

      })

    }

    // =========================
    // EMPÊCHER AUTO-SUPPRESSION
    // =========================
    if (
      req.user._id.toString() === id
    ) {

      return res.status(400).json({

        message:
          "Vous ne pouvez pas supprimer votre propre compte."

      })

    }

    // =========================
    // PROTECTION DU DERNIER ADMIN
    // =========================
    if (user.role === "admin") {

      const adminCount =
        await User.countDocuments({
          role: "admin"
        })

      if (adminCount <= 1) {

        return res.status(400).json({

          message:
            "Impossible de supprimer le dernier administrateur."

        })

      }

    }

    // =========================
    // SUPPRESSION
    // =========================
    await user.deleteOne()

    // =========================
    // RÉPONSE
    // =========================
    return res.status(200).json({

      success: true,

      message:
        "Utilisateur supprimé avec succès."

    })

  }

  catch (error) {

    console.error(
      "ERREUR SUPPRESSION UTILISATEUR :",
      error
    )

    return res.status(500).json({

      message:
        "Impossible de supprimer cet utilisateur."

    })

  }

}


// ======================================
// ACTIVER / DÉSACTIVER UN UTILISATEUR
// PATCH /api/users/:id/status
// ======================================
export const toggleUserStatus = async (req, res) => {

  try {

    // =========================
    // ID UTILISATEUR
    // =========================
    const { id } = req.params

    // =========================
    // RECHERCHE UTILISATEUR
    // =========================
    const user = await User.findById(id)

    if (!user) {

      return res.status(404).json({

        message:
          "Utilisateur introuvable."

      })

    }

    // =========================
    // EMPÊCHER AUTO-DÉSACTIVATION
    // =========================
    if (
      req.user._id.toString() === id
    ) {

      return res.status(400).json({

        message:
          "Vous ne pouvez pas modifier le statut de votre propre compte."

      })

    }

    // =====================================================
    // PROTECTION DU DERNIER ADMIN
    // =====================================================
    if (
      user.role === "admin" &&
      user.isActive === true
    ) {

      const activeAdminCount =
        await User.countDocuments({

          role: "admin",

          isActive: true

        })

      if (activeAdminCount <= 1) {

        return res.status(400).json({

          message:
            "Impossible de désactiver le dernier administrateur actif."

        })

      }

    }

    // =========================
    // CHANGEMENT STATUT
    // =========================
    user.isActive = !user.isActive

    // =========================
    // SI DÉSACTIVATION
    // =========================
    if (!user.isActive) {

      user.isOnline = false

      user.sessionVersion += 1

    }

    // =========================
    // SAUVEGARDE
    // =========================
    await user.save()

    // =========================
    // MESSAGE
    // =========================
    const message =

      user.isActive

        ? "Utilisateur activé avec succès."

        : "Utilisateur désactivé avec succès."

    // =========================
    // UTILISATEUR SÉCURISÉ
    // =========================
    const safeUser =
      user.toObject()

    delete safeUser.password
    delete safeUser.twoFactorSecret

    // =========================
    // RÉPONSE
    // =========================
    return res.status(200).json({

      success: true,

      message,

      user: safeUser

    })

  }

  catch (error) {

    console.error(
      "ERREUR CHANGEMENT STATUT :",
      error
    )

    return res.status(500).json({

      message:
        "Impossible de modifier le statut."

    })

  }

}


// ======================================
// MODIFIER SON PROPRE PROFIL
// PUT /api/users/profile
// UTILISATEUR AUTHENTIFIÉ
// ======================================
export const updateOwnProfile = async (req, res) => {

  try {

    // =========================
    // UTILISATEUR CONNECTÉ
    // =========================

    const user = await User.findById(req.user._id)

    if (!user) {

      return res.status(404).json({

        success: false,

        message:
          "Utilisateur introuvable."

      })

    }

    // =========================
    // DONNÉES
    // =========================

    const {
      name,
      email
    } = req.body

    // =========================
    // NOM
    // =========================

    if (name !== undefined) {

      const cleanName =
        name.trim()

      if (!cleanName) {

        return res.status(400).json({

          success: false,

          message:
            "Le nom ne peut pas être vide."

        })

      }

      user.name = cleanName

    }

    // =========================
    // EMAIL
    // =========================

    if (email !== undefined) {

      const normalizedEmail =
        email.trim().toLowerCase()

      if (!normalizedEmail) {

        return res.status(400).json({

          success: false,

          message:
            "L'email ne peut pas être vide."

        })

      }

      // Vérifier si l'email appartient
      // déjà à quelqu'un d'autre

      const emailExists =
        await User.findOne({

          email: normalizedEmail,

          _id: {
            $ne: user._id
          }

        })

      if (emailExists) {

        return res.status(400).json({

          success: false,

          message:
            "Cet email est déjà utilisé."

        })

      }

      user.email =
        normalizedEmail

    }

    // =========================
    // PHOTO DE PROFIL
    // =========================

    if (req.file) {

      // Ancienne photo

      const oldImage =
        user.profileImage

      // Nouvelle URL

      const imageUrl =
        `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`

      user.profileImage =
        imageUrl

      // Supprimer ancienne photo
      // si elle appartient à notre dossier uploads

      if (
        oldImage &&
        oldImage.includes("/uploads/")
      ) {

        try {

          const oldFilename =
            oldImage.split("/uploads/")[1]

          const oldPath =
            path.join(
              "uploads",
              oldFilename
            )

          if (fs.existsSync(oldPath)) {

            fs.unlinkSync(oldPath)

          }

        }

        catch (deleteError) {

          console.error(
            "Erreur suppression ancienne photo :",
            deleteError.message
          )

        }

      }

    }

    // =========================
    // SAUVEGARDE
    // =========================

    await user.save()

    // =========================
    // UTILISATEUR SÉCURISÉ
    // =========================

    const safeUser =
      user.toObject()

    delete safeUser.password
    delete safeUser.twoFactorSecret
    delete safeUser.resetPasswordToken
    delete safeUser.resetPasswordExpires
    delete safeUser.phoneResetToken
    delete safeUser.phoneResetExpires

    // =========================
    // RÉPONSE
    // =========================

    return res.status(200).json({

      success: true,

      message:
        "Profil mis à jour avec succès.",

      user: safeUser

    })

  }

  catch (error) {

    console.error(
      "ERREUR MODIFICATION PROFIL :",
      error
    )

    return res.status(500).json({

      success: false,

      message:
        "Impossible de modifier votre profil."

    })

  }

}


// ======================================
// MODIFIER SON PROPRE MOT DE PASSE
// PUT /api/users/profile/password
// UTILISATEUR AUTHENTIFIÉ
// ======================================
export const changeOwnPassword = async (req, res) => {

  try {

    const userId =
      req.user._id

    const {
      currentPassword,
      newPassword
    } = req.body

    // =========================
    // VALIDATION
    // =========================

    if (
      !currentPassword ||
      !newPassword
    ) {

      return res.status(400).json({

        message:
          "L'ancien et le nouveau mot de passe sont obligatoires."

      })

    }

    // =========================
    // LONGUEUR
    // =========================

    if (newPassword.length < 6) {

      return res.status(400).json({

        message:
          "Le nouveau mot de passe doit contenir au moins 6 caractères."

      })

    }

    // =========================
    // RÉCUPÉRATION AVEC PASSWORD
    // =========================

    const user =
      await User.findById(userId)
        .select("+password")

    if (!user) {

      return res.status(404).json({

        message:
          "Utilisateur introuvable."

      })

    }

    // =========================
    // VÉRIFICATION ANCIEN MOT
    // =========================

    const passwordCorrect =
      await bcrypt.compare(

        currentPassword,

        user.password

      )

    if (!passwordCorrect) {

      return res.status(400).json({

        message:
          "L'ancien mot de passe est incorrect."

      })

    }

    // =========================
    // EMPÊCHER LE MÊME MOT
    // =========================

    const samePassword =
      await bcrypt.compare(

        newPassword,

        user.password

      )

    if (samePassword) {

      return res.status(400).json({

        message:
          "Le nouveau mot de passe doit être différent de l'ancien."

      })

    }

    // =========================
    // HASH
    // =========================

    user.password =
      await bcrypt.hash(

        newPassword,

        10

      )

    // =========================
    // INVALIDATION SESSIONS
    // =========================

    user.sessionVersion += 1

    user.isOnline = false

    await user.save()

    // =========================
    // RÉPONSE
    // =========================

    return res.status(200).json({

      success: true,

      logoutRequired: true,

      message:
        "Mot de passe modifié avec succès. Veuillez vous reconnecter."

    })

  }

  catch (error) {

    console.error(
      "ERREUR MODIFICATION MOT DE PASSE :",
      error
    )

    return res.status(500).json({

      message:
        "Impossible de modifier le mot de passe."

    })

  }

}