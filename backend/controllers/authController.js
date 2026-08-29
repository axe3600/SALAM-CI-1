import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import speakeasy from "speakeasy"
import QRCode from "qrcode"
import crypto from "crypto"
import emailService from "../services/emailService.js"

import {sendVerificationCode, verifyVerificationCode} from "../services/twilioService.js"

// =====================================================
// REGISTER
// =====================================================

export const register = async (req, res) => {

  try {

    // =================================================
    // RÉCUPÉRATION DES DONNÉES
    // =================================================

    const {
      name,
      email,
      password,
      role
    } = req.body


    // =================================================
    // NETTOYAGE
    // =================================================

    const cleanName =
      name?.trim()

    const cleanEmail =
      email?.trim().toLowerCase()


    // =================================================
    // VALIDATION NOM
    // =================================================

    if (!cleanName) {

      return res.status(400).json({

        message:
          "Le nom complet est obligatoire."

      })

    }


    // =================================================
    // VALIDATION EMAIL
    // =================================================

    if (!cleanEmail) {

      return res.status(400).json({

        message:
          "L'adresse email est obligatoire."

      })

    }


    // =================================================
    // VALIDATION MOT DE PASSE
    // =================================================

    if (!password) {

      return res.status(400).json({

        message:
          "Le mot de passe est obligatoire."

      })

    }


    if (password.length < 6) {

      return res.status(400).json({

        message:
          "Le mot de passe doit contenir au moins 6 caractères."

      })

    }


    // =================================================
    // VALIDATION DU RÔLE
    // =================================================
    //
    // IMPORTANT :
    // Un utilisateur public ne peut PAS
    // créer un compte administrateur.
    // =================================================

    if (
      role !== "student" &&
      role !== "teacher"
    ) {

      return res.status(400).json({

        message:
          "Type de compte invalide."

      })

    }


    // =================================================
    // VÉRIFICATION EMAIL EXISTANT
    // =================================================

    const existingUser =
      await User.findOne({
        email: cleanEmail
      })


    if (existingUser) {

      return res.status(400).json({

        message:
          "Un utilisateur avec cette adresse email existe déjà."

      })

    }


    // =================================================
    // HASH MOT DE PASSE
    // =================================================

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      )


    // =================================================
    // CRÉATION UTILISATEUR
    // =================================================

    const user =
      await User.create({

        name:
          cleanName,

        email:
          cleanEmail,

        password:
          hashedPassword,

        role:
          role

      })


    // =================================================
    // UTILISATEUR SÉCURISÉ
    // =================================================
    //
    // Ne jamais renvoyer le mot de passe
    // ni le secret 2FA.
    // =================================================

    const safeUser =
      user.toObject()


    delete safeUser.password

    delete safeUser.twoFactorSecret


    // =================================================
    // RÉPONSE
    // =================================================

    return res.status(201).json({

      success: true,

      message:
        "Compte créé avec succès.",

      user:
        safeUser

    })

  }


  catch (error) {

    console.error(
      "ERREUR INSCRIPTION :",
      error
    )


    // =================================================
    // EMAIL DUPLIQUÉ
    // =================================================

    if (
      error.code === 11000
    ) {

      return res.status(400).json({

        message:
          "Cette adresse email est déjà utilisée."

      })

    }


    // =================================================
    // ERREUR GÉNÉRALE
    // =================================================

    return res.status(500).json({

      message:
        "Impossible de créer le compte."

    })

  }

}


