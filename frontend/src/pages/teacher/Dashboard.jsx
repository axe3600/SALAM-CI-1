import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import TeacherLayout from "../../layouts/TeacherLayout"

import API from "../../services/api"

import {
  FaBook,
  FaUsers,
  FaVideo,
  FaFileAlt,
  FaAward,
  FaCalendarAlt,
  FaUserPlus,
  FaEdit,
  FaPlus,
  FaSpinner
} from "react-icons/fa"

function Dashboard() {

  // =====================================================
  // UTILISATEUR CONNECTÉ
  // =====================================================

  const user = JSON.parse(
    localStorage.getItem("user")
  )


  // =====================================================
  // ÉTATS
  // =====================================================

  const [stats, setStats] = useState({

    publishedCourses: 0,

    students: 0,

    conferences: 0,

    documents: 0,

    certificates: 0

  })


  const [activities, setActivities] = useState([])

  const [loading, setLoading] = useState(true)


  // =====================================================
  // RÉCUPÉRER LE DASHBOARD
  // =====================================================

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        setLoading(true)

        const response = await API.get(
          "/dashboard/teacher"
        )

        if (response.data?.success) {

          setStats(

            response.data.stats || {

              publishedCourses: 0,

              students: 0,

              conferences: 0,

              documents: 0,

              certificates: 0

            }

          )

          setActivities(

            response.data.recentActivities || []

          )

        }

      }

      catch (error) {

        console.error(

          "Erreur dashboard enseignant :",

          error

        )

      }

      finally {

        setLoading(false)

      }

    }


    fetchDashboard()

  }, [])


  // =====================================================
  // FORMATAGE DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {

      return ""

    }

    return new Date(date).toLocaleDateString(

      "fr-FR",

      {

        day: "numeric",

        month: "long",

        year: "numeric"

      }

    )

  }


  // =====================================================
  // ICÔNE ACTIVITÉ
  // =====================================================

  const getActivityIcon = (type) => {

    switch (type) {

      case "course":

        return <FaBook />

      case "enrollment":

        return <FaUserPlus />

      case "conference":

        return <FaVideo />

      default:

        return <FaEdit />

    }

  }


  // =====================================================
  // COULEUR ACTIVITÉ
  // =====================================================

  const getActivityColor = (type) => {

    switch (type) {

      case "course":

        return "bg-blue-100 text-blue-600"

      case "enrollment":

        return "bg-green-100 text-green-600"

      case "conference":

        return "bg-purple-100 text-purple-600"

      default:

        return "bg-gray-100 text-gray-600"

    }

  }


  // =====================================================
  // CARTES STATISTIQUES
  // =====================================================

  const statCards = [

    {

      title: "Cours publiés",

      value: stats.publishedCourses,

      icon: <FaBook />,

      color: "bg-blue-500"

    },

    {

      title: "Étudiants inscrits",

      value: stats.students,

      icon: <FaUsers />,

      color: "bg-green-500"

    },

    {

      title: "Conférences",

      value: stats.conferences,

      icon: <FaVideo />,

      color: "bg-purple-500"

    },

    {

      title: "Documents",

      value: stats.documents,

      icon: <FaFileAlt />,

      color: "bg-orange-500"

    },

    {

      title: "Certificats",

      value: stats.certificates,

      icon: <FaAward />,

      color: "bg-pink-500"

    }

  ]


  // =====================================================
  // AFFICHAGE
  // =====================================================

  return (

    <TeacherLayout>

      {/* =====================================================
          BANNIÈRE
      ===================================================== */}

      <div className="bg-gradient-to-r from-[#081028] via-[#101938] to-[#2f3652] rounded-3xl p-8 md:p-10 text-white shadow-xl">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div>

            <p className="text-purple-300 font-medium mb-2">

              Espace enseignant

            </p>

            <h1 className="text-4xl md:text-5xl font-bold">

              Bienvenue, {user?.name} !

            </h1>

            <p className="mt-4 text-gray-300 text-lg">

              {user?.email}

            </p>

          </div>

          <div className="hidden md:flex w-16 h-16 rounded-2xl bg-white/10 backdrop-blur items-center justify-center">

            <FaBook className="text-3xl text-purple-300" />

          </div>

        </div>

      </div>


      {/* =====================================================
          STATISTIQUES
      ===================================================== */}

      <div className="flex items-center justify-between mt-10 mb-6">

        <div>

          <h2 className="text-3xl font-bold">

            Statistiques générales

          </h2>

          <p className="text-gray-500 mt-1">

            Vue d'ensemble de votre activité

          </p>

        </div>

      </div>


      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5">

        {statCards.map((item, index) => (

          <div

            key={index}

            className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"

          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 text-sm">

                  {item.title}

                </p>

                <h3 className="text-4xl font-bold mt-2">

                  {loading ? (

                    <FaSpinner className="animate-spin text-gray-300 text-2xl" />

                  ) : (

                    item.value

                  )}

                </h3>

              </div>

              <div

                className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center text-white text-xl shadow-sm`}

              >

                {item.icon}

              </div>

            </div>

          </div>

        ))}

      </div>


      {/* =====================================================
          ACTIVITÉS RÉCENTES
      ===================================================== */}

      <div className="mt-12">

        <div className="mb-6">

          <h2 className="text-3xl font-bold">

            Activités récentes

          </h2>

          <p className="text-gray-500 mt-1">

            Les dernières activités liées à votre espace enseignant

          </p>

        </div>


        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

          {loading ? (

            <div className="flex flex-col items-center justify-center py-16">

              <FaSpinner className="animate-spin text-purple-600 text-3xl" />

              <p className="text-gray-500 mt-4">

                Chargement des activités...

              </p>

            </div>

          ) : activities.length === 0 ? (

            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">

              <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl">

                <FaCalendarAlt />

              </div>

              <h3 className="font-bold text-xl mt-5">

                Aucune activité récente

              </h3>

              <p className="text-gray-500 mt-2 max-w-md">

                Les nouvelles activités liées à vos cours,

                inscriptions et conférences apparaîtront ici.

              </p>

            </div>

          ) : (

            activities.map((item, index) => (

              <div

                key={`${item.type}-${index}`}

                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border-b last:border-b-0 hover:bg-gray-50 transition"

              >

                <div className="flex items-center gap-4">

                  <div

                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getActivityColor(item.type)}`}

                  >

                    {getActivityIcon(item.type)}

                  </div>

                  <div>

                    <h3 className="font-bold text-lg">

                      {item.title}

                    </h3>

                    <p className="text-gray-500 mt-1">

                      {item.description}

                    </p>

                  </div>

                </div>

                <span className="text-sm text-gray-400 md:whitespace-nowrap">

                  {formatDate(item.date)}

                </span>

              </div>

            ))

          )}

        </div>

      </div>


      {/* =====================================================
          MESSAGE RAPIDE
      ===================================================== */}
