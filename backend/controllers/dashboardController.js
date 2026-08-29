import User from "../models/User.js"
import Course from "../models/Course.js"
import Conference from "../models/Conference.js"
import Pdf from "../models/Pdf.js"
import Enrollment from "../models/Enrollment.js"


// =====================================================
// DASHBOARD ADMINISTRATEUR
// GET /api/dashboard
// ADMIN UNIQUEMENT
// =====================================================
export const getDashboardStats = async (req, res) => {

  try {

    // =====================================================
    // DATE DU JOUR
    // =====================================================

    const startOfDay = new Date()

    startOfDay.setHours(
      0,
      0,
      0,
      0
    )


    const endOfDay = new Date()

    endOfDay.setHours(
      23,
      59,
      59,
      999
    )


    // =====================================================
    // STATISTIQUES UTILISATEURS
    // =====================================================

    const totalUsers =
      await User.countDocuments()


    const students =
      await User.countDocuments({

        role: "student"

      })


    const teachers =
      await User.countDocuments({

        role: "teacher"

      })


    // =====================================================
    // COURS
    // =====================================================

    const courses =
      await Course.countDocuments({

        isActive: true

      })


    // =====================================================
    // CONFÉRENCES
    // =====================================================

    const conferences =
      await Conference.countDocuments({

        isActive: true

      })


    // =====================================================
    // DOCUMENTS PDF
    // =====================================================

    const documents =
      await Pdf.countDocuments()


    // =====================================================
    // CERTIFICATS
    // =====================================================

    const certificates =
      await Enrollment.countDocuments({

        certificateIssued: true

      })


    // =====================================================
    // CONNEXIONS DU JOUR
    // =====================================================

    const todayConnections =
      await User.countDocuments({

        lastLoginAt: {

          $gte: startOfDay,

          $lte: endOfDay

        }

      })


    // =====================================================
    // NOUVEAUX UTILISATEURS
    // =====================================================

    const recentUsers =
      await User.find({

        role: {

          $in: [

            "student",

            "teacher"

          ]

        }

      })

      .select(

        "name email role profileImage createdAt"

      )

      .sort({

        createdAt: -1

      })

      .limit(5)


    // =====================================================
    // COURS RÉCENTS
    // =====================================================

    const recentCourses =
      await Course.find({

        isActive: true

      })

      .populate(

        "teacher",

        "name profileImage"

      )

      .sort({

        createdAt: -1

      })

      .limit(5)


    // =====================================================
    // RÉPONSE
    // =====================================================

    return res.status(200).json({

      success: true,

      stats: {

        totalUsers,

        students,

        teachers,

        courses,

        conferences,

        documents,

        certificates,

        todayConnections

      },

      recentUsers,

      recentCourses

    })

  }

  catch (error) {

    console.error(

      "❌ ERREUR DASHBOARD :",

      error

    )

    return res.status(500).json({

      success: false,

      message:
        "Impossible de récupérer les statistiques du dashboard.",

      error: error.message

    })

  }

}