// =========================
// LOGIN
// =========================
export const login = async (req, res) => {

  try {

    console.log("================================")
    console.log("LOGIN DEMANDÉ")
    console.log("================================")

    // =========================
    // DONNÉES DU FORMULAIRE
    // =========================
    const {
      email,
      password
    } = req.body

    console.log("Email reçu :", email)

    // =========================
    // RECHERCHE UTILISATEUR
    // =========================
    const user = await User.findOne({ email })

    if (!user) {

      console.log("Utilisateur introuvable")

      return res.status(404).json({

        message: "Utilisateur introuvable"

      })

    }

    console.log("Utilisateur trouvé :", user.email)

    // =========================
    // VÉRIFICATION MOT DE PASSE
    // =========================
    const isMatch = await bcrypt.compare(

      password,
      user.password

    )

    if (!isMatch) {

      console.log("Mot de passe incorrect")

      return res.status(400).json({

        message: "Mot de passe incorrect"

      })

    }

    console.log("Mot de passe correct")

    // =========================
    // VÉRIFICATION 2FA
    // =========================
    if (user.twoFactorEnabled) {

      return res.status(200).json({

        requiresTwoFactor: true,

        userId: user._id

      })

    }

    // =========================
    // MISE À JOUR DU STATUT
    // =========================
    user.isOnline = true

    user.lastLoginAt = new Date()
    
    console.log("Avant save :", user.isOnline)
    console.log("Dernière connexion :", user.lastLoginAt)
    
    await user.save()

    console.log("Après save :", user.isOnline)

    // =========================
    // VÉRIFICATION MONGODB
    // =========================
    const verification = await User.findById(user._id)

    console.log("Document MongoDB :")
    console.log(verification)


// =========================
// CRÉATION TOKEN JWT
// =========================
const token = jwt.sign(

  {
    id: user._id,
    role: user.role,
    // Version de session actuelle
    sessionVersion: user.sessionVersion
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d"

  }
)


    // =========================
    // RÉPONSE
    // =========================
    res.status(200).json({

      token,
      user

    })

  }

  catch (error) {

    console.log("ERREUR LOGIN")
    console.log(error)

    res.status(500).json({

      message: error.message

    })

  }
  
}

// =====================================================
// CONFIGURATION 2FA
// =====================================================
export const setupTwoFactor = async (req, res) => {

  try {

    const user = await User
    .findById(req.user._id)
    .select("+twoFactorSecret")

    if (!user) {

      return res.status(404).json({

        message: "Utilisateur introuvable"

      })

    }

    if (user.twoFactorEnabled) {

      return res.status(400).json({

        message: "L'authentification à deux facteurs est déjà activée."

      })

    }

    // =========================
    // GÉNÉRATION SECRET
    // =========================
    const secret = speakeasy.generateSecret({

      name: `SALAM CI:${user.email}`,

      issuer: "SALAM CI",

      length: 20

    })

    // =========================
    // SAUVEGARDE SECRET
    // =========================
    user.twoFactorSecret = secret.base32

    await user.save()

    // =========================
    // QR CODE
    // =========================
    const qrCode = await QRCode.toDataURL(
      secret.otpauth_url
    )

    res.status(200).json({

      success: true,

      qrCode,

      secret: secret.base32

    })

  }

  catch (error) {

    console.error(
      "ERREUR CONFIGURATION 2FA :",
      error
    )

    res.status(500).json({

      message: "Impossible de configurer le 2FA."

    })

  }

}


// =====================================================
// VALIDATION ACTIVATION 2FA
// =====================================================
export const verifyTwoFactorSetup = async (req, res) => {

  try {

    const {
      token
    } = req.body

    const user = await User
      .findById(req.user._id)
      .select("+twoFactorSecret")

    if (!user) {

      return res.status(404).json({

        message: "Utilisateur introuvable"

      })

    }

    if (!user.twoFactorSecret) {

      return res.status(400).json({

        message: "La configuration 2FA n'a pas été commencée."

      })

    }

    const verified = speakeasy.totp.verify({

      secret: user.twoFactorSecret,

      encoding: "base32",

      token,

      window: 1

    })

    if (!verified) {

      return res.status(400).json({

        message: "Code 2FA incorrect."

      })

    }

    user.twoFactorEnabled = true

    await user.save()

    res.status(200).json({

      success: true,

      message:
        "Authentification à deux facteurs activée avec succès."

    })

  }

  catch (error) {

    console.error(
      "ERREUR VALIDATION 2FA :",
      error
    )

    res.status(500).json({

      message: "Impossible d'activer le 2FA."

    })

  }

}


// =====================================================
// DÉSACTIVER 2FA
// =====================================================

