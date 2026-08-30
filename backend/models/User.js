import mongoose from "mongoose"

// =========================
// USER SCHEMA
// =========================
const userSchema = new mongoose.Schema(

  {

    // =========================
    // NOM COMPLET
    // =========================
    name: {

      type: String,

      required: true,

      trim: true

    },

    // =========================
    // EMAIL
    // =========================
    email: {

      type: String,

      required: true,

      unique: true,

      trim: true,

      lowercase: true

    },

    // =========================
    // NUMÉRO DE TÉLÉPHONE
    // =========================
    phone: {

      type: String,

      default: null,

      trim: true

    },

    // =========================
    // SPÉCIALITÉ
    // =========================
    specialty: {

      type: String,

      default: null,

      trim: true

    },

    // =========================
    // PHOTO DE PROFIL
    // =========================
    profileImage: {

      type: String,

      default: null,

      trim: true

    },

    // =========================
    // MOT DE PASSE
    // =========================
    password: {

      type: String,

      required: true

    },

    // =========================
    // RÔLE
    // =========================
    role: {

      type: String,

      enum: [

        "student",

        "teacher",

        "admin"

      ],

      default: "student"

    },

    // =========================
    // STATUT DE CONNEXION
    // =========================
    isOnline: {

      type: Boolean,

      default: false

    },

    // =========================
    // DERNIÈRE CONNEXION
    // =========================
    lastLoginAt: {

      type: Date,

      default: null

    },

    // =========================
    // COMPTE ACTIF
    // =========================
    isActive: {

      type: Boolean,

      default: true

    },

    // =========================
    // VERSION DE SESSION
    // =========================
    // Permet d'invalider tous les
    // anciens tokens JWT.
    // =========================
    sessionVersion: {

      type: Number,

      default: 0

    },

    // =====================================================
    // RÉCUPÉRATION DU MOT DE PASSE PAR EMAIL
    // =====================================================

    resetPasswordToken: {

      type: String,

      default: null,

      select: false

    },

    resetPasswordExpires: {

      type: Date,

      default: null,

      select: false

    },

// =====================================================
// RÉCUPÉRATION DU MOT DE PASSE PAR TÉLÉPHONE
// =====================================================
phoneResetToken: {

  type: String,

  default: null,

  select: false

},

phoneResetExpires: {

  type: Date,

  default: null,

  select: false

},

    // =========================
    // AUTHENTIFICATION 2 FACTEURS
    // =========================
    twoFactorEnabled: {

      type: Boolean,

      default: false

    },

    // =========================
    // SECRET 2FA
    // =========================
    // Secret utilisé par :
    // - Google Authenticator
    // - Microsoft Authenticator
    // - Authy
    //
    // select: false permet de ne pas
    // retourner automatiquement le
    // secret dans les requêtes.
    // =========================
    twoFactorSecret: {

      type: String,

      default: null,

      select: false

    },

    // =========================
    // PRÉFÉRENCES NOTIFICATIONS
    // =========================
    notificationPreferences: {

      newEnrollments: {
        type: Boolean,
        default: true
      },

      studentMessages: {
        type: Boolean,
        default: true
      },

      conferenceReminders: {
        type: Boolean,
        default: true
      }

    }

  },

  {

    // =========================
    // CREATED AT
    // UPDATED AT
    // =========================
    timestamps: true

  }

)


// =========================
// MODEL
// =========================
const User = mongoose.model(

  "User",

  userSchema

)


// =========================
// EXPORT
// =========================
export default User