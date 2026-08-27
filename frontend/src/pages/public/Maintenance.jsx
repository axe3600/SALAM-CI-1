import {
    FaTools,
    FaExclamationTriangle
  } from "react-icons/fa"
  
  import { useEffect, useState } from "react"
  
  import API from "../../services/api"
  
  function Maintenance() {
  
    const [message, setMessage] = useState(
      "La plateforme est actuellement en maintenance. Merci de revenir plus tard."
    )
  
    // =========================
    // RÉCUPÉRER LE MESSAGE
    // =========================
  
    useEffect(() => {
  
      const getMaintenanceSettings = async () => {
  
        try {
  
          const response = await API.get(
            "/settings"
          )
  
          const settings = response.data
  
          if (
            settings?.maintenance?.message
          ) {
  
            setMessage(
              settings.maintenance.message
            )
  
          }
  
        }
  
        catch (error) {
  
          console.error(
            "Erreur récupération maintenance :",
            error
          )
  
        }
  
      }
  
      getMaintenanceSettings()
  
    }, [])
  
  
    return (
  
      <div
        className="
        min-h-screen
        bg-[#eef2ff]
        flex
        items-center
        justify-center
        px-6
        "
      >
  
        <div
          className="
          bg-white
          w-full
          max-w-xl
          rounded-3xl
          shadow-xl
          p-10
          text-center
          "
        >
  
          {/* ICÔNE */}
  
          <div
            className="
            w-24
            h-24
            mx-auto
            rounded-full
            bg-purple-100
            text-purple-600
            flex
            items-center
            justify-center
            text-4xl
            "
          >
  
            <FaTools />
  
          </div>
  
  
          {/* TITRE */}
  
          <h1
            className="
            text-4xl
            font-bold
            text-gray-900
            mt-8
            "
          >
  
            Maintenance en cours
  
          </h1>
  
  
          {/* SOUS-TITRE */}
  
          <p
            className="
            text-gray-500
            mt-4
            text-lg
            leading-7
            "
          >
  
            {message}
  
          </p>
  
  
          {/* AVERTISSEMENT */}
  
          <div
            className="
            mt-8
            bg-purple-50
            border
            border-purple-100
            rounded-2xl
            p-5
            flex
            items-center
            gap-4
            text-left
            "
          >
  
            <FaExclamationTriangle
              className="
              text-purple-600
              text-2xl
              flex-shrink-0
              "
            />
  
            <p
              className="
              text-gray-600
              "
            >
  
              Notre équipe travaille actuellement
              à l'amélioration de la plateforme.
              Merci de patienter.
  
            </p>
  
          </div>
  
  
          {/* SALAM CI */}
  
          <p
            className="
            mt-8
            text-purple-600
            font-bold
            text-xl
            "
          >
  
            SALAM CI
  
          </p>
  
        </div>
  
      </div>
  
    )
  
  }
  
  export default Maintenance