export const disableTwoFactor = async (req, res) => {

  try {

    const {
      password
    } = req.body

    const user = await User
      .findById(req.user._id)
      .select("+twoFactorSecret")

    if (!user) {

      return res.status(404).json({

        message: "Utilisateur introuvable"

      })

    }

    const isMatch = await bcrypt.compare(

      password,

      user.password

    )

    if (!isMatch) {

      return res.status(400).json({

        message: "Mot de passe incorrect."

      })

    }

    user.twoFactorEnabled = false

    user.twoFactorSecret = null

    await user.save()

    res.status(200).json({

      success: true,

      message:
        "Authentification à deux facteurs désactivée."

    })

  }

  catch (error) {

    console.error(
      "ERREUR DÉSACTIVATION 2FA :",
      error
    )

    res.status(500).json({

      message: "Impossible de désactiver le 2FA."

    })

  }

}

// =====================================================
// LOGIN AVEC CODE 2FA
// =====================================================
export const verifyTwoFactorLogin = async (req, res) => {

  try {

    const {
      userId,
      token
    } = req.body

    const user = await User
      .findById(userId)
      .select("+twoFactorSecret")

    if (!user) {

      return res.status(404).json({

        message: "Utilisateur introuvable."

      })

    }

    if (!user.twoFactorEnabled) {

      return res.status(400).json({

        message: "Le 2FA n'est pas activé."

      })

    }

    const verified = speakeasy.totp.verify({

      secret: user.twoFactorSecret,

      encoding: "base32",

      token,

      window: 1

    })

    if (!verified) {

      return res.status(400).json({

        message: "Code de vérification incorrect."

      })

    }

    // =========================
    // UTILISATEUR EN LIGNE
    // =========================

    user.isOnline = true

    user.lastLoginAt = new Date()
    
    await user.save()

    // =========================
    // JWT FINAL
    // =========================

    const jwtToken = jwt.sign(

      {

        id: user._id,

        role: user.role,

        sessionVersion:
          user.sessionVersion

      },

      process.env.JWT_SECRET,

      {

        expiresIn: "7d"

      }

    )

    const safeUser = user.toObject()

    delete safeUser.password
    delete safeUser.twoFactorSecret
    
    res.status(200).json({
    
      token: jwtToken,
    
      user: safeUser
    
    })

  }

  catch (error) {

    console.error(
      "ERREUR LOGIN 2FA :",
      error
    )

    res.status(500).json({

      message: "Vérification 2FA impossible."

    })

  }

}

// =====================================================
// MOT DE PASSE OUBLIÉ
// =====================================================
export const forgotPassword = async (req, res) => {

  try {

    const {
      email
    } = req.body

    // =========================
    // NETTOYAGE EMAIL
    // =========================

    const cleanEmail =
      email?.trim().toLowerCase()

    if (!cleanEmail) {

      return res.status(400).json({

        message:
          "L'adresse email est obligatoire."

      })

    }

    // =========================
    // RECHERCHE UTILISATEUR
    // =========================

    const user = await User
      .findOne({
        email: cleanEmail
      })
      .select(
        "+resetPasswordToken +resetPasswordExpires"
      )

    // =========================
    // MESSAGE GÉNÉRIQUE
    // =========================
    // On ne révèle pas si l'adresse
    // existe ou non.

    if (!user) {

      return res.status(200).json({

        success: true,

        message:
          "Si cette adresse email correspond à un compte, un lien de récupération a été envoyé."

      })

    }

    // =========================
    // GÉNÉRATION TOKEN
    // =========================

    const resetToken =
      crypto.randomBytes(32).toString("hex")

    // =========================
    // HASH DU TOKEN
    // =========================

    const resetTokenHash =
      crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")

    // =========================
    // EXPIRATION
    // 15 MINUTES
    // =========================

    const resetExpires =
      new Date(
        Date.now() + 15 * 60 * 1000
      )

    // =========================
    // SAUVEGARDE
    // =========================

    user.resetPasswordToken =
      resetTokenHash

    user.resetPasswordExpires =
      resetExpires

    await user.save()

    // =========================
    // LIEN FRONTEND
    // =========================

    const frontendUrl =
      process.env.FRONTEND_URL ||
      "https://salam-ci-1.vercel.app"

    const resetUrl =
      `${frontendUrl}/reset-password/${resetToken}`

    // =========================
    // ENVOI EMAIL
    // =========================

    await emailService.sendPasswordResetEmail(

      user,

      resetUrl

    )

    // =========================
    // RÉPONSE
    // =========================

    return res.status(200).json({

      success: true,

      message:
        "Si cette adresse email correspond à un compte, un lien de récupération a été envoyé."

    })

  }

  catch (error) {

    console.error(
      "ERREUR MOT DE PASSE OUBLIÉ :",
      error
    )

    return res.status(500).json({

      message:
        "Impossible de traiter la demande."

    })

  }

}


