import { useEffect, useRef, useState } from "react"
import TeacherLayout from "../../layouts/TeacherLayout"
import API from "../../services/api"
import {
  successToast,
  errorToast
} from "../../utils/toast"

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaCamera,
  FaLock,
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaKey,
  FaMobileAlt
} from "react-icons/fa"

function Profile() {

  // =====================================================
  // UTILISATEUR
  // =====================================================

  const [user, setUser] = useState(() => {

    try {

      return JSON.parse(
        localStorage.getItem("user")
      )

    } catch {

      return null

    }

  })

  // =====================================================
  // PROFIL
  // =====================================================

  const [name, setName] =
    useState(user?.name || "")

  const [email, setEmail] =
    useState(user?.email || "")

  const [phone, setPhone] =
    useState(user?.phone || "")

  const [specialty, setSpecialty] =
    useState(user?.specialty || "")

  const [profileImage, setProfileImage] =
    useState(user?.profileImage || null)

  const [selectedImage, setSelectedImage] =
    useState(null)

  const fileInputRef = useRef(null)

  // =====================================================
  // ETATS
  // =====================================================

  const [loadingProfile, setLoadingProfile] =
    useState(true)

  const [savingProfile, setSavingProfile] =
    useState(false)

  // =====================================================
  // MOT DE PASSE
  // =====================================================

  const [currentPassword, setCurrentPassword] =
    useState("")

  const [newPassword, setNewPassword] =
    useState("")

  const [confirmPassword, setConfirmPassword] =
    useState("")

  const [changingPassword, setChangingPassword] =
    useState(false)

  // =====================================================
  // 2FA
  // =====================================================

  const [twoFactorEnabled, setTwoFactorEnabled] =
    useState(user?.twoFactorEnabled || false)

  const [showTwoFactorSetup, setShowTwoFactorSetup] =
    useState(false)

  const [qrCode, setQrCode] =
    useState("")

  const [twoFactorSecret, setTwoFactorSecret] =
    useState("")

  const [twoFactorCode, setTwoFactorCode] =
    useState("")

  const [loadingTwoFactor, setLoadingTwoFactor] =
    useState(false)

  const [verifyingTwoFactor, setVerifyingTwoFactor] =
    useState(false)

  const [disablingTwoFactor, setDisablingTwoFactor] =
    useState(false)

  const [disablePassword, setDisablePassword] =
    useState("")

  // =====================================================
  // CHARGER LE PROFIL DEPUIS LE BACKEND
  // =====================================================

  useEffect(() => {

    const loadProfile = async () => {

      try {

        const response =
          await API.get("/users/profile")

        const backendUser =
          response.data?.user

        if (backendUser) {

          setUser(backendUser)

          setName(backendUser.name || "")

          setEmail(backendUser.email || "")

          setPhone(backendUser.phone || "")

          setSpecialty(
            backendUser.specialty || ""
          )

          setProfileImage(
            backendUser.profileImage || null
          )

          setTwoFactorEnabled(
            backendUser.twoFactorEnabled || false
          )

          localStorage.setItem(
            "user",
            JSON.stringify(backendUser)
          )

        }

      }

      catch (error) {

        console.error(
          "Erreur chargement profil :",
          error
        )

      }

      finally {

        setLoadingProfile(false)

      }

    }

    loadProfile()

  }, [])

  // =====================================================
  // CHOISIR UNE PHOTO
  // =====================================================

  const handleImageChange = (event) => {

    const file =
      event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith("image/")) {

      errorToast(
        "Veuillez sélectionner une image."
      )

      return

    }

    if (file.size > 5 * 1024 * 1024) {

      errorToast(
        "L'image ne doit pas dépasser 5 Mo."
      )

      return

    }

    setSelectedImage(file)

    setProfileImage(
      URL.createObjectURL(file)
    )

  }

  // =====================================================
  // ENREGISTRER PROFIL
  // =====================================================

  const handleSaveProfile = async () => {

    try {

      setSavingProfile(true)

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

      formData.append(
        "phone",
        phone
      )

      formData.append(
        "specialty",
        specialty
      )

      if (selectedImage) {

        formData.append(
          "profileImage",
          selectedImage
        )

      }

      const response =
        await API.put(
          "/users/profile",
          formData
        )

      const updatedUser =
        response.data?.user

      if (updatedUser) {

        setUser(updatedUser)

        setName(updatedUser.name || "")

        setEmail(updatedUser.email || "")

        setPhone(updatedUser.phone || "")

        setSpecialty(
          updatedUser.specialty || ""
        )

        setProfileImage(
          updatedUser.profileImage || null
        )

        setSelectedImage(null)

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        )

      }

      successToast(
        "Profil enregistré avec succès."
      )

    }

    catch (error) {

      console.error(
        "Erreur modification profil :",
        error
      )

    errorToast(
      error.response?.data?.message ||
      "Impossible d'enregistrer le profil."
    )

    }

    finally {

      setSavingProfile(false)

    }

  }

  // =====================================================
  // CHANGER MOT DE PASSE
  // =====================================================

  const handleChangePassword = async () => {

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {

      errorToast(
        "Veuillez remplir tous les champs."
      )

      return

    }

    if (newPassword !== confirmPassword) {

      errorToast(
        "Les nouveaux mots de passe ne correspondent pas."
      )

      return

    }

    if (newPassword.length < 6) {

      errorToast(
        "Le nouveau mot de passe doit contenir au moins 6 caractères."
      )

      return

    }

    try {

      setChangingPassword(true)

      const response =
        await API.put(
          "/users/profile/password",
          {
            currentPassword,
            newPassword
          }
        )

        successToast(
          response.data?.message ||
          "Mot de passe modifié avec succès."
        )

      setCurrentPassword("")

      setNewPassword("")

      setConfirmPassword("")

    }

    catch (error) {

      console.error(
        "Erreur changement mot de passe :",
        error
      )

      errorToast(
        error.response?.data?.message ||
        "Impossible de modifier le mot de passe."
      )

    }

    finally {

      setChangingPassword(false)

    }

  }

  // =====================================================
  // CONFIGURER 2FA
  // =====================================================

  const handleSetupTwoFactor = async () => {

    try {

      setLoadingTwoFactor(true)

      const response =
        await API.get(
          "/auth/2fa/setup"
        )

      setQrCode(
        response.data?.qrCode || ""
      )

      setTwoFactorSecret(
        response.data?.secret || ""
      )

      setTwoFactorCode("")

      setShowTwoFactorSetup(true)

    }

    catch (error) {

      console.error(
        "Erreur configuration 2FA :",
        error
      )

      errorToast(
        error.response?.data?.message ||
        "Impossible de configurer le 2FA."
      )

    }

    finally {

      setLoadingTwoFactor(false)

    }

  }

  // =====================================================
  // VÉRIFIER ACTIVATION 2FA
  // =====================================================

  const handleVerifyTwoFactor = async () => {

    if (
      !twoFactorCode ||
      twoFactorCode.length !== 6
    ) {

      errorToast(
        "Veuillez entrer le code à 6 chiffres."
      )

      return

    }

    try {

      setVerifyingTwoFactor(true)

      const response =
        await API.post(
          "/auth/2fa/verify-setup",
          {
            token: twoFactorCode
          }
        )

      setTwoFactorEnabled(true)

      const updatedUser = {

        ...user,

        twoFactorEnabled: true

      }

      setUser(updatedUser)

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      )

      setShowTwoFactorSetup(false)

      setQrCode("")

      setTwoFactorSecret("")

      setTwoFactorCode("")

      successToast(
        response.data?.message ||
        "Authentification à deux facteurs activée."
      )

    }

    catch (error) {

      console.error(
        "Erreur vérification 2FA :",
        error
      )

      errorToast(
        error.response?.data?.message ||
        "Code 2FA incorrect."
      )

    }

    finally {

      setVerifyingTwoFactor(false)

    }

  }

  // =====================================================
  // DÉSACTIVER 2FA
  // =====================================================

  const handleDisableTwoFactor = async () => {

    if (!disablePassword) {

      errorToast(
        "Veuillez saisir votre mot de passe."
      )

      return

    }

    try {

      setDisablingTwoFactor(true)

      const response =
        await API.post(
          "/auth/2fa/disable",
          {
            password: disablePassword
          }
        )

      setTwoFactorEnabled(false)

      const updatedUser = {

        ...user,

        twoFactorEnabled: false

      }

      setUser(updatedUser)

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      )

      setDisablePassword("")

      successToast(
        response.data?.message ||
        "Authentification à deux facteurs désactivée."
      )

    }

    catch (error) {

      console.error(
        "Erreur désactivation 2FA :",
        error
      )

      errorToast(
        error.response?.data?.message ||
        "Impossible de désactiver le 2FA."
      )

    }

    finally {

      setDisablingTwoFactor(false)

    }

  }

  // =====================================================
  // INITIAL
  // =====================================================

  const initial =
    name?.charAt(0)?.toUpperCase() || "E"

  // =====================================================
  // AFFICHAGE
  // =====================================================

  return (

    <TeacherLayout>

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-10">

        <div className="flex items-center gap-4">

          <div className="
            w-14
            h-14
            rounded-2xl
            bg-purple-100
            text-purple-600
            flex
            items-center
            justify-center
            text-2xl
          ">

            <FaUser />

          </div>

          <div>

            <h1 className="
              text-4xl
              md:text-5xl
              font-bold
              text-gray-900
            ">

              Mon Profil

            </h1>

            <p className="text-gray-500 mt-2">

              Gérez vos informations personnelles
              et la sécurité de votre compte.

            </p>

          </div>

        </div>

      </div>


      {loadingProfile ? (

        <div className="
          bg-white
          rounded-3xl
          p-12
          shadow-sm
          flex
          justify-center
          items-center
        ">

          <FaSpinner className="
            animate-spin
            text-purple-600
            text-3xl
          " />

        </div>

      ) : (

        <>

          {/* =================================================
              PROFIL
          ================================================= */}

          <div className="
            grid
            lg:grid-cols-3
            gap-8
          ">

            {/* CARTE PROFIL */}

            <div className="
              bg-white
              rounded-3xl
              shadow-sm
              border
              border-gray-100
              p-8
            ">

              <div className="
                flex
                flex-col
                items-center
                text-center
              ">

                <div className="relative">

                  {profileImage ? (

                    <img
                      src={profileImage}
                      alt="Profil"
                      className="
                        w-36
                        h-36
                        rounded-full
                        object-cover
                        border-4
                        border-purple-100
                      "
                    />

                  ) : (

                    <div className="
                      w-36
                      h-36
                      rounded-full
                      bg-gradient-to-br
                      from-purple-600
                      to-indigo-600
                      flex
                      items-center
                      justify-center
                      text-white
                      text-5xl
                      font-bold
                    ">

                      {initial}

                    </div>

                  )}

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="
                      absolute
                      bottom-1
                      right-1
                      w-12
                      h-12
                      rounded-full
                      bg-purple-600
                      hover:bg-purple-700
                      text-white
                      flex
                      items-center
                      justify-center
                      shadow-lg
                      transition
                    "
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
                  text-gray-900
                ">

                  {name || "Enseignant"}

                </h2>

                <p className="text-gray-500 mt-2">

                  Enseignant SALAM CI

                </p>

                <div className="
                  mt-5
                  px-4
                  py-2
                  rounded-full
                  bg-green-50
                  text-green-600
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-medium
                ">

                  <FaCheckCircle />

                  Compte actif

                </div>

              </div>

            </div>


            {/* INFORMATIONS */}

            <div className="
              lg:col-span-2
              bg-white
              rounded-3xl
              shadow-sm
              border
              border-gray-100
              p-8
            ">

              <div className="mb-8">

                <h2 className="
                  text-2xl
                  font-bold
                  text-gray-900
                ">

                  Informations personnelles

                </h2>

                <p className="
                  text-gray-500
                  mt-2
                ">

                  Ces informations apparaissent sur votre profil.

                </p>

              </div>

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
                    text-sm
                    font-semibold
                    text-gray-700
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
                        border-gray-200
                        rounded-2xl
                        p-4
                        pl-11
                        outline-none
                        focus:border-purple-500
                        focus:ring-2
                        focus:ring-purple-100
                      "
                    />

                  </div>

                </div>


                {/* EMAIL */}

                <div>

                  <label className="
                    block
                    mb-2
                    text-sm
                    font-semibold
                    text-gray-700
                  ">

                    Adresse email

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
                        border-gray-200
                        rounded-2xl
                        p-4
                        pl-11
                        outline-none
                        focus:border-purple-500
                        focus:ring-2
                        focus:ring-purple-100
                      "
                    />

                  </div>

                </div>


                {/* TELEPHONE */}

                <div>

                  <label className="
                    block
                    mb-2
                    text-sm
                    font-semibold
                    text-gray-700
                  ">

                    Téléphone

                  </label>

                  <div className="relative">

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
                      onChange={(e) =>
                        setPhone(e.target.value)
                      }
                      placeholder="+225 XX XX XX XX XX"
                      className="
                        w-full
                        border
                        border-gray-200
                        rounded-2xl
                        p-4
                        pl-11
                        outline-none
                        focus:border-purple-500
                        focus:ring-2
                        focus:ring-purple-100
                      "
                    />

                  </div>

                </div>


                {/* SPECIALITE */}

                <div>

                  <label className="
                    block
                    mb-2
                    text-sm
                    font-semibold
                    text-gray-700
                  ">

                    Spécialité

                  </label>

                  <div className="relative">

                    <FaGraduationCap className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    " />

                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) =>
                        setSpecialty(e.target.value)
                      }
                      placeholder="Ex : Informatique"
                      className="
                        w-full
                        border
                        border-gray-200
                        rounded-2xl
                        p-4
                        pl-11
                        outline-none
                        focus:border-purple-500
                        focus:ring-2
                        focus:ring-purple-100
                      "
                    />

                  </div>

                </div>

              </div>


              <div className="
                mt-8
                flex
                justify-end
              ">

                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="
                    px-7
                    py-3.5
                    rounded-2xl
                    bg-gradient-to-r
                    from-purple-600
                    to-indigo-600
                    hover:from-purple-700
                    hover:to-indigo-700
                    text-white
                    font-semibold
                    shadow-lg
                    shadow-purple-200
                    transition
                    disabled:opacity-60
                    flex
                    items-center
                    gap-2
                  "
                >

                  {savingProfile ? (

                    <>
                      <FaSpinner className="animate-spin" />
                      Enregistrement...
                    </>

                  ) : (

                    "Enregistrer les modifications"

                  )}

                </button>

              </div>

            </div>

          </div>


          {/* =================================================
              MOT DE PASSE
          ================================================= */}

          <div className="
            grid
            lg:grid-cols-3
            gap-8
            mt-8
          ">

            <div className="
              bg-gradient-to-br
              from-purple-600
              to-indigo-700
              text-white
              rounded-3xl
              p-8
              shadow-lg
            ">

              <div className="
                w-14
                h-14
                rounded-2xl
                bg-white/20
                flex
                items-center
                justify-center
                text-2xl
              ">

                <FaLock />

              </div>

              <h2 className="
                text-2xl
                font-bold
                mt-6
              ">

                Sécurité

              </h2>

              <p className="
                text-purple-100
                mt-3
                leading-relaxed
              ">

                Modifiez régulièrement votre
                mot de passe pour protéger votre compte.

              </p>

            </div>


            <div className="
              lg:col-span-2
              bg-white
              rounded-3xl
              shadow-sm
              border
              border-gray-100
              p-8
            ">

              <div className="
                grid
                md:grid-cols-2
                gap-5
              ">

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(e.target.value)
                  }
                  placeholder="Mot de passe actuel"
                  className="
                    border
                    border-gray-200
                    rounded-2xl
                    p-4
                    outline-none
                    focus:border-purple-500
                    focus:ring-2
                    focus:ring-purple-100
                  "
                />

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  placeholder="Nouveau mot de passe"
                  className="
                    border
                    border-gray-200
                    rounded-2xl
                    p-4
                    outline-none
                    focus:border-purple-500
                    focus:ring-2
                    focus:ring-purple-100
                  "
                />

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirmer le nouveau mot de passe"
                  className="
                    md:col-span-2
                    border
                    border-gray-200
                    rounded-2xl
                    p-4
                    outline-none
                    focus:border-purple-500
                    focus:ring-2
                    focus:ring-purple-100
                  "
                />

              </div>

              <button
                type="button"
                onClick={handleChangePassword}
                disabled={changingPassword}
                className="
                  mt-6
                  px-7
                  py-3.5
                  rounded-2xl
                  bg-gray-900
                  hover:bg-gray-800
                  text-white
                  font-semibold
                  transition
                  disabled:opacity-60
                  flex
                  items-center
                  gap-2
                "
              >

                {changingPassword ? (

                  <>
                    <FaSpinner className="animate-spin" />
                    Modification...
                  </>

                ) : (

                  <>
                    <FaKey />
                    Modifier le mot de passe
                  </>

                )}

              </button>

            </div>

          </div>


          {/* =================================================
              2FA
          ================================================= */}

          <div className="
            bg-white
            rounded-3xl
            shadow-sm
            border
            border-gray-100
            p-8
            mt-8
          ">

            <div className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-6
            ">

              <div className="flex gap-5">

                <div className="
                  w-14
                  h-14
                  shrink-0
                  rounded-2xl
                  bg-purple-100
                  text-purple-600
                  flex
                  items-center
                  justify-center
                  text-2xl
                ">

                  <FaShieldAlt />

                </div>

                <div>

                  <div className="
                    flex
                    items-center
                    gap-3
                    flex-wrap
                  ">

                    <h2 className="
                      text-2xl
                      font-bold
                      text-gray-900
                    ">

                      Authentification à deux facteurs

                    </h2>

                    {twoFactorEnabled ? (

                      <span className="
                        px-3
                        py-1
                        rounded-full
                        bg-green-50
                        text-green-600
                        text-sm
                        font-semibold
                        flex
                        items-center
                        gap-1
                      ">

                        <FaCheckCircle />

                        Activée

                      </span>

                    ) : (

                      <span className="
                        px-3
                        py-1
                        rounded-full
                        bg-orange-50
                        text-orange-600
                        text-sm
                        font-semibold
                      ">

                        Désactivée

                      </span>

                    )}

                  </div>

                  <p className="
                    text-gray-500
                    mt-2
                    max-w-2xl
                  ">

                    Ajoutez une couche de sécurité
                    supplémentaire à votre compte avec
                    une application d'authentification.

                  </p>

                </div>

              </div>

              {!twoFactorEnabled && (

                <button
                  type="button"
                  onClick={handleSetupTwoFactor}
                  disabled={loadingTwoFactor}
                  className="
                    px-6
                    py-3
                    rounded-2xl
                    bg-purple-600
                    hover:bg-purple-700
                    text-white
                    font-semibold
                    transition
                    disabled:opacity-60
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >

                  {loadingTwoFactor ? (

                    <>
                      <FaSpinner className="animate-spin" />
                      Préparation...
                    </>

                  ) : (

                    <>
                      <FaMobileAlt />
                      Activer le 2FA
                    </>

                  )}

                </button>

              )}

            </div>


            {/* DESACTIVATION */}

            {twoFactorEnabled && (

              <div className="
                mt-8
                border-t
                pt-8
              ">

                <h3 className="
                  font-semibold
                  text-gray-900
                ">

                  Désactiver l'authentification à deux facteurs

                </h3>

                <div className="
                  flex
                  flex-col
                  md:flex-row
                  gap-4
                  mt-4
                ">

                  <input
                    type="password"
                    value={disablePassword}
                    onChange={(e) =>
                      setDisablePassword(e.target.value)
                    }
                    placeholder="Votre mot de passe"
                    className="
                      flex-1
                      border
                      border-gray-200
                      rounded-2xl
                      p-4
                      outline-none
                      focus:border-red-400
                    "
                  />

                  <button
                    type="button"
                    onClick={handleDisableTwoFactor}
                    disabled={disablingTwoFactor}
                    className="
                      px-6
                      py-3
                      rounded-2xl
                      bg-red-50
                      text-red-600
                      hover:bg-red-100
                      font-semibold
                      transition
                      disabled:opacity-60
                    "
                  >

                    {disablingTwoFactor
                      ? "Désactivation..."
                      : "Désactiver le 2FA"}

                  </button>

                </div>

              </div>

            )}

          </div>


          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <div className="
            bg-white
            rounded-3xl
            shadow-sm
            border
            border-gray-100
            p-8
            mt-8
          ">

            <div className="mb-6">

              <h2 className="
                text-2xl
                font-bold
              ">

                Notifications

              </h2>

              <p className="
                text-gray-500
                mt-2
              ">

                Choisissez les notifications que vous souhaitez recevoir.

              </p>

            </div>

            <div className="
              grid
              md:grid-cols-3
              gap-4
            ">

              {[
                "Nouvelles inscriptions",
                "Messages des étudiants",
                "Rappels des conférences"
              ].map((item) => (

                <label
                  key={item}
                  className="
                    flex
                    items-center
                    gap-3
                    p-4
                    rounded-2xl
                    border
                    border-gray-100
                    hover:bg-gray-50
                    cursor-pointer
                  "
                >

                  <input
                    type="checkbox"
                    defaultChecked
                    className="
                      w-5
                      h-5
                      accent-purple-600
                    "
                  />

                  <span className="
                    text-sm
                    font-medium
                    text-gray-700
                  ">

                    {item}

                  </span>

                </label>

              ))}

            </div>

          </div>

        </>

      )}


      {/* =====================================================
          MODAL CONFIGURATION 2FA
      ===================================================== */}

      {showTwoFactorSetup && (

        <div className="
          fixed
          inset-0
          z-50
          bg-black/50
          flex
          items-center
          justify-center
          p-4
        ">

          <div className="
            bg-white
            rounded-3xl
            shadow-2xl
            w-full
            max-w-lg
            max-h-[90vh]
            overflow-y-auto
            p-8
          ">

            <div className="
              flex
              items-start
              justify-between
              gap-4
            ">

              <div>

                <div className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-purple-100
                  text-purple-600
                  flex
                  items-center
                  justify-center
                  text-xl
                ">

                  <FaShieldAlt />

                </div>

                <h2 className="
                  text-2xl
                  font-bold
                  mt-5
                ">

                  Configurer le 2FA

                </h2>

                <p className="
                  text-gray-500
                  mt-2
                ">

                  Scannez le QR Code avec votre
                  application d'authentification.

                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowTwoFactorSetup(false)
                }
                className="
                  text-gray-400
                  hover:text-gray-700
                  text-xl
                "
              >

                <FaTimesCircle />

              </button>

            </div>


            {/* QR CODE */}

            {qrCode && (

              <div className="
                mt-8
                flex
                flex-col
                items-center
              ">

                <div className="
                  p-4
                  border
                  border-gray-200
                  rounded-2xl
                  bg-white
                ">

                  <img
                    src={qrCode}
                    alt="QR Code 2FA"
                    className="
                      w-56
                      h-56
                    "
                  />

                </div>

                <p className="
                  text-sm
                  text-gray-500
                  text-center
                  mt-5
                ">

                  Utilisez Google Authenticator,
                  Microsoft Authenticator ou Authy.

                </p>

              </div>

            )}


            {/* SECRET */}

            {twoFactorSecret && (

              <div className="
                mt-6
                bg-gray-50
                rounded-2xl
                p-4
              ">

                <p className="
                  text-xs
                  text-gray-500
                  mb-2
                ">

                  Clé de configuration manuelle

                </p>

                <p className="
                  font-mono
                  text-sm
                  break-all
                  text-gray-800
                ">

                  {twoFactorSecret}

                </p>

              </div>

            )}


            {/* CODE */}

            <div className="mt-6">

              <label className="
                block
                mb-2
                text-sm
                font-semibold
              ">

                Code à 6 chiffres

              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) =>
                  setTwoFactorCode(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
                placeholder="000000"
                className="
                  w-full
                  border
                  border-gray-200
                  rounded-2xl
                  p-4
                  text-center
                  text-2xl
                  tracking-[0.5em]
                  font-semibold
                  outline-none
                  focus:border-purple-500
                  focus:ring-2
                  focus:ring-purple-100
                "
              />

            </div>


            <button
              type="button"
              onClick={handleVerifyTwoFactor}
              disabled={
                verifyingTwoFactor ||
                twoFactorCode.length !== 6
              }
              className="
                w-full
                mt-6
                py-4
                rounded-2xl
                bg-gradient-to-r
                from-purple-600
                to-indigo-600
                text-white
                font-semibold
                disabled:opacity-50
                flex
                items-center
                justify-center
                gap-2
              "
            >

              {verifyingTwoFactor ? (

                <>
                  <FaSpinner className="animate-spin" />
                  Vérification...
                </>

              ) : (

                <>
                  <FaCheckCircle />
                  Vérifier et activer
                </>

              )}

            </button>

          </div>

        </div>

      )}

    </TeacherLayout>

  )

}

export default Profile