<div className="grid md:grid-cols-2 gap-6 mt-8 mb-6">

{/* ================================
    BOX MES COURS
================================= */}

<Link
  to="/teacher-courses"
  className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100
             hover:shadow-xl hover:-translate-y-1
             transition-all duration-300 cursor-pointer"
>

  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600
                  flex items-center justify-center mb-4
                  group-hover:scale-110 transition-transform duration-300">

    <FaPlus />

  </div>

  <h3 className="text-xl font-bold group-hover:text-purple-600 transition-colors">

    Développez votre espace de cours

  </h3>

  <p className="text-gray-500 mt-2">

    Créez et publiez de nouveaux contenus pour vos étudiants.

  </p>

  <div className="mt-4 text-sm font-semibold text-purple-600
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-300">

    Accéder à mes cours →

  </div>

</Link>


{/* ================================
    BOX CONFÉRENCES
================================= */}

<Link
  to="/teacher-conferences"
  className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100
             hover:shadow-xl hover:-translate-y-1
             transition-all duration-300 cursor-pointer"
>

  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600
                  flex items-center justify-center mb-4
                  group-hover:scale-110 transition-transform duration-300">

    <FaVideo />

  </div>

  <h3 className="text-xl font-bold group-hover:text-purple-600 transition-colors">

    Organisez vos conférences

  </h3>

  <p className="text-gray-500 mt-2">

    Planifiez vos prochaines séances avec vos étudiants.

  </p>

  <div className="mt-4 text-sm font-semibold text-purple-600
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-300">

    Accéder aux conférences →

  </div>

</Link>

</div>

    </TeacherLayout>

  )

}

export default Dashboard