// =====================================================
// RÉINITIALISER LE MOT DE PASSE
// =====================================================
export const resetPassword = async (req, res) => {

  try {

    const {
      token
    } = req.params

    const {
      password
    } = req.body

    // =========================
    // VALIDATION
    // =========================

    if (!token) {

      return res.status(400).json({

        message:
          "Lien de récupération invalide."

      })

    }

    if (!password) {

      return res.status(400).json({

        message:
          "Le nouveau mot de passe est obligatoire."

      })

    }

    if (password.length < 6) {

      return res.status(400).json({

        message:
          "Le mot de passe doit contenir au moins 6 caractères."

      })

    }

    // =========================
    // HASH TOKEN REÇU
    // =========================

    const tokenHash =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex")

    // =========================
    // RECHERCHE TOKEN
    // =========================

    const user = await User
      .findOne({

        resetPasswordToken:
          tokenHash,

        resetPasswordExpires: {
          $gt: new Date()
        }

      })
      .select(
        "+resetPasswordToken +resetPasswordExpires"
      )

    // =========================
    // TOKEN INVALIDE / EXPIRÉ
    // =========================

    if (!user) {

      return res.status(400).json({

        message:
          "Le lien de récupération est invalide ou expiré."

      })

    }

    // =========================
    // HASH NOUVEAU MOT DE PASSE
    // =========================

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      )

    // =========================
    // NOUVEAU MOT DE PASSE
    // =========================

    user.password =
      hashedPassword

    // =========================
    // SUPPRESSION TOKEN
    // =========================

    user.resetPasswordToken =
      null

    user.resetPasswordExpires =
      null

    // =========================
    // INVALIDATION DES SESSIONS
    // =========================
    // Toutes les anciennes sessions
    // deviennent invalides.

    user.sessionVersion += 1

    // =========================
    // DÉCONNEXION
    // =========================

    user.isOnline = false

    await user.save()

    // =========================
    // RÉPONSE
    // =========================

    return res.status(200).json({

      success: true,

      message:
        "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter."

    })

  }

  catch (error) {

    console.error(
      "ERREUR RÉINITIALISATION MOT DE PASSE :",
      error
    )

    return res.status(500).json({

      message:
        "Impossible de réinitialiser le mot de passe."

    })

  }

}


// =====================================================
// MOT DE PASSE OUBLIÉ PAR TÉLÉPHONE
// ENVOYER LE CODE SMS
// =====================================================

export const forgotPasswordPhone = async (req, res) => {

  try {

    const {
      phone
    } = req.body

    // =========================
    // VALIDATION
    // =========================

    const cleanPhone =
      phone?.trim()

    if (!cleanPhone) {

      return res.status(400).json({

        message:
          "Le numéro de téléphone est obligatoire."

      })

    }

    // =========================
    // RECHERCHE UTILISATEUR
    // =========================
    //
    // IMPORTANT :
    // Cette fonction nécessite que
    // le modèle User possède un champ
    // phone.
    // =========================

    const user = await User.findOne({

      phone: cleanPhone

    })

    // =========================
    // MESSAGE GÉNÉRIQUE
    // =========================

    if (!user) {

      return res.status(200).json({

        success: true,

        message:
          "Si ce numéro correspond à un compte, un code de vérification a été envoyé."

      })

    }

    // =========================
    // COMPTE DÉSACTIVÉ
    // =========================

    if (user.isActive === false) {

      return res.status(403).json({

        message:
          "Ce compte est désactivé."

      })

    }

    // =========================
    // ENVOI DU CODE TWILIO
    // =========================

    await sendVerificationCode(
      cleanPhone
    )

    // =========================
    // RÉPONSE
    // =========================

    return res.status(200).json({

      success: true,

      message:
        "Un code de vérification a été envoyé par SMS."

    })

  }

  catch (error) {

    console.error(
      "ERREUR MOT DE PASSE OUBLIÉ PAR TÉLÉPHONE :",
      error
    )

    return res.status(500).json({

      message:
        "Impossible d'envoyer le code de vérification."

    })

  }

}


