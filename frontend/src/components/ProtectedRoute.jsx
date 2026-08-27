import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"

import API from "../services/api"

// =========================
// PROTECTED ROUTE
// =========================
function ProtectedRoute({ children }) {

  const location = useLocation()

  const [checking, setChecking] = useState(true)
  const [maintenance, setMaintenance] = useState(false)

  // =========================
  // RÉCUPÉRATION UTILISATEUR
  // =========================

  const token = localStorage.getItem("token")

  let user = null

  try {

    user = JSON.parse(
      localStorage.getItem("user")
    )

  } catch {

    user = null

  }

  // =========================
  // VÉRIFICATION MAINTENANCE
  // =========================

  useEffect(() => {

    let mounted = true

    const checkMaintenance = async () => {

      try {

        // =====================================
        // PAS DE TOKEN / UTILISATEUR
        // =====================================

        if (!token || !user) {

          if (mounted) {

            setChecking(false)

          }

          return

        }

        // =====================================
        // ADMIN TOUJOURS AUTORISÉ
        // =====================================

        if (user.role === "admin") {

          if (mounted) {

            setMaintenance(false)
            setChecking(false)

          }

          return

        }

        // =====================================
        // RÉCUPÉRER LES PARAMÈTRES
        // =====================================

        const response = await API.get(
          "/settings"
        )

        const settings = response.data?.settings

        const maintenanceEnabled =
          settings?.maintenance?.enabled === true

        if (mounted) {

          setMaintenance(
            maintenanceEnabled
          )

          setChecking(false)

        }

      }

      catch (error) {

        console.error(
          "Erreur vérification maintenance :",
          error
        )

        // =====================================
        // EN CAS D'ERREUR
        // ON LAISSE PASSER
        // =====================================

        if (mounted) {

          setMaintenance(false)
          setChecking(false)

        }

      }

    }

    checkMaintenance()

    return () => {

      mounted = false

    }

  }, [token, user?.role, location.pathname])


  // =========================
  // VÉRIFICATION CONNEXION
  // =========================

  if (!token || !user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    )

  }


  // =========================
  // VÉRIFICATION DU RÔLE
  // =========================

  if (

    location.pathname.startsWith("/admin") &&

    user.role !== "admin"

  ) {

    return (
      <Navigate
        to="/login"
        replace
      />
    )

  }


  if (

    location.pathname.startsWith("/teacher") &&

    user.role !== "teacher"

  ) {

    return (
      <Navigate
        to="/login"
        replace
      />
    )

  }


  if (

    location.pathname.startsWith("/student") &&

    user.role !== "student"

  ) {

    return (
      <Navigate
        to="/login"
        replace
      />
    )

  }


  // =========================
  // CHARGEMENT
  // =========================

  if (checking) {

    return (

      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-[#f8fafc]
        "
      >

        <div
          className="
          text-purple-600
          font-semibold
          text-lg
          "
        >

          Vérification de la plateforme...

        </div>

      </div>

    )

  }


  // =========================
  // MAINTENANCE
  // =========================

  if (

    maintenance &&

    user.role !== "admin"

  ) {

    return (
      <Navigate
        to="/maintenance"
        replace
      />
    )

  }


  // =========================
  // AUTORISÉ
  // =========================

  return children

}

export default ProtectedRoute