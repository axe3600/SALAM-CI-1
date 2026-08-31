import "dotenv/config";
import express from "express"
import cors from "cors"
import mongoose from "mongoose"

// =========================
// IMPORT SOCKET
// =========================
import http from "http";
import { Server } from "socket.io";
import initializeSocket from "./socket/index.js";
import { setIO } from "./socket/socketManager.js";

// =========================
// IMPORT ROUTES
// =========================
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import conferenceRoutes from "./routes/conferenceRoutes.js";
import conferenceRequestRoutes from "./routes/conferenceRequestRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
//fichiers (admin)
import fileRoutes from "./routes/fileRoutes.js";

//Côté enseignant
import chapterRoutes from "./routes/chapterRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
//Côté admin
import notificationRoutes from "./routes/notificationRoutes.js";
//Côté étudiant
import paymentRoutes from "./routes/paymentRoutes.js";
//Communauté
import communityRoutes from "./routes/communityRoutes.js";
//statistic admin
import statisticsRoutes from "./routes/statisticsRoutes.js";
// Paramètres administrateur
import settingsRoutes from "./routes/settingsRoutes.js";

// =========================
// CONFIGURATION .ENV
// =========================


// =========================
// INITIALISATION EXPRESS
// =========================
const app = express()

// =========================
// MIDDLEWARES
// =========================

// Autorise les requêtes frontend
app.use(cors())

// Permet de lire le JSON
app.use(express.json())

// =========================
// DOSSIER STATIQUE UPLOADS
// =========================
// Permet d'accéder aux fichiers uploadés
// Exemple :
// https://salam-ci-backend.onrender.com/uploads/image.png
app.use(
  "/uploads",
  express.static("uploads")
)

// =========================
// ROUTES API
// =========================

// AUTH
app.use("/api/auth", authRoutes)

// Tableau de bord
app.use("/api/dashboard", dashboardRoutes);

// USERS
app.use("/api/users", userRoutes)

// Notifications
app.use( "/api/notifications", notificationRoutes);

// Payements
app.use("/api/payments", paymentRoutes);

// COMMUNAUTE
app.use("/api/community", communityRoutes );

// statistiques admin
app.use("/api/statistics", statisticsRoutes);

// paramètres admin
app.use("/api/settings", settingsRoutes);

// COURSES
app.use("/api/courses", courseRoutes)

// Conférences
app.use("/api/conferences", conferenceRoutes)
app.use("/api/conference-requests", conferenceRequestRoutes);

// Catégories
app.use("/api/categories", categoryRoutes)

// FICHIERS
app.use("/api/files", fileRoutes);

//Chapitres
app.use("/api/chapters", chapterRoutes);

app.use("/api/videos",videoRoutes);

// =========================
// PDF
// =========================
app.use(

  "/api/pdfs",

  pdfRoutes

);

// =========================
// Quiz
// =========================
app.use("/api/quizzes", quizRoutes);

// Exercise
app.use("/api/exercises", exerciseRoutes);

// =========================
// ENROLLMENTS
// =========================
app.use(

  "/api/enrollments",

  enrollmentRoutes

);

// =========================
// ROUTE TEST API
// =========================
app.get("/", (req, res) => {

  res.send("API SALAM CI")

})

// =========================
// CONNEXION MONGODB
// =========================
mongoose.connect(

  process.env.MONGO_URI,

  {
    serverSelectionTimeoutMS: 5000,

   /*
      ssl: true,
      tlsAllowInvalidCertificates: true
   */

  }

)

.then(() => {

  console.log("✅ MongoDB connecté")

})

.catch((err) => {

  console.log("❌ Erreur MongoDB")

  // Affiche seulement le message erreur
  console.log(err.message)

})

// =========================
// PORT SERVEUR
// =========================
const PORT = process.env.PORT || 5000

// =========================
// CREER LE SERVEUR
// =========================
const server = http.createServer(app);

const io = new Server(server, {

    cors: {

        origin: "*",

        methods: ["GET", "POST"]

    }

});

initializeSocket(io);
setIO(io);

// =========================
// LANCEMENT SERVEUR
// =========================
server.listen(PORT, () => {

  console.log(`🚀 Serveur lancé sur ${PORT}`);

});