// =====================================================
// VÉRIFIER LE CODE SMS
// =====================================================

export const verifyPhoneResetCode = async (req, res) => {

  try {

    const {
      phone,
      code
    } = req.body

    // =========================
    // VALIDATION
    // =========================

    const cleanPhone =
      phone?.trim()

    const cleanCode =
      code?.trim()

    if (!cleanPhone || !cleanCode) {

      return res.status(400).json({

        message:
          "Le numéro et le code sont obligatoires."

      })

    }

    // =========================
    // RECHERCHE UTILISATEUR
    // =========================

    const user = await User.findOne({

      phone: cleanPhone

    })

    if (!user) {

      return res.status(400).json({

        message:
          "Code de vérification invalide."

      })

    }

    // =========================
    // VÉRIFICATION TWILIO
    // =========================

    const verification =
      await verifyVerificationCode(

        cleanPhone,

        cleanCode

      )

    if (
      verification.status !==
      "approved"
    ) {

      return res.status(400).json({

        message:
          "Code de vérification incorrect ou expiré."

      })

    }

    // =========================
    // AUTORISATION TEMPORAIRE
    // =========================

    const resetToken =
      crypto
        .randomBytes(32)
        .toString("hex")

    const resetTokenHash =
      crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")

    // =========================
    // EXPIRATION
    // 10 MINUTES
    // =========================

    user.phoneResetToken =
      resetTokenHash

    user.phoneResetExpires =
      new Date(
        Date.now() + 10 * 60 * 1000
      )

    await user.save()

    // =========================
    // RÉPONSE
    // =========================

    return res.status(200).json({

      success: true,

      resetToken,

      message:
        "Numéro vérifié avec succès. Vous pouvez maintenant définir un nouveau mot de passe."

    })

  }

  catch (error) {

    console.error(
      "ERREUR VÉRIFICATION CODE TÉLÉPHONE :",
      error
    )

    return res.status(500).json({

      message:
        "Impossible de vérifier le code."

    })

  }

}


// =====================================================
// RÉINITIALISER MOT DE PASSE PAR TÉLÉPHONE
// =====================================================
export const resetPasswordPhone = async (req, res) => {

  try {

    const {
      token
    } = req.params

    const {
      password
    } = req.body

    // =========================
    // VALIDATION
    // =========================

    if (!token) {

      return res.status(400).json({

        message:
          "Autorisation de réinitialisation invalide."

      })

    }

    if (!password) {

      return res.status(400).json({

        message:
          "Le nouveau mot de passe est obligatoire."

      })

    }

    if (password.length < 6) {

      return res.status(400).json({

        message:
          "Le mot de passe doit contenir au moins 6 caractères."

      })

    }

    // =========================
    // HASH TOKEN
    // =========================

    const tokenHash =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex")

    // =========================
    // RECHERCHE UTILISATEUR
    // =========================

    const user = await User
      .findOne({

        phoneResetToken:
          tokenHash,

        phoneResetExpires: {
          $gt: new Date()
        }

      })
      .select(
        "+phoneResetToken +phoneResetExpires"
      )

    // =========================
    // TOKEN INVALIDE
    // =========================

    if (!user) {

      return res.status(400).json({

        message:
          "L'autorisation est invalide ou expirée."

      })

    }

    // =========================
    // HASH MOT DE PASSE
    // =========================

    const hashedPassword =
      await bcrypt.hash(

        password,

        10

      )

    // =========================
    // NOUVEAU MOT DE PASSE
    // =========================

    user.password =
      hashedPassword

    // =========================
    // SUPPRESSION AUTORISATION
    // =========================

    user.phoneResetToken =
      null

    user.phoneResetExpires =
      null

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

      message:
        "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter."

    })

  }

  catch (error) {

    console.error(
      "ERREUR RÉINITIALISATION TÉLÉPHONE :",
      error
    )

    return res.status(500).json({

      message:
        "Impossible de réinitialiser le mot de passe."

    })

  }

}