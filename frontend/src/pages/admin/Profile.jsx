import { useEffect, useRef, useState } from "react"

import AdminLayout from "../../layouts/AdminLayout"

import {
  FaUser,
  FaEnvelope,
  FaCamera,
  FaShieldAlt,
  FaCheckCircle,
  FaLock,
  FaCog
} from "react-icons/fa"

import { useNavigate } from "react-router-dom"

import API from "../../services/api"

import {
  successToast,
  errorToast
} from "../../utils/toast"


function Profile() {

  const navigate = useNavigate()

  const fileInputRef = useRef(null)

  const [user, setUser] = useState(() => {

    try {

      return JSON.parse(
        localStorage.getItem("user")
      )

    }

    catch {

      return null

    }

  })

  const [name, setName] = useState(
    user?.name || ""
  )

  const [email, setEmail] = useState(
    user?.email || ""
  )

  const [preview, setPreview] = useState(
    user?.profileImage || null
  )

  const [selectedFile, setSelectedFile] =
    useState(null)

  const [loading, setLoading] =
    useState(false)


  // =====================================================
  // RÉCUPÉRER LE PROFIL DEPUIS LE SERVEUR
  // =====================================================

  useEffect(() => {

    const loadProfile = async () => {

      try {

        const response =
          await API.get("/users/profile")

        if (response.data?.user) {

          const serverUser =
            response.data.user

          setUser(serverUser)

          setName(
            serverUser.name || ""
          )

          setEmail(
            serverUser.email || ""
          )

          setPreview(
            serverUser.profileImage || null
          )

          localStorage.setItem(
            "user",
            JSON.stringify(serverUser)
          )

        }

      }

      catch (error) {

        console.error(
          "Erreur récupération profil :",
          error
        )

      }

    }

    loadProfile()

  }, [])


  // =====================================================
  // CHOIX PHOTO
  // =====================================================

  const handleImageChange = (event) => {

    const file =
      event.target.files?.[0]

    if (!file) return

    // =========================
    // TYPE
    // =========================

    if (!file.type.startsWith("image/")) {

      errorToast(
        "Image invalide",
        "Veuillez sélectionner une image."
      )

      return

    }

    // =========================
    // TAILLE
    // =========================

    if (file.size > 5 * 1024 * 1024) {

      errorToast(
        "Image trop volumineuse",
        "La photo doit faire au maximum 5 Mo."
      )

      return

    }

    // =========================
    // APERÇU
    // =========================

    setSelectedFile(file)

    const imageUrl =
      URL.createObjectURL(file)

    setPreview(imageUrl)

  }


  // =====================================================
  // SAUVEGARDER
  // =====================================================

  const handleSubmit = async (event) => {

    event.preventDefault()

    try {

      setLoading(true)

      const formData =
        new FormData()

      formData.append(
        "name",
        name
      )

      formData.append(
        "email",
        email
      )

      if (selectedFile) {

        formData.append(
          "profileImage",
          selectedFile
        )

      }

      const response =
        await API.put(
          "/users/profile",
          formData
        )

      const updatedUser =
        response.data.user

      // =========================
      // ÉTAT
      // =========================

      setUser(updatedUser)

      setName(
        updatedUser.name || ""
      )

      setEmail(
        updatedUser.email || ""
      )

      setPreview(
        updatedUser.profileImage || null
      )

      setSelectedFile(null)

      // =========================
      // LOCAL STORAGE
      // =========================

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      )

      successToast(
        "Profil",
        "Vos informations ont été enregistrées."
      )

    }

    catch (error) {

      console.error(
        "Erreur sauvegarde profil :",
        error
      )

      errorToast(
        "Profil",
        error.response?.data?.message ||
        "Impossible d'enregistrer votre profil."
      )

    }

    finally {

      setLoading(false)

    }

  }


  // =====================================================
  // INITIAL
  // =====================================================

  const initial =
    user?.name?.charAt(0)?.toUpperCase() || "A"


  return (

    <AdminLayout>

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div>

        <h1 className="text-5xl font-bold">
          Mon Profil
        </h1>

        <p className="text-gray-500 mt-3">
          Gérez vos informations personnelles
          et votre compte administrateur.
        </p>

      </div>


      {/* ================================================= */}
      {/* CONTENU */}
      {/* ================================================= */}

      <form
        onSubmit={handleSubmit}
        className="mt-10 space-y-8"
      >

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ================================================= */}
          {/* CARTE PROFIL */}
          {/* ================================================= */}

          <div className="
            bg-white
            rounded-3xl
            shadow-sm
            p-8
            "
          >

            <div className="
              flex
              flex-col
              items-center
              text-center
            ">

              {/* PHOTO */}

              <div className="relative">

                <div className="
                  w-36
                  h-36
                  rounded-full
                  overflow-hidden
                  bg-purple-600
                  text-white
                  flex
                  items-center
                  justify-center
                  text-5xl
                  font-bold
                  shadow-lg
                ">

                  {preview ? (

                    <img
                      src={preview}
                      alt="Photo de profil"
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />

                  ) : (

                    initial

                  )}

                </div>


                {/* BOUTON CAMÉRA */}

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="
                    absolute
                    bottom-1
                    right-1
                    bg-purple-600
                    hover:bg-purple-700
                    text-white
                    w-12
                    h-12
                    rounded-full
                    flex
                    items-center
                    justify-center
                    shadow-lg
                    transition
                  "
                  title="Modifier la photo"
                >

                  <FaCamera />

                </button>


                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

              </div>


              <h2 className="
                text-2xl
                font-bold
                mt-6
              ">

                {user?.name}

              </h2>


              <p className="
                text-gray-500
                mt-2
              ">

                Administrateur SALAM CI

              </p>


              <div className="
                mt-4
                px-4
                py-2
                rounded-full
                bg-purple-100
                text-purple-600
                flex
                items-center
                gap-2
              ">

                <FaShieldAlt />

                Administrateur

              </div>


              {selectedFile && (

                <p className="
                  text-sm
                  text-purple-600
                  mt-4
                  font-medium
                ">

                  Nouvelle photo sélectionnée

                </p>

              )}

            </div>

          </div>


          {/* ================================================= */}
          {/* INFORMATIONS */}
          {/* ================================================= */}

          <div className="
            lg:col-span-2
            bg-white
            rounded-3xl
            shadow-sm
            p-8
          ">

            <h2 className="
              text-2xl
              font-bold
              mb-8
            ">

              Informations personnelles

            </h2>


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
                ">

                  Nom complet

                </label>

                <div className="relative">

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
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    className="
                      w-full
                      border
                      rounded-2xl
                      p-4
                      pl-11
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
                ">

                  Email

                </label>

                <div className="relative">

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
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    className="
                      w-full
                      border
                      rounded-2xl
                      p-4
                      pl-11
                      outline-none
                      focus:ring-2
                      focus:ring-purple-500
                    "
                  />

                </div>

              </div>

            </div>


            {/* ENREGISTRER */}

            <div className="
              flex
              justify-end
              mt-8
            ">

              <button
                type="submit"
                disabled={loading}
                className="
                  bg-gradient-to-r
                  from-purple-600
                  to-indigo-600
                  hover:opacity-90
                  text-white
                  px-8
                  py-4
                  rounded-2xl
                  font-semibold
                  transition
                  disabled:opacity-50
                "
              >

                {loading
                  ? "Enregistrement..."
                  : "Enregistrer les modifications"
                }

              </button>

            </div>

          </div>

        </div>


        {/* ================================================= */}
        {/* SÉCURITÉ */}
        {/* ================================================= */}

        <div className="
          bg-white
          rounded-3xl
          shadow-sm
          p-8
        ">

          <h2 className="
            text-2xl
            font-bold
            mb-6
          ">

            Sécurité du compte

          </h2>


          <div className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-6
            border
            rounded-2xl
            p-6
          ">

            <div className="
              flex
              items-center
              gap-4
            ">

              <div className="
                w-12
                h-12
                rounded-full
                bg-purple-100
                text-purple-600
                flex
                items-center
                justify-center
              ">

                <FaLock />

              </div>


              <div>

                <h3 className="font-bold">

                  Mot de passe

                </h3>

                <p className="
                  text-gray-500
                  text-sm
                  mt-1
                ">

                  Gérez votre mot de passe
                  depuis les paramètres de sécurité.

                </p>

              </div>

            </div>


            <button
              type="button"
              onClick={() =>
                navigate("/admin-settings")
              }
              className="
                flex
                items-center
                justify-center
                gap-2
                border
                border-purple-500
                text-purple-600
                px-6
                py-3
                rounded-xl
                hover:bg-purple-50
                transition
              "
            >

              <FaCog />

              Paramètres de sécurité

            </button>

          </div>

        </div>


        {/* ================================================= */}
        {/* STATUT */}
        {/* ================================================= */}

        <div className="
          bg-white
          rounded-3xl
          shadow-sm
          p-8
        ">

          <h2 className="
            text-2xl
            font-bold
            mb-6
          ">

            État du compte

          </h2>


          <div className="
            flex
            items-center
            gap-4
            border
            rounded-2xl
            p-5
          ">

            <FaCheckCircle className="
              text-green-500
              text-xl
            " />

            <div>

              <p className="font-semibold">

                Compte actif

              </p>

              <p className="
                text-gray-500
                text-sm
              ">

                Votre compte administrateur
                est actuellement actif.

              </p>

            </div>

          </div>

        </div>

      </form>

    </AdminLayout>

  )

}

export default Profile