import mongoose from "mongoose"

// =========================
// COURSE SCHEMA
// =========================
const courseSchema = new mongoose.Schema(

  {

    // =========================
    // TITRE DU COURS
    // =========================
    title: {

      type: String,

      required: true,

      trim: true

    },

    // =========================
    // DESCRIPTION
    // =========================
    description: {

      type: String,

      required: true

    },

    // =========================
    // CATÉGORIE
    // =========================
    category: {
      
      type: String,

      required: true

    },

    // =========================
    // IMAGE DE COUVERTURE
    // =========================
    thumbnail: {

      type: String,

      default: ""

    },

    // =========================
    // DOCUMENT PDF
    // =========================
    pdf: {

      type: String,

      default: ""

    },

    // =========================
    // VIDÉO
    // =========================
    video: {

      type: String,

      default: ""

    },

    // =========================
    // ENSEIGNANT
    // =========================
    teacher: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true

    },

    // =========================
    // PRIX DE LA FORMATION
    // =========================
    price: {

      type: Number,

      default: null,

      min: 0

    },

    // =========================
    // STATUT DU PRIX
    // =========================
    priceStatus: {

      type: String,

      enum: [

        "Non défini",

        "En attente de validation",

        "Modification demandée",

        "Validé"

      ],

      default: "Non défini"

    },

    // =========================
    // MESSAGE DE L'ADMIN
    // =========================
    adminMessage: {

      type: String,

      default: ""

    },

    // =========================
    // STATUT DU COURS
    // =========================
    status: {

      type: String,

      enum: [

        "En attente",

        "Publié",

        "Suspendu"

      ],

      default: "En attente"

    },

    // =========================
    // COURS ACTIF
    // =========================
    isActive: {

      type: Boolean,

      default: true

    },

    // =========================
    // NOMBRE D'ÉTUDIANTS
    // =========================
    studentsCount: {

      type: Number,

      default: 0

    },

    // =========================
    // NOMBRE DE VUES
    // =========================
    views: {

      type: Number,

      default: 0

    },

    // =========================
    // NOMBRE DE TÉLÉCHARGEMENTS
    // =========================
    downloads: {

      type: Number,

      default: 0

    },

    // =========================
    // DATE DE PUBLICATION
    // =========================
    publishedAt: {

      type: Date,

      default: null

    }

  },

  {

    timestamps: true

  }

)

// =========================
// MODEL
// =========================
const Course = mongoose.model(

  "Course",

  courseSchema

)

export default Course