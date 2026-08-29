import User from "../models/User.js"
import Course from "../models/Course.js"
import Conference from "../models/Conference.js"
import Pdf from "../models/Pdf.js"
import Enrollment from "../models/Enrollment.js"
import Chapter from "../models/Chapter.js"

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


// =====================================================
// DASHBOARD ENSEIGNANT
// GET /api/dashboard/teacher
// ENSEIGNANT UNIQUEMENT
// =====================================================
export const getTeacherDashboardStats = async (req, res) => {

    try {
  
      // =====================================================
      // VÉRIFICATION ENSEIGNANT
      // =====================================================
  
      if (req.user.role !== "teacher") {
  
        return res.status(403).json({
  
          success: false,
  
          message:
            "Accès réservé aux enseignants."
  
        })
  
      }
  
  
      // =====================================================
      // IDENTIFIANT DE L'ENSEIGNANT
      // =====================================================
  
      const teacherId = req.user._id
  
  
      // =====================================================
      // COURS DE L'ENSEIGNANT
      // =====================================================
  
      const teacherCourses = await Course.find({
  
        teacher: teacherId,
  
        isActive: true
  
      }).select("_id title createdAt status")
  
  
      const courseIds =
        teacherCourses.map(
          course => course._id
        )
  
  
      // =====================================================
      // COURS PUBLIÉS
      // =====================================================
  
      const publishedCourses =
        teacherCourses.filter(
  
          course =>
            course.status === "Publié"
  
        ).length
  
  
      // =====================================================
      // ÉTUDIANTS INSCRITS
      // =====================================================
  
      const students =
        await Enrollment.distinct(
  
          "student",
  
          {
  
            course: {
              $in: courseIds
            },
  
            status: {
              $in: [
                "active",
                "completed"
              ]
            }
  
          }
  
        )
  
  
      // =====================================================
      // CONFÉRENCES
      // =====================================================
  
      const conferences =
        await Conference.countDocuments({
  
          teacher: teacherId,
  
          isActive: true
  
        })
  
  
      // =====================================================
      // CHAPITRES DES COURS
      // =====================================================
  
      const chapters = await Chapter.find({
  
        course: {
          $in: courseIds
        }
  
      }).select("_id")
  
  
      const chapterIds =
        chapters.map(
          chapter => chapter._id
        )
  
  
      // =====================================================
      // DOCUMENTS PDF
      // =====================================================
  
      const documents =
        await Pdf.countDocuments({
  
          chapter: {
            $in: chapterIds
          }
  
        })
  
  
      // =====================================================
      // CERTIFICATS
      // =====================================================
  
      const certificates =
        await Enrollment.countDocuments({
  
          course: {
            $in: courseIds
          },
  
          certificateIssued: true
  
        })
  
  
      // =====================================================
      // ACTIVITÉS RÉCENTES
      // =====================================================
  
      const recentCourses =
        await Course.find({
  
          teacher: teacherId
  
        })
  
        .select(
          "title createdAt updatedAt status"
        )
  
        .sort({
  
          createdAt: -1
  
        })
  
        .limit(3)
  
  
      const recentConferences =
        await Conference.find({
  
          teacher: teacherId
  
        })
  
        .select(
          "title scheduledAt createdAt status"
        )
  
        .sort({
  
          createdAt: -1
  
        })
  
        .limit(3)
  
  
      // =====================================================
      // INSCRIPTIONS RÉCENTES
      // =====================================================
  
      const recentEnrollments =
        await Enrollment.find({
  
          course: {
            $in: courseIds
          }
  
        })
  
        .populate(
  
          "course",
  
          "title"
  
        )
  
        .sort({
  
          createdAt: -1
  
        })
  
        .limit(3)
  
  
      // =====================================================
      // CONSTRUCTION DES ACTIVITÉS
      // =====================================================
  
      const activities = []
  
  
      // ---------------------------------------------
      // COURS
      // ---------------------------------------------
  
      recentCourses.forEach(
  
        course => {
  
          activities.push({
  
            type: "course",
  
            title:
              course.status === "Publié"
  
                ? "Nouveau cours publié"
  
                : "Nouveau cours créé",
  
            description:
              course.title,
  
            date:
              course.createdAt
  
          })
  
        }
  
      )
  
  
      // ---------------------------------------------
      // CONFÉRENCES
      // ---------------------------------------------
  
      recentConferences.forEach(
  
        conference => {
  
          activities.push({
  
            type: "conference",
  
            title:
              "Conférence programmée",
  
            description:
              conference.title,
  
            date:
              conference.createdAt
  
          })
  
        }
  
      )
  
  
      // ---------------------------------------------
      // INSCRIPTIONS
      // ---------------------------------------------
  
      recentEnrollments.forEach(
  
        enrollment => {
  
          activities.push({
  
            type: "enrollment",
  
            title:
              "Nouvelle inscription",
  
            description:
              enrollment.course?.title ||
              "Un étudiant s'est inscrit à votre cours",
  
            date:
              enrollment.createdAt
  
          })
  
        }
  
      )
  
  
      // =====================================================
      // TRI DES ACTIVITÉS
      // =====================================================
  
      activities.sort(
  
        (a, b) =>
  
          new Date(b.date) -
          new Date(a.date)
  
      )
  
  
      // =====================================================
      // LIMITER À 5 ACTIVITÉS
      // =====================================================
  
      const recentActivities =
        activities.slice(0, 5)
  
  
      // =====================================================
      // RÉPONSE
      // =====================================================
  
      return res.status(200).json({
  
        success: true,
  
        stats: {
  
          publishedCourses,
  
          students:
            students.length,
  
          conferences,
  
          documents,
  
          certificates
  
        },
  
        recentActivities
  
      })
  
    }
  
    catch (error) {
  
      console.error(
  
        "❌ ERREUR DASHBOARD ENSEIGNANT :",
  
        error
  
      )
  
      return res.status(500).json({
  
        success: false,
  
        message:
          "Impossible de récupérer les statistiques du dashboard enseignant.",
  
        error:
          error.message
  
      })
  
    }
  
  }
