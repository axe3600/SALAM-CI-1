
import Settings from "../models/Settings.js"

// =====================================================
// MIDDLEWARE MODE MAINTENANCE
// =====================================================
// Bloque les étudiants et enseignants lorsque la
// plateforme est en maintenance.
//
// L'administrateur reste toujours autorisé.
// =====================================================

const maintenanceMiddleware = async (req, res, next) => {

    try {
  
      const settings = await Settings.findOne()
  
      // =================================================
      // PARAMÈTRES ABSENTS
      // =================================================
  
      if (!settings) {
  
        return next()
  
      }
  
      // =================================================
      // MAINTENANCE DÉSACTIVÉE
      // =================================================
  
      if (!settings.maintenance?.enabled) {
  
        return next()
  
      }
  
      // =================================================
      // ADMIN TOUJOURS AUTORISÉ
      // =================================================
  
      if (req.user?.role === "admin") {
  
        return next()
  
      }
  
      // =================================================
      // MAINTENANCE ACTIVE
      // =================================================
  
      return res.status(503).json({
  
        success: false,
  
        maintenance: true,
  
        message:
          settings.maintenance?.message ||
          "La plateforme est actuellement en maintenance. Merci de revenir plus tard."
  
      })
  
    }
  
    catch (error) {
  
      console.error(
        "ERREUR MODE MAINTENANCE :",
        error.message
      )
  
      // En cas de problème MongoDB,
      // on ne bloque pas toute la plateforme.
  
      return next()
  
    }
  
  }
  
  
  export default maintenanceMiddleware