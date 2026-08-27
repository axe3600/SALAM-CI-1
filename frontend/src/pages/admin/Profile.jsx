import { useEffect, useState } from "react"

import AdminLayout from "../../layouts/AdminLayout"

import API from "../../services/api"

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaShieldAlt,
  FaCheckCircle,
  FaCalendarAlt,
  FaSave
} from "react-icons/fa"

import {
  successToast,
  errorToast
} from "../../utils/toast"


function Profile() {

  // =====================================================
  // UTILISATEUR LOCAL
  // =====================================================

  const storedUser =
    JSON.parse(
      localStorage.getItem("user") || "null"
    )

  // =====================================================
  // ÉTATS
  // =====================================================

  const [user, setUser] =
    useState(storedUser)

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [savingPassword, setSavingPassword] =
    useState(false)

  // =====================================================
  // INFORMATIONS
  // =====================================================

  const [name, setName] =
    useState("")

  const [email, setEmail] =
    useState("")

  const [phone, setPhone] =
    useState("")

  // =====================================================
  // MOT DE PASSE
  // =====================================================

  const [currentPassword, setCurrentPassword] =
    useState("")

  const [newPassword, setNewPassword] =
    useState("")

  const [confirmPassword, setConfirmPassword] =
    useState("")

  // =====================================================
  // RÉCUPÉRER LE PROFIL
  // =====================================================

  const loadProfile = async () => {

    try {

      setLoading(true)

      const response =
        await API.get(
          "/users/profile"
        )

      const profile =
        response.data.user

      setUser(profile)

      setName(
        profile?.name || ""
      )

      setEmail(
        profile?.email || ""
      )

      setPhone(
        profile?.phone || ""
      )

      // Mise à jour localStorage
      localStorage.setItem(
        "user",
        JSON.stringify(profile)
      )

    }

    catch (error) {

      console.error(
        "ERREUR CHARGEMENT PROFIL :",
        error
      )

      // On garde les données locales
      if (storedUser) {

        setName(
          storedUser.name || ""
        )

        setEmail(
          storedUser.email || ""
        )

        setPhone(
          storedUser.phone || ""
        )

      }

    }

    finally {

      setLoading(false)

    }

  }


  // =====================================================
  // CHARGEMENT
  // =====================================================

  useEffect(() => {

    loadProfile()

  }, [])


  // =====================================================
  // MODIFIER INFORMATIONS
  // =====================================================

  const handleUpdateProfile =
    async (e) => {

      e.preventDefault()

      if (!name.trim()) {

        errorToast(
          "Profil",
          "Le nom est obligatoire."
        )

        return

      }

      if (!email.trim()) {

        errorToast(
          "Profil",
          "L'email est obligatoire."
        )

        return

      }

      try {

        setSaving(true)

        const response =
          await API.put(

            "/users/profile",

            {

              name:
                name.trim(),

              email:
                email.trim(),

              phone:
                phone.trim()

            }

          )

        const updatedUser =
          response.data.user

        setUser(
          updatedUser
        )

        localStorage.setItem(

          "user",

          JSON.stringify(
            updatedUser
          )

        )

        successToast(

          "Profil",

          "Vos informations ont été mises à jour."

        )

      }

      catch (error) {

        console.error(
          "ERREUR MODIFICATION PROFIL :",
          error
        )

        errorToast(

          "Profil",

          error.response?.data?.message ||
          "Impossible de modifier votre profil."

        )

      }

      finally {

        setSaving(false)

      }

    }


  // =====================================================
  // MODIFIER MOT DE PASSE
  // =====================================================

  const handleChangePassword =
    async (e) => {

      e.preventDefault()

      if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
      ) {

        errorToast(

          "Sécurité",

          "Veuillez remplir tous les champs."

        )

        return

      }

      if (
        newPassword.length < 6
      ) {

        errorToast(

          "Sécurité",

          "Le nouveau mot de passe doit contenir au moins 6 caractères."

        )

        return

      }

      if (
        newPassword !== confirmPassword
      ) {

        errorToast(

          "Sécurité",

          "Les deux nouveaux mots de passe ne correspondent pas."

        )

        return

      }

      try {

        setSavingPassword(true)

        const response =
          await API.put(

            "/users/profile/password",

            {

              currentPassword,

              newPassword

            }

          )

        successToast(

          "Sécurité",

          response.data.message ||
          "Mot de passe modifié avec succès."

        )

        // Nettoyage
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")

        // Le backend invalide la session.
        // On déconnecte après un court délai.

        setTimeout(() => {

          localStorage.removeItem(
            "token"
          )

          localStorage.removeItem(
            "user"
          )

          window.location.replace(
            "/login"
          )

        }, 1800)

      }

      catch (error) {

        console.error(
          "ERREUR MOT DE PASSE :",
          error
        )

        errorToast(

          "Sécurité",

          error.response?.data?.message ||
          "Impossible de modifier le mot de passe."

        )

      }

      finally {

        setSavingPassword(false)

      }

    }


  // =====================================================
  // INITIALES
  // =====================================================

  const initial =
    user?.name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || "A"


  // =====================================================
  // AFFICHAGE
  // =====================================================

  return (

    <AdminLayout>

      {/* =================================================
          HEADER
      ================================================= */}

      <div>

        <h1 className="
          text-4xl
          md:text-5xl
          font-bold
          text-gray-900
          dark:text-white
        ">

          Mon Profil

        </h1>

        <p className="
          text-gray-500
          dark:text-gray-400
          mt-3
        ">

          Gérez vos informations administrateur.

        </p>

      </div>


      {/* =================================================
          CONTENU
      ================================================= */}

      <div className="
        grid
        lg:grid-cols-3
        gap-8
        mt-10
      ">


        {/* =================================================
            CARTE PROFIL
        ================================================= */}

        <div className="
          bg-white
          dark:bg-[#1e293b]
          rounded-3xl
          shadow-sm
          dark:shadow-none
          border
          border-transparent
          dark:border-slate-700
          p-8
        ">

          <div className="
            flex
            flex-col
            items-center
            text-center
          ">

            {/* AVATAR */}

            <div className="
              w-32
              h-32
              rounded-full
              bg-gradient-to-br
              from-purple-600
              to-indigo-600
              text-white
              flex
              items-center
              justify-center
              text-5xl
              font-bold
              shadow-xl
            ">

              {initial}

            </div>


            {/* NOM */}

            <h2 className="
              text-2xl
              font-bold
              text-gray-900
              dark:text-white
              mt-6
            ">

              {loading
                ? "Chargement..."
                : user?.name
              }

            </h2>


            {/* EMAIL */}

            <p className="
              text-gray-500
              dark:text-gray-400
              mt-2
              break-all
            ">

              {user?.email}

            </p>


            {/* BADGE */}

            <div className="
              mt-5
              px-5
              py-2
              rounded-full
              bg-purple-100
              dark:bg-purple-900/30
              text-purple-700
              dark:text-purple-300
              flex
              items-center
              gap-2
            ">

              <FaShieldAlt />

              Administrateur

            </div>


            {/* STATUT */}

            <div className="
              mt-4
              flex
              items-center
              gap-2
              text-green-600
              dark:text-green-400
            ">

              <FaCheckCircle />

              Compte actif

            </div>

          </div>

        </div>


        {/* =================================================
            INFORMATIONS PERSONNELLES
        ================================================= */}

        <div className="
          lg:col-span-2
          bg-white
          dark:bg-[#1e293b]
          rounded-3xl
          shadow-sm
          dark:shadow-none
          border
          border-transparent
          dark:border-slate-700
          p-8
        ">

          <div className="mb-8">

            <h2 className="
              text-2xl
              font-bold
              text-gray-900
              dark:text-white
            ">

              Informations personnelles

            </h2>

            <p className="
              text-gray-500
              dark:text-gray-400
              mt-2
            ">

              Modifiez les informations de votre compte.

            </p>

          </div>


          <form
            onSubmit={
              handleUpdateProfile
            }
          >

            <div className="
              grid
              md:grid-cols-2
              gap-6
            ">


              {/* NOM */}

              <div>

                <label className="
                  block
                  mb-2
                  font-medium
                  text-gray-700
                  dark:text-gray-200
                ">

                  Nom complet

                </label>

                <div className="
                  relative
                ">

                  <FaUser className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  " />

                  <input
                    type="text"
                    value={name}
                    onChange={
                      (e) =>
                        setName(
                          e.target.value
                        )
                    }
                    className="
                      w-full
                      border
                      border-gray-200
                      dark:border-slate-600
                      bg-white
                      dark:bg-slate-800
                      text-gray-900
                      dark:text-white
                      rounded-2xl
                      py-4
                      pl-12
                      pr-4
                      outline-none
                      focus:ring-2
                      focus:ring-purple-500
                    "
                  />

                </div>

              </div>


              {/* EMAIL */}

              <div>

                <label className="
                  block
                  mb-2
                  font-medium
                  text-gray-700
                  dark:text-gray-200
                ">

                  Email

                </label>

                <div className="
                  relative
                ">

                  <FaEnvelope className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  " />

                  <input
                    type="email"
                    value={email}
                    onChange={
                      (e) =>
                        setEmail(
                          e.target.value
                        )
                    }
                    className="
                      w-full
                      border
                      border-gray-200
                      dark:border-slate-600
                      bg-white
                      dark:bg-slate-800
                      text-gray-900
                      dark:text-white
                      rounded-2xl
                      py-4
                      pl-12
                      pr-4
                      outline-none
                      focus:ring-2
                      focus:ring-purple-500
                    "
                  />

                </div>

              </div>


              {/* TELEPHONE */}

              <div>

                <label className="
                  block
                  mb-2
                  font-medium
                  text-gray-700
                  dark:text-gray-200
                ">

                  Téléphone

                </label>

                <div className="
                  relative
                ">

                  <FaPhone className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  " />

                  <input
                    type="tel"
                    value={phone}
                    onChange={
                      (e) =>
                        setPhone(
                          e.target.value
                        )
                    }
                    placeholder="+225..."
                    className="
                      w-full
                      border
                      border-gray-200
                      dark:border-slate-600
                      bg-white
                      dark:bg-slate-800
                      text-gray-900
                      dark:text-white
                      rounded-2xl
                      py-4
                      pl-12
                      pr-4
                      outline-none
                      focus:ring-2
                      focus:ring-purple-500
                    "
                  />

                </div>

              </div>

            </div>


            {/* BOUTON */}

            <div className="
              flex
              justify-end
              mt-8
            ">

              <button
                type="submit"
                disabled={saving}
                className="
                  flex
                  items-center
                  gap-3
                  bg-gradient-to-r
                  from-purple-600
                  to-indigo-600
                  hover:opacity-90
                  disabled:opacity-60
                  text-white
                  px-7
                  py-4
                  rounded-2xl
                  font-semibold
                  transition
                "
              >

                <FaSave />

                {saving
                  ? "Enregistrement..."
                  : "Enregistrer les modifications"
                }

              </button>

            </div>

          </form>

        </div>

      </div>


      {/* =================================================
          SÉCURITÉ
      ================================================= */}

      <div className="
        bg-white
        dark:bg-[#1e293b]
        rounded-3xl
        shadow-sm
        dark:shadow-none
        border
        border-transparent
        dark:border-slate-700
        p-8
        mt-8
      ">

        <div className="mb-8">

          <h2 className="
            text-2xl
            font-bold
            text-gray-900
            dark:text-white
          ">

            Sécurité

          </h2>

          <p className="
            text-gray-500
            dark:text-gray-400
            mt-2
          ">

            Modifiez le mot de passe de votre compte administrateur.

          </p>

        </div>


        <form
          onSubmit={
            handleChangePassword
          }
        >

          <div className="
            grid
            md:grid-cols-3
            gap-6
          ">

            <input
              type="password"
              value={currentPassword}
              onChange={
                (e) =>
                  setCurrentPassword(
                    e.target.value
                  )
              }
              placeholder="Mot de passe actuel"
              className="
                w-full
                border
                border-gray-200
                dark:border-slate-600
                bg-white
                dark:bg-slate-800
                text-gray-900
                dark:text-white
                rounded-2xl
                p-4
                outline-none
                focus:ring-2
                focus:ring-purple-500
              "
            />

            <input
              type="password"
              value={newPassword}
              onChange={
                (e) =>
                  setNewPassword(
                    e.target.value
                  )
              }
              placeholder="Nouveau mot de passe"
              className="
                w-full
                border
                border-gray-200
                dark:border-slate-600
                bg-white
                dark:bg-slate-800
                text-gray-900
                dark:text-white
                rounded-2xl
                p-4
                outline-none
                focus:ring-2
                focus:ring-purple-500
              "
            />

            <input
              type="password"
              value={confirmPassword}
              onChange={
                (e) =>
                  setConfirmPassword(
                    e.target.value
                  )
              }
              placeholder="Confirmer le mot de passe"
              className="
                w-full
                border
                border-gray-200
                dark:border-slate-600
                bg-white
                dark:bg-slate-800
                text-gray-900
                dark:text-white
                rounded-2xl
                p-4
                outline-none
                focus:ring-2
                focus:ring-purple-500
              "
            />

          </div>


          <button
            type="submit"
            disabled={
              savingPassword
            }
            className="
              mt-6
              flex
              items-center
              gap-3
              bg-gradient-to-r
              from-purple-600
              to-indigo-600
              hover:opacity-90
              disabled:opacity-60
              text-white
              px-7
              py-4
              rounded-2xl
              font-semibold
            "
          >

            <FaLock />

            {savingPassword
              ? "Modification..."
              : "Modifier le mot de passe"
            }

          </button>

        </form>

      </div>


      {/* =================================================
          INFORMATIONS DU COMPTE
      ================================================= */}

      <div className="
        bg-white
        dark:bg-[#1e293b]
        rounded-3xl
        shadow-sm
        dark:shadow-none
        border
        border-transparent
        dark:border-slate-700
        p-8
        mt-8
      ">

        <h2 className="
          text-2xl
          font-bold
          text-gray-900
          dark:text-white
          mb-6
        ">

          Informations du compte

        </h2>


        <div className="
          grid
          md:grid-cols-3
          gap-6
        ">


          {/* RÔLE */}

          <div className="
            flex
            items-center
            gap-4
            p-5
            rounded-2xl
            bg-gray-50
            dark:bg-slate-800
          ">

            <FaShieldAlt className="
              text-purple-600
              text-xl
            " />

            <div>

              <p className="
                text-sm
                text-gray-500
                dark:text-gray-400
              ">

                Rôle

              </p>

              <p className="
                font-semibold
                text-gray-900
                dark:text-white
              ">

                Administrateur

              </p>

            </div>

          </div>


          {/* STATUT */}

          <div className="
            flex
            items-center
            gap-4
            p-5
            rounded-2xl
            bg-gray-50
            dark:bg-slate-800
          ">

            <FaCheckCircle className="
              text-green-500
              text-xl
            " />

            <div>

              <p className="
                text-sm
                text-gray-500
                dark:text-gray-400
              ">

                Statut

              </p>

              <p className="
                font-semibold
                text-green-600
                dark:text-green-400
              ">

                Actif

              </p>

            </div>

          </div>


          {/* DATE */}

          <div className="
            flex
            items-center
            gap-4
            p-5
            rounded-2xl
            bg-gray-50
            dark:bg-slate-800
          ">

            <FaCalendarAlt className="
              text-indigo-500
              text-xl
            " />

            <div>

              <p className="
                text-sm
                text-gray-500
                dark:text-gray-400
              ">

                Compte créé

              </p>

              <p className="
                font-semibold
                text-gray-900
                dark:text-white
              ">

                {user?.createdAt
                  ? new Date(
                      user.createdAt
                    ).toLocaleDateString(
                      "fr-FR"
                    )
                  : "-"
                }

              </p>

            </div>

          </div>

        </div>

      </div>

    </AdminLayout>

  )

}

export default Profile