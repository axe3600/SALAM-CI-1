import AdminLayout from "../../layouts/AdminLayout"

import {
  FaCog,
  FaBell,
  FaLock,
  FaPalette,
  FaTools,
  FaSave,
  FaCheckCircle,
  FaExclamationCircle,
  FaQrcode,
  FaTimes,
  FaShieldAlt
} from "react-icons/fa"

import { useEffect, useState } from "react"
import API from "../../services/api"

import {
  getSavedTheme,
  saveTheme
} from "../../utils/theme"


function Settings() {

  // =====================================================
  // ONGLET ACTIF
  // =====================================================

  const [activeTab, setActiveTab] = useState("general")


  // =====================================================
  // ÉTATS GÉNÉRAUX
  // =====================================================

  const [loading, setLoading] = useState(true)

  const [saving, setSaving] = useState(false)

  const [error, setError] = useState("")

  const [saved, setSaved] = useState(false)


  // =====================================================
  // PARAMÈTRES GÉNÉRAUX
  // =====================================================

  const [general, setGeneral] = useState({

    platformName: "SALAM CI",

    email: "",

    phone: "",

    address: "",

    description:
      "Plateforme de formation en ligne permettant aux enseignants et aux étudiants de partager et suivre des contenus pédagogiques."

  })


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const [notifications, setNotifications] = useState({

    newUser: true,

    newTeacher: true,

    newCourse: true,

    conferenceRequest: true,

    email: true

  })


  // =====================================================
  // SÉCURITÉ
  // =====================================================

  const [security, setSecurity] = useState({

    currentPassword: "",

    newPassword: "",

    confirmPassword: ""

  })


  // =====================================================
  // AUTHENTIFICATION À DEUX FACTEURS
  // =====================================================

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(() => {

    try {

      const storedUser =
        JSON.parse(localStorage.getItem("user") || "null")

      return storedUser?.twoFactorEnabled === true

    }

    catch {

      return false

    }

  })

  const [twoFactorModal, setTwoFactorModal] = useState(null)

  const [twoFactorLoading, setTwoFactorLoading] = useState(false)

  const [twoFactorError, setTwoFactorError] = useState("")

  const [twoFactorQrCode, setTwoFactorQrCode] = useState("")

  const [twoFactorSecret, setTwoFactorSecret] = useState("")

  const [twoFactorCode, setTwoFactorCode] = useState("")

  const [disablePassword, setDisablePassword] = useState("")


  // =====================================================
  // APPARENCE
  // =====================================================

  const [appearance, setAppearance] = useState({

    theme: getSavedTheme(),
  
    animations: true
  
  })


  // =====================================================
  // MAINTENANCE
  // =====================================================

  const [maintenance, setMaintenance] = useState({

    enabled: false,

    message:
      "La plateforme est actuellement en maintenance. Merci de revenir plus tard."

  })


  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken")
    )
  }


  // =====================================================
  // CHARGEMENT DES PARAMÈTRES
  // =====================================================

  useEffect(() => {

    const fetchSettings = async () => {

      try {

        setLoading(true)
        setError("")

        // IMPORTANT :
        // API contient déjà /api dans son baseURL.
        // Il faut donc appeler uniquement /settings.
        const response = await API.get("/settings")

        console.log(
          "⚙️ Paramètres reçus :",
          response.data
        )

        const settings = response.data?.settings

        if (!settings) {
          throw new Error("Paramètres introuvables.")
        }

        setGeneral({
          platformName: settings.platformName || "",
          email: settings.email || "",
          phone: settings.phone || "",
          address: settings.address || "",
          description: settings.description || ""
        })

        setNotifications({
          newUser: settings.notifications?.newUser ?? true,
          newTeacher: settings.notifications?.newTeacher ?? true,
          newCourse: settings.notifications?.newCourse ?? true,
          conferenceRequest:
            settings.notifications?.conferenceRequest ?? true,
          email: settings.notifications?.email ?? true
        })

        setAppearance({
          theme: getSavedTheme(),
          animations: settings.appearance?.animations ?? true
        })

        setMaintenance({
          enabled: settings.maintenance?.enabled ?? false,
          message:
            settings.maintenance?.message ||
            "La plateforme est actuellement en maintenance. Merci de revenir plus tard."
        })

      }

      catch (err) {

        console.error(
          "❌ Erreur chargement paramètres :",
          err
        )

        setError(
          err.response?.data?.message ||
          err.message ||
          "Impossible de charger les paramètres."
        )

      }

      finally {

        setLoading(false)

      }

    }

    fetchSettings()

  }, [])



  // =====================================================
  // ONGLETS
  // =====================================================

  const tabs = [

    {
      id: "general",
      label: "Général",
      icon: <FaCog />
    },

    {
      id: "notifications",
      label: "Notifications",
      icon: <FaBell />
    },

    {
      id: "security",
      label: "Sécurité",
      icon: <FaLock />
    },

    {
      id: "appearance",
      label: "Apparence",
      icon: <FaPalette />
    },

    {
      id: "maintenance",
      label: "Maintenance",
      icon: <FaTools />
    }

  ]


  // =====================================================
  // MESSAGE TEMPORAIRE
  // =====================================================

  const showSavedMessage = () => {

    setSaved(true)

    window.dispatchEvent(
      new CustomEvent(
        "appearanceChanged",
        {
          detail: appearance
        }
      )
    )

    setTimeout(() => {

      setSaved(false)

    }, 3000)

  }


  // =====================================================
  // METTRE À JOUR L'UTILISATEUR LOCAL
  // =====================================================

  const updateStoredUserTwoFactor = (enabled) => {

    try {

      const storedUser =
        JSON.parse(localStorage.getItem("user") || "null")

      if (storedUser) {

        storedUser.twoFactorEnabled = enabled

        localStorage.setItem(
          "user",
          JSON.stringify(storedUser)
        )

      }

    }

    catch (error) {

      console.warn(
        "Impossible de mettre à jour l'utilisateur local :",
        error
      )

    }

  }


  // =====================================================
  // PRÉPARER L'ACTIVATION 2FA
  // =====================================================

  const startTwoFactorSetup = async () => {

    try {

      const token = getToken()

      if (!token) {

        throw new Error(
          "Votre session a expiré. Veuillez vous reconnecter."
        )

      }

      setTwoFactorLoading(true)

      setTwoFactorError("")

      const response = await API.get(
        "/auth/2fa/setup",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = response.data

      if (!data?.success || !data?.qrCode) {

        throw new Error(
          "Impossible de générer le QR Code 2FA."
        )

      }

      setTwoFactorQrCode(data.qrCode)

      setTwoFactorSecret(data.secret || "")

      setTwoFactorCode("")

      setTwoFactorModal("setup")

    }

    catch (err) {

      console.error(
        "❌ Erreur préparation 2FA :",
        err
      )

      setTwoFactorError(
        err.response?.data?.message ||
        err.message ||
        "Impossible de préparer l'authentification à deux facteurs."
      )

    }

    finally {

      setTwoFactorLoading(false)

    }

  }


  // =====================================================
  // CONFIRMER L'ACTIVATION 2FA
  // =====================================================

  const verifyTwoFactorSetup = async () => {

    const code = twoFactorCode.trim()

    if (!/^\d{6}$/.test(code)) {

      setTwoFactorError(
        "Veuillez saisir un code à 6 chiffres."
      )

      return

    }

    try {

      const token = getToken()

      if (!token) {

        throw new Error(
          "Votre session a expiré. Veuillez vous reconnecter."
        )

      }

      setTwoFactorLoading(true)

      setTwoFactorError("")

      const response = await API.post(
        "/auth/2fa/verify-setup",
        {
          token: code
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!response.data?.success) {

        throw new Error(
          "Impossible d'activer le 2FA."
        )

      }

      setTwoFactorEnabled(true)

      updateStoredUserTwoFactor(true)

      setTwoFactorModal(null)

      setTwoFactorCode("")

      setTwoFactorQrCode("")

      setTwoFactorSecret("")

      showSavedMessage()

    }

    catch (err) {

      console.error(
        "❌ Erreur activation 2FA :",
        err
      )

      setTwoFactorError(
        err.response?.data?.message ||
        err.message ||
        "Code 2FA incorrect."
      )

    }

    finally {

      setTwoFactorLoading(false)

    }

  }


  // =====================================================
  // DÉSACTIVER LE 2FA
  // =====================================================

  const disableTwoFactor = async () => {

    if (!disablePassword) {

      setTwoFactorError(
        "Veuillez saisir votre mot de passe actuel."
      )

      return

    }

    try {

      const token = getToken()

      if (!token) {

        throw new Error(
          "Votre session a expiré. Veuillez vous reconnecter."
        )

      }

      setTwoFactorLoading(true)

      setTwoFactorError("")

      const response = await API.post(
        "/auth/2fa/disable",
        {
          password: disablePassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!response.data?.success) {

        throw new Error(
          "Impossible de désactiver le 2FA."
        )

      }

      setTwoFactorEnabled(false)

      updateStoredUserTwoFactor(false)

      setDisablePassword("")

      setTwoFactorModal(null)

      showSavedMessage()

    }

    catch (err) {

      console.error(
        "❌ Erreur désactivation 2FA :",
        err
      )

      setTwoFactorError(
        err.response?.data?.message ||
        err.message ||
        "Impossible de désactiver le 2FA."
      )

    }

    finally {

      setTwoFactorLoading(false)

    }

  }


  // =====================================================
  // BASCULER LE 2FA
  // =====================================================

  const handleTwoFactorToggle = () => {

    setTwoFactorError("")

    if (twoFactorEnabled) {

      setDisablePassword("")

      setTwoFactorModal("disable")

      return

    }

    startTwoFactorSetup()

  }


  // =====================================================
  // FERMER MODALE 2FA
  // =====================================================

  const closeTwoFactorModal = () => {

    if (twoFactorLoading) {
      return
    }

    setTwoFactorModal(null)

    setTwoFactorError("")

    setTwoFactorCode("")

    setDisablePassword("")

    setTwoFactorQrCode("")

    setTwoFactorSecret("")

  }


  // =====================================================
  // ENREGISTRER PARAMÈTRES GÉNÉRAUX
  // =====================================================

  const saveSettings = async () => {

    const token = getToken()


    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      : {}


    const response = await API.put(
      "/settings",
      {
        ...general,
        notifications,
        appearance,
        maintenance
      },
      config
    )


    console.log(
      "💾 Paramètres enregistrés :",
      response.data
    )

  }


  // =====================================================
  // CHANGER MOT DE PASSE
  // =====================================================

  const changePassword = async () => {

    // ===================================================
    // VÉRIFICATIONS FRONTEND
    // ===================================================

    if (!security.currentPassword) {

      throw new Error(
        "Veuillez saisir votre mot de passe actuel."
      )

    }


    if (!security.newPassword) {

      throw new Error(
        "Veuillez saisir votre nouveau mot de passe."
      )

    }


    if (!security.confirmPassword) {

      throw new Error(
        "Veuillez confirmer votre nouveau mot de passe."
      )

    }


    if (security.newPassword.length < 8) {

      throw new Error(
        "Le nouveau mot de passe doit contenir au moins 8 caractères."
      )

    }


    if (
      security.newPassword !==
      security.confirmPassword
    ) {

      throw new Error(
        "Les nouveaux mots de passe ne correspondent pas."
      )

    }


    const token = getToken()


    if (!token) {

      throw new Error(
        "Votre session a expiré. Veuillez vous reconnecter."
      )

    }


    // ===================================================
    // REQUÊTE BACKEND
    // ===================================================

    const response = await API.put(
      "/settings/change-password",
      {
        currentPassword: security.currentPassword,
        newPassword: security.newPassword,
        confirmPassword: security.confirmPassword
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )


    console.log(
      "🔐 Mot de passe modifié :",
      response.data
    )


    // ===================================================
    // NETTOYAGE
    // ===================================================

    setSecurity({

      currentPassword: "",

      newPassword: "",

      confirmPassword: ""

    })


    return response.data

  }


  // =====================================================
  // ENREGISTREMENT PRINCIPAL
  // =====================================================

  const handleSave = async () => {

    try {

      setSaving(true)

      setSaved(false)

      setError("")


      // =================================================
      // SÉCURITÉ
      // =================================================

      if (activeTab === "security") {

        const response =
          await changePassword()


        showSavedMessage()


        // =================================================
        // DÉCONNEXION AUTOMATIQUE
        // =================================================

        if (response?.requiresLogin) {

          localStorage.removeItem("token")

          localStorage.removeItem("authToken")

          localStorage.removeItem("user")


          setTimeout(() => {

            window.location.href = "/"

          }, 1800)

        }


        return

      }


      // =================================================
      // AUTRES PARAMÈTRES
      // =================================================

      await saveSettings()


      showSavedMessage()

    }

    catch (err) {

      console.error(
        "❌ Erreur sauvegarde :",
        err
      )


      setError(

        err.response?.data?.message ||

        err.message ||

        "Impossible d'enregistrer les modifications."

      )

    }

    finally {

      setSaving(false)

    }

  }


  // =====================================================
  // CLASSE INPUT
  // =====================================================

  const inputClass =
    "w-full border border-gray-200 rounded-2xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"


  // =====================================================
  // CHARGEMENT
  // =====================================================

  if (loading) {

    return (

      <AdminLayout>

        <div className="flex items-center justify-center min-h-[400px]">

          <div className="text-center">

            <div className="
              w-10
              h-10
              border-4
              border-purple-600
              border-t-transparent
              rounded-full
              animate-spin
              mx-auto
              mb-4
            " />

            <p className="text-gray-500">

              Chargement des paramètres...

            </p>

          </div>

        </div>

      </AdminLayout>

    )

  }


  // =====================================================
  // INTERFACE
  // =====================================================

  return (

    <AdminLayout>


      {/* =================================================
          EN-TÊTE
      ================================================= */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">

          Paramètres

        </h1>


        <p className="text-gray-500 mt-2">

          Configurez et gérez les paramètres de votre
          plateforme SALAM CI.

        </p>

      </div>



      {/* =================================================
          CONTENEUR
      ================================================= */}

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <div className="border-b border-gray-100">

          <div className="flex gap-2 overflow-x-auto p-4">

            {tabs.map((tab) => (

              <button

                key={tab.id}

                type="button"

                onClick={() => {

                  setActiveTab(tab.id)

                  setError("")

                  setSaved(false)

                }}

                className={`
                  flex
                  items-center
                  gap-2
                  px-5
                  py-3
                  rounded-xl
                  whitespace-nowrap
                  transition

                  ${
                    activeTab === tab.id

                      ? "bg-purple-600 text-white shadow"

                      : "text-gray-600 hover:bg-gray-100"
                  }
                `}

              >

                {tab.icon}

                <span>

                  {tab.label}

                </span>

              </button>

            ))}

          </div>

        </div>



        {/* =================================================
            CONTENU
        ================================================= */}

        <div className="p-8">


          {/* =================================================
              ERREUR
          ================================================= */}

          {error && (

            <div className="
              mb-6
              bg-red-50
              border
              border-red-200
              text-red-700
              rounded-2xl
              p-4
              flex
              items-start
              gap-3
            ">

              <FaExclamationCircle className="mt-1" />

              <div>

                <p className="font-semibold">

                  Une erreur est survenue

                </p>

                <p className="mt-1">

                  {error}

                </p>

              </div>

            </div>

          )}



          {/* =================================================
              GÉNÉRAL
          ================================================= */}

          {activeTab === "general" && (

            <div>

              <SectionTitle

                title="Paramètres généraux"

                description="Les informations principales de votre plateforme."

              />


              <div className="grid md:grid-cols-2 gap-6">


                <Field label="Nom de la plateforme">

                  <input

                    type="text"

                    value={general.platformName}

                    onChange={(e) =>

                      setGeneral({

                        ...general,

                        platformName:
                          e.target.value

                      })

                    }

                    className={inputClass}

                  />

                </Field>



                <Field label="Email principal">

                  <input

                    type="email"

                    value={general.email}

                    placeholder="contact@salam-ci.com"

                    onChange={(e) =>

                      setGeneral({

                        ...general,

                        email:
                          e.target.value

                      })

                    }

                    className={inputClass}

                  />

                </Field>



                <Field label="Téléphone">

                  <input

                    type="text"

                    value={general.phone}

                    placeholder="+225 XX XX XX XX"

                    onChange={(e) =>

                      setGeneral({

                        ...general,

                        phone:
                          e.target.value

                      })

                    }

                    className={inputClass}

                  />

                </Field>



                <Field label="Adresse">

                  <input

                    type="text"

                    value={general.address}

                    placeholder="Abidjan, Côte d'Ivoire"

                    onChange={(e) =>

                      setGeneral({

                        ...general,

                        address:
                          e.target.value

                      })

                    }

                    className={inputClass}

                  />

                </Field>

              </div>



              <div className="mt-6">

                <Field label="Description">

                  <textarea

                    rows={4}

                    value={general.description}

                    onChange={(e) =>

                      setGeneral({

                        ...general,

                        description:
                          e.target.value

                      })

                    }

                    className={inputClass}

                  />

                </Field>

              </div>

            </div>

          )}



          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          {activeTab === "notifications" && (

            <div>

              <SectionTitle

                title="Notifications"

                description="Choisissez les événements pour lesquels vous souhaitez être averti."

              />


              <div className="space-y-4">

                <NotificationRow

                  title="Nouveaux utilisateurs"

                  description="Être informé lorsqu'un étudiant s'inscrit."

                  checked={
                    notifications.newUser
                  }

                  onChange={(value) =>

                    setNotifications({

                      ...notifications,

                      newUser: value

                    })

                  }

                />


                <NotificationRow

                  title="Nouveaux enseignants"

                  description="Recevoir une notification lorsqu'un enseignant rejoint la plateforme."

                  checked={
                    notifications.newTeacher
                  }

                  onChange={(value) =>

                    setNotifications({

                      ...notifications,

                      newTeacher: value

                    })

                  }

                />


                <NotificationRow

                  title="Nouveaux cours"

                  description="Être informé lorsqu'un nouveau cours est publié."

                  checked={
                    notifications.newCourse
                  }

                  onChange={(value) =>

                    setNotifications({

                      ...notifications,

                      newCourse: value

                    })

                  }

                />


                <NotificationRow

                  title="Demandes de conférence"

                  description="Recevoir les demandes de conférence des enseignants."

                  checked={
                    notifications.conferenceRequest
                  }

                  onChange={(value) =>

                    setNotifications({

                      ...notifications,

                      conferenceRequest: value

                    })

                  }

                />


                <NotificationRow

                  title="Notifications par email"

                  description="Recevoir les notifications importantes par email."

                  checked={
                    notifications.email
                  }

                  onChange={(value) =>

                    setNotifications({

                      ...notifications,

                      email: value

                    })

                  }

                />

              </div>

            </div>

          )}



          {/* =================================================
              SÉCURITÉ
          ================================================= */}

          {activeTab === "security" && (

            <div>

              <SectionTitle

                title="Sécurité"

                description="Renforcez la sécurité de votre compte administrateur."

              />


              <div className="max-w-2xl space-y-5">


                <Field label="Mot de passe actuel">

                  <input

                    type="password"

                    value={
                      security.currentPassword
                    }

                    placeholder="••••••••"

                    onChange={(e) =>

                      setSecurity({

                        ...security,

                        currentPassword:
                          e.target.value

                      })

                    }

                    className={inputClass}

                  />

                </Field>



                <Field label="Nouveau mot de passe">

                  <input

                    type="password"

                    value={
                      security.newPassword
                    }

                    placeholder="Minimum 8 caractères"

                    onChange={(e) =>

                      setSecurity({

                        ...security,

                        newPassword:
                          e.target.value

                      })

                    }

                    className={inputClass}

                  />

                </Field>



                <Field label="Confirmer le nouveau mot de passe">

                  <input

                    type="password"

                    value={
                      security.confirmPassword
                    }

                    placeholder="Retapez le nouveau mot de passe"

                    onChange={(e) =>

                      setSecurity({

                        ...security,

                        confirmPassword:
                          e.target.value

                      })

                    }

                    className={inputClass}

                  />

                </Field>



                {/* =================================================
                    2FA
                ================================================= */}

                <div className="
                  flex
                  items-center
                  justify-between
                  gap-6
                  p-5
                  border
                  border-gray-100
                  rounded-2xl
                  bg-gray-50
                ">

                  <div className="flex items-start gap-4">

                    <div className="
                      w-11
                      h-11
                      rounded-xl
                      bg-purple-100
                      text-purple-600
                      flex
                      items-center
                      justify-center
                      flex-shrink-0
                    ">

                      <FaShieldAlt />

                    </div>

                    <div>

                      <div className="flex items-center gap-2">

                        <p className="font-semibold text-gray-800">

                          Authentification à deux facteurs

                        </p>

                        <span className={`
                          text-xs
                          font-semibold
                          px-2
                          py-1
                          rounded-full
                          ${
                            twoFactorEnabled
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-600"
                          }
                        `}>

                          {twoFactorEnabled
                            ? "Activée"
                            : "Désactivée"
                          }

                        </span>

                      </div>

                      <p className="text-sm text-gray-500 mt-1">

                        {twoFactorEnabled

                          ? "Votre compte demande un code de sécurité lors de la connexion."

                          : "Protégez votre compte avec un code à 6 chiffres généré par une application d'authentification."
                        }

                      </p>

                    </div>

                  </div>


                  <button

                    type="button"

                    onClick={handleTwoFactorToggle}

                    disabled={twoFactorLoading}

                    aria-pressed={twoFactorEnabled}

                    className={`
                      relative
                      flex-shrink-0
                      w-12
                      h-6
                      rounded-full
                      transition
                      ${
                        twoFactorEnabled
                          ? "bg-purple-600"
                          : "bg-gray-300"
                      }
                      ${
                        twoFactorLoading
                          ? "opacity-60 cursor-not-allowed"
                          : ""
                      }
                    `}

                  >

                    <span className={`
                      absolute
                      top-1
                      w-4
                      h-4
                      bg-white
                      rounded-full
                      shadow
                      transition
                      ${
                        twoFactorEnabled
                          ? "left-7"
                          : "left-1"
                      }
                    `} />

                  </button>

                </div>

              </div>

            </div>

          )}



          {/* =================================================
              APPARENCE
          ================================================= */}

          {activeTab === "appearance" && (

            <div>

              <SectionTitle

                title="Apparence"

                description="Personnalisez l'apparence de votre espace administrateur."

              />


              <div className="max-w-2xl space-y-6">


                <div>

                  <label className="block font-medium mb-3">

                    Thème

                  </label>


                  <div className="grid grid-cols-3 gap-4">

                    {[
                      ["light", "Clair"],
                      ["dark", "Sombre"],
                      ["system", "Système"]
                    ].map(([value, label]) => (

                      <button

                        key={value}

                        type="button"

                        onClick={() => {

                          setAppearance({
                        
                            ...appearance,
                        
                            theme: value
                        
                          })
                        
                          saveTheme(value)
                        
                        }}

                        className={`
                          p-4
                          rounded-2xl
                          border-2
                          transition

                          ${
                            appearance.theme === value

                              ? "border-purple-600 bg-purple-50 text-purple-700"

                              : "border-gray-200 hover:border-gray-300"
                          }
                        `}

                      >

                        {label}

                      </button>

                    ))}

                  </div>

                </div>



                <NotificationRow

                  title="Animations"

                  description="Activer les animations et transitions de l'interface."

                  checked={
                    appearance.animations
                  }

                  onChange={(value) =>

                    setAppearance({

                      ...appearance,

                      animations: value

                    })

                  }

                />

              </div>

            </div>

          )}



          {/* =================================================
              MAINTENANCE
          ================================================= */}

          {activeTab === "maintenance" && (

            <div>

              <SectionTitle

                title="Maintenance"

                description="Contrôlez l'état général de la plateforme."

              />


              <div className="max-w-3xl space-y-6">


                <NotificationRow

                  title="Mode maintenance"

                  description="Empêcher temporairement les utilisateurs d'accéder à la plateforme."

                  checked={
                    maintenance.enabled
                  }

                  onChange={(value) =>

                    setMaintenance({

                      ...maintenance,

                      enabled: value

                    })

                  }

                />


                <Field label="Message de maintenance">

                  <textarea

                    rows={5}

                    value={
                      maintenance.message
                    }

                    onChange={(e) =>

                      setMaintenance({

                        ...maintenance,

                        message:
                          e.target.value

                      })

                    }

                    className={inputClass}

                  />

                </Field>

              </div>

            </div>

          )}



          {/* =================================================
              BARRE ENREGISTREMENT
          ================================================= */}

          <div className="
            mt-10
            pt-6
            border-t
            border-gray-100
            flex
            items-center
            justify-between
            gap-4
          ">


            <div>

              {saved && (

                <div className="
                  flex
                  items-center
                  gap-2
                  text-green-600
                  font-medium
                ">

                  <FaCheckCircle />

                  <span>

                    {activeTab === "security"

                      ? "Mot de passe modifié avec succès."

                      : "Paramètres enregistrés avec succès."
                    }

                  </span>

                </div>

              )}

            </div>



            <button

              type="button"

              onClick={handleSave}

              disabled={saving}

              className="
                flex
                items-center
                gap-2
                bg-gradient-to-r
                from-purple-600
                to-indigo-600
                hover:from-purple-700
                hover:to-indigo-700
                disabled:opacity-60
                disabled:cursor-not-allowed
                text-white
                px-7
                py-3.5
                rounded-2xl
                font-semibold
                shadow-md
                transition
              "

            >

              <FaSave />

              {saving

                ? "Enregistrement..."

                : activeTab === "security"

                  ? "Modifier le mot de passe"

                  : "Enregistrer les modifications"

              }

            </button>

          </div>

        </div>

      </div>


      {/* =================================================
          MODALE 2FA
      ================================================= */}

      {twoFactorModal && (

        <div className="
          fixed
          inset-0
          z-50
          bg-black/50
          backdrop-blur-sm
          flex
          items-center
          justify-center
          p-4
        ">

          <div className="
            w-full
            max-w-lg
            bg-white
            rounded-3xl
            shadow-2xl
            overflow-hidden
          ">

            <div className="
              flex
              items-center
              justify-between
              px-6
              py-5
              border-b
              border-gray-100
            ">

              <div className="flex items-center gap-3">

                <div className="
                  w-10
                  h-10
                  rounded-xl
                  bg-purple-100
                  text-purple-600
                  flex
                  items-center
                  justify-center
                ">

                  {twoFactorModal === "setup"
                    ? <FaQrcode />
                    : <FaLock />
                  }

                </div>

                <div>

                  <h3 className="text-xl font-bold">

                    {twoFactorModal === "setup"
                      ? "Activer le 2FA"
                      : "Désactiver le 2FA"
                    }

                  </h3>

                  <p className="text-sm text-gray-500">

                    {twoFactorModal === "setup"
                      ? "Sécurisez votre compte administrateur."
                      : "Confirmez votre identité pour continuer."
                    }

                  </p>

                </div>

              </div>


              <button

                type="button"

                onClick={closeTwoFactorModal}

                disabled={twoFactorLoading}

                className="
                  w-9
                  h-9
                  rounded-xl
                  text-gray-500
                  hover:bg-gray-100
                  flex
                  items-center
                  justify-center
                  disabled:opacity-50
                "

              >

                <FaTimes />

              </button>

            </div>


            <div className="p-6">


              {twoFactorError && (

                <div className="
                  mb-5
                  bg-red-50
                  border
                  border-red-200
                  text-red-700
                  rounded-2xl
                  p-4
                  text-sm
                ">

                  {twoFactorError}

                </div>

              )}


              {twoFactorModal === "setup" && (

                <div>

                  <div className="
                    bg-purple-50
                    rounded-2xl
                    p-4
                    text-sm
                    text-purple-800
                    mb-5
                  ">

                    Scannez le QR Code avec Google Authenticator,
                    Microsoft Authenticator ou une application
                    compatible TOTP.

                  </div>


                  {twoFactorQrCode && (

                    <div className="
                      flex
                      justify-center
                      mb-5
                    ">

                      <div className="
                        bg-white
                        p-4
                        rounded-2xl
                        border
                        border-gray-200
                        shadow-sm
                      ">

                        <img
                          src={twoFactorQrCode}
                          alt="QR Code pour activer le 2FA"
                          className="w-56 h-56"
                        />

                      </div>

                    </div>

                  )}


                  {twoFactorSecret && (

                    <div className="mb-5">

                      <p className="
                        text-xs
                        font-semibold
                        text-gray-500
                        mb-2
                      ">

                        Clé de configuration manuelle

                      </p>

                      <div className="
                        bg-gray-100
                        rounded-xl
                        p-3
                        text-xs
                        font-mono
                        break-all
                        select-all
                      ">

                        {twoFactorSecret}

                      </div>

                    </div>

                  )}


                  <Field label="Code de vérification à 6 chiffres">

                    <input

                      type="text"

                      inputMode="numeric"

                      autoComplete="one-time-code"

                      maxLength={6}

                      value={twoFactorCode}

                      onChange={(e) =>

                        setTwoFactorCode(
                          e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6)
                        )

                      }

                      placeholder="000000"

                      className={`
                        ${inputClass}
                        text-center
                        text-2xl
                        tracking-[0.4em]
                        font-semibold
                      `}

                    />

                  </Field>


                  <button

                    type="button"

                    onClick={verifyTwoFactorSetup}

                    disabled={
                      twoFactorLoading ||
                      twoFactorCode.length !== 6
                    }

                    className="
                      w-full
                      mt-5
                      bg-gradient-to-r
                      from-purple-600
                      to-indigo-600
                      hover:from-purple-700
                      hover:to-indigo-700
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                      text-white
                      py-3.5
                      rounded-2xl
                      font-semibold
                      transition
                    "

                  >

                    {twoFactorLoading
                      ? "Vérification..."
                      : "Activer le 2FA"
                    }

                  </button>

                </div>

              )}


              {twoFactorModal === "disable" && (

                <div>

                  <div className="
                    bg-orange-50
                    border
                    border-orange-100
                    rounded-2xl
                    p-4
                    text-sm
                    text-orange-800
                    mb-5
                  ">

                    La désactivation du 2FA nécessite votre
                    mot de passe actuel.

                  </div>


                  <Field label="Mot de passe actuel">

                    <input

                      type="password"

                      value={disablePassword}

                      onChange={(e) =>
                        setDisablePassword(e.target.value)
                      }

                      placeholder="Votre mot de passe"

                      className={inputClass}

                      autoFocus

                    />

                  </Field>


                  <button

                    type="button"

                    onClick={disableTwoFactor}

                    disabled={
                      twoFactorLoading ||
                      !disablePassword
                    }

                    className="
                      w-full
                      mt-5
                      bg-red-600
                      hover:bg-red-700
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                      text-white
                      py-3.5
                      rounded-2xl
                      font-semibold
                      transition
                    "

                  >

                    {twoFactorLoading
                      ? "Désactivation..."
                      : "Désactiver le 2FA"
                    }

                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </AdminLayout>

  )

}


// =====================================================
// TITRE SECTION
// =====================================================

function SectionTitle({
  title,
  description
}) {

  return (

    <div className="mb-8">

      <h2 className="text-2xl font-bold">

        {title}

      </h2>

      <p className="text-gray-500 mt-1">

        {description}

      </p>

    </div>

  )

}


// =====================================================
// CHAMP
// =====================================================

function Field({
  label,
  children
}) {

  return (

    <div>

      <label className="
        block
        text-sm
        font-semibold
        text-gray-700
        mb-2
      ">

        {label}

      </label>

      {children}

    </div>

  )

}


// =====================================================
// LIGNE AVEC SWITCH
// =====================================================

function NotificationRow({
  title,
  description,
  checked,
  onChange
}) {

  return (

    <div className="
      flex
      items-center
      justify-between
      gap-6
      p-5
      border
      border-gray-100
      rounded-2xl
      hover:bg-gray-50
      transition
    ">

      <div>

        <p className="font-semibold text-gray-800">

          {title}

        </p>

        <p className="text-sm text-gray-500 mt-1">

          {description}

        </p>

      </div>


      <button

        type="button"

        onClick={() => onChange(!checked)}

        aria-pressed={checked}

        className={`
          relative
          flex-shrink-0
          w-12
          h-6
          rounded-full
          transition

          ${
            checked

              ? "bg-purple-600"

              : "bg-gray-300"
          }
        `}

      >

        <span

          className={`
            absolute
            top-1
            w-4
            h-4
            bg-white
            rounded-full
            shadow
            transition

            ${
              checked

                ? "left-7"

                : "left-1"
            }
          `}

        />

      </button>

    </div>

  )

}


export default Settings