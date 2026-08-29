import { useEffect, useState } from "react"

import AdminLayout from "../../layouts/AdminLayout"

import {
  FaUsers,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaVideo,
  FaFileAlt,
  FaAward,
  FaSignal
} from "react-icons/fa"

import api from "../../services/api"


function Dashboard() {

  // =====================================================
  // ETAT
  // =====================================================

  const [stats, setStats] = useState({

    totalUsers: 0,

    students: 0,

    teachers: 0,

    courses: 0,

    conferences: 0,

    documents: 0,

    certificates: 0,

    todayConnections: 0

  })


  const [recentUsers, setRecentUsers] = useState([])

  const [recentCourses, setRecentCourses] = useState([])

  const [loading, setLoading] = useState(true)


  // =====================================================
  // CHARGER LE DASHBOARD
  // =====================================================

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        const response =
          await api.get("/dashboard")


        if (response.data.success) {

          setStats(
            response.data.stats
          )

          setRecentUsers(
            response.data.recentUsers || []
          )

          setRecentCourses(
            response.data.recentCourses || []
          )

        }

      }

      catch (error) {

        console.error(

          "Erreur récupération dashboard :",

          error

        )

      }

      finally {

        setLoading(false)

      }

    }


    loadDashboard()

  }, [])


  // =====================================================
  // CARTES
  // =====================================================

  const statCards = [

    {

      title: "Total utilisateurs",

      value: stats.totalUsers,

      icon: <FaUsers />,

      color: "bg-blue-500"

    },

    {

      title: "Étudiants",

      value: stats.students,

      icon: <FaUserGraduate />,

      color: "bg-green-500"

    },

    {

      title: "Enseignants",

      value: stats.teachers,

      icon: <FaChalkboardTeacher />,

      color: "bg-purple-500"

    },

    {

      title: "Cours",

      value: stats.courses,

      icon: <FaBook />,

      color: "bg-orange-500"

    },

    {

      title: "Conférences",

      value: stats.conferences,

      icon: <FaVideo />,

      color: "bg-red-500"

    },

    {

      title: "Documents",

      value: stats.documents,

      icon: <FaFileAlt />,

      color: "bg-indigo-500"

    },

    {

      title: "Certificats",

      value: stats.certificates,

      icon: <FaAward />,

      color: "bg-yellow-500"

    },

    {

      title: "Connexions du jour",

      value: stats.todayConnections,

      icon: <FaSignal />,

      color: "bg-pink-500"

    }

  ]


  // =====================================================
  // AFFICHAGE
  // =====================================================

  return (

    <AdminLayout>

      <div className="mb-10">

        <h1 className="text-4xl font-bold">

          Dashboard Administrateur

        </h1>

        <p className="text-gray-500 mt-2">

          Vue d'ensemble de la plateforme SALAM CI

        </p>

      </div>


      {/* =====================================================
          CARTES STATISTIQUES
      ===================================================== */}

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

        {statCards.map((item, index) => (

          <div
            key={index}
            className="
              bg-white
              rounded-3xl
              p-6
              shadow-sm
              hover:shadow-xl
              transition
            "
          >

            <div
              className={`
                w-14
                h-14
                rounded-2xl
                text-white
                flex
                items-center
                justify-center
                text-xl
                ${item.color}
              `}
            >

              {item.icon}

            </div>


            <p className="text-gray-500 mt-6">

              {item.title}

            </p>


            <h2 className="text-4xl font-bold mt-2">

              {loading
                ? "..."
                : item.value.toLocaleString("fr-FR")
              }

            </h2>

          </div>

        ))}

      </div>


      {/* =====================================================
          BLOCS
      ===================================================== */}

      <div className="grid lg:grid-cols-2 gap-6 mt-10">


        {/* =====================================================
            NOUVEAUX UTILISATEURS
        ===================================================== */}

        <div className="bg-white rounded-3xl p-8 shadow-sm">

          <h2 className="text-2xl font-bold mb-6">

            Nouveaux utilisateurs

          </h2>


          {loading ? (

            <p className="text-gray-500">

              Chargement...

            </p>

          ) : recentUsers.length === 0 ? (

            <p className="text-gray-500">

              Aucun utilisateur récent.

            </p>

          ) : (

            <div className="space-y-5">

              {recentUsers.map((user) => (

                <div
                  key={user._id}
                  className="flex justify-between items-center"
                >

                  <div className="flex items-center gap-3">

                    {user.profileImage ? (

                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="
                          w-10
                          h-10
                          rounded-full
                          object-cover
                        "
                      />

                    ) : (

                      <div className="
                        w-10
                        h-10
                        rounded-full
                        bg-purple-100
                        flex
                        items-center
                        justify-center
                        text-purple-600
                        font-semibold
                      ">

                        {user.name
                          ?.charAt(0)
                          ?.toUpperCase()
                        }

                      </div>

                    )}


                    <span>

                      {user.name}

                    </span>

                  </div>


                  <span
                    className={
                      user.role === "teacher"
                        ? "text-blue-600"
                        : "text-green-600"
                    }
                  >

                    {user.role === "teacher"
                      ? "Enseignant"
                      : "Étudiant"
                    }

                  </span>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* =====================================================
            COURS RÉCENTS
        ===================================================== */}

        <div className="bg-white rounded-3xl p-8 shadow-sm">

          <h2 className="text-2xl font-bold mb-6">

            Cours récents

          </h2>


          {loading ? (

            <p className="text-gray-500">

              Chargement...

            </p>

          ) : recentCourses.length === 0 ? (

            <p className="text-gray-500">

              Aucun cours récent.

            </p>

          ) : (

            <div className="space-y-5">

              {recentCourses.map((course) => (

                <div
                  key={course._id}
                  className="flex items-center gap-4"
                >

                  {course.thumbnail ? (

                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="
                        w-12
                        h-12
                        rounded-xl
                        object-cover
                      "
                    />

                  ) : (

                    <div className="
                      w-12
                      h-12
                      rounded-xl
                      bg-purple-100
                      flex
                      items-center
                      justify-center
                      text-purple-600
                    ">

                      <FaBook />

                    </div>

                  )}


                  <div>

                    <h3 className="font-semibold">

                      {course.title}

                    </h3>


                    <p className="text-gray-500">

                      {course.teacher?.name ||
                        "Enseignant non renseigné"
                      }

                    </p>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </AdminLayout>

  )

}


export default Dashboard