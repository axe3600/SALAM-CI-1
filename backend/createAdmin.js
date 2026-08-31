import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import User from "./models/User.js"

dotenv.config()

const createAdmin = async () => {

  try {

    // =====================================================
    // CONNEXION MONGODB
    // =====================================================

    await mongoose.connect(process.env.MONGO_URI)

    console.log("✅ MongoDB connecté")


    // =====================================================
    // VÉRIFIER SI UN ADMIN EXISTE DÉJÀ
    // =====================================================

    const existingAdmin = await User.findOne({
      role: "admin"
    })

    if (existingAdmin) {

      console.log(
        `⚠️ Un administrateur existe déjà : ${existingAdmin.email}`
      )

      return

    }


    // =====================================================
    // INFORMATIONS ADMIN
    // =====================================================

    const name =
      "Administrateur SALAM CI"

    const email =
      "admin@salam-ci.com"

    const password =
      "1234567890"


    // =====================================================
    // HASH DU MOT DE PASSE
    // =====================================================

    const hashedPassword =
      await bcrypt.hash(password, 10)


    // =====================================================
    // CRÉATION ADMIN
    // =====================================================

    const admin =
      await User.create({

        name,

        email,

        password:
          hashedPassword,

        role:
          "admin",

        isOnline:
          false,

        isActive:
          true,

        sessionVersion:
          0,

        twoFactorEnabled:
          false,

        twoFactorSecret:
          null

      })


    console.log("")
    console.log("======================================")
    console.log("✅ ADMINISTRATEUR CRÉÉ")
    console.log("======================================")
    console.log(`Email : ${admin.email}`)
    console.log(`Mot de passe initial : ${password}`)
    console.log("======================================")
    console.log("")
    console.log(
      "⚠️ Changez ce mot de passe après la première connexion."
    )


  }

  catch (error) {

    console.error(
      "❌ ERREUR CRÉATION ADMIN :",
      error.message
    )

  }

  finally {

    await mongoose.disconnect()

    console.log(
      "🔌 MongoDB déconnecté"
    )

  }

}


createAdmin()


//PS C:\Users\LONOVO\SALAM-CI\backend> node createAdmin.js  (pour creer un admin si la BD est vide)

// node --input-type=module -e "import dotenv from 'dotenv'; import mongoose from 'mongoose'; import User from './models/User.js'; dotenv.config(); await mongoose.connect(process.env.MONGO_URI); const admins=await User.find({role:'admin'}).select('name email role isActive twoFactorEnabled'); console.log(admins); await mongoose.disconnect();"   vérifier les admins