import AdminLayout from "../../layouts/AdminLayout"
import { useNavigate } from "react-router-dom"
import {
    useEffect,
    useState
} from "react"

import API from "../../services/api"

import {
    successToast,
    errorToast
} from "../../utils/toast"

import {
    FaSearch,
    FaEye,
    FaCheckCircle,
    FaBan,
    FaTrash,
    FaBookOpen,
    FaMoneyBillWave
  } from "react-icons/fa"

function Courses() {

  const navigate = useNavigate()
  // =========================
  // COURS
  // =========================
  const [courses, setCourses] = useState([])

// =========================
// CHARGEMENT
// =========================
const [loading, setLoading] = useState(true)

  // =========================
  // STATISTIQUES
  // =========================
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    pending: 0,
    suspended: 0
  })

  // =========================
  // RECHERCHE
  // =========================
  const [search, setSearch] = useState("")

  // =========================
  // FILTRE
  // =========================
  const [statusFilter, setStatusFilter] = useState(
    "Tous"
  )

  // =========================
  // PAGINATION
  // =========================
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCourses, setTotalCourses] = useState(0)

// =========================
// MODAL
// =========================
const [showModal, setShowModal] = useState(false)
const [selectedCourse, setSelectedCourse] = useState(null)

// =========================
// MODAL SUPPRESSION
// =========================
const [showDeleteModal, setShowDeleteModal] = useState(false)
const [courseToDelete, setCourseToDelete] = useState(null)

// =========================
// RÉCUPÉRER LES COURS
// =========================
const getCourses = async () => {

    try {

        setLoading(true)

        const res = await API.get(
            `/courses/admin?page=${page}&limit=${limit}`
        )

        setCourses(res.data.courses)

        setTotalPages(res.data.totalPages)

        setTotalCourses(res.data.totalCourses)

        setLoading(false)

    }

    catch (error) {

        console.log(error)

        setLoading(false)

    }
}


// =========================
// STATISTIQUES
// =========================
const getStats = async () => {

  try {

      const res = await API.get(
          "/courses/stats"
      )

      console.log(res.data)
      
      setStats({
        total: res.data.totalCourses,
        published: res.data.publishedCourses,
        pending: res.data.draftCourses,
        suspended: res.data.suspendedCourses
    })
  }

  catch (error) {
      console.log(error)
  }
}

useEffect(() => {

  getCourses()
  getStats()
}, [
  page,
  limit
])

// =========================
// FILTRAGE DES COURS
// =========================
const filteredCourses = courses.filter((course) => {

  // =========================
  // RECHERCHE
  // =========================
  const matchSearch =

      course.title
          .toLowerCase()
          .includes(search.toLowerCase())

      ||

      course.category
          .toLowerCase()
          .includes(search.toLowerCase())

      ||

      course.teacher?.name
          ?.toLowerCase()
          .includes(search.toLowerCase())

  // =========================
  // FILTRE STATUT
  // =========================
  let matchStatus = true

  if (statusFilter !== "Tous") {

      matchStatus =

          course.status === statusFilter

  }

  return matchSearch && matchStatus

})


// =========================
// OUVRIR LE MODAL
// =========================
const handleViewCourse = async (id) => {

    try {

        const res = await API.get(`/courses/${id}`)

        setSelectedCourse(res.data)

        setShowModal(true)

    }

    catch (error) {

        console.log(error)

        errorToast("Impossible de charger le cours.")

    }

}


// =========================
// PUBLIER UN COURS
// =========================
const publishCourse = async (id) => {

    try {

        await API.patch(
            `/courses/${id}/publish`
        )

        successToast(
            "Cours publié avec succès."
        )

        getCourses()

        getStats()

    }

    catch (error) {

        errorToast(
            error.response?.data?.message ||
            "Impossible de publier."
        )
    }
}


// =========================
// SUSPENDRE UN COURS
// =========================
const suspendCourse = async (id) => {

    try {

        await API.patch(
            `/courses/${id}/suspend`
        )

        successToast(
            "Cours suspendu avec succès."
        )

        getCourses()

        getStats()

    }

    catch (error) {

        errorToast(

            error.response?.data?.message ||

            "Impossible de suspendre."

        )

    }

}


// =========================
// SUPPRIMER UN COURS
// =========================
const deleteCourse = async (id) => {

    try {

        await API.delete(`/courses/${id}`)

        successToast(
            "Cours supprimé avec succès."
        )

        // Fermer les modals
        setShowDeleteModal(false)
        setCourseToDelete(null)
        setShowModal(false)
        setSelectedCourse(null)

        // Recharger les données
        getCourses()
        getStats()

    }

    catch (error) {

        errorToast(

            error.response?.data?.message ||

            "Impossible de supprimer."

        )

    }

}


  return (

    <AdminLayout>

      {/* HEADER */}

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          Gestion des Cours
        </h1>

        <p className="text-gray-500 mt-2">
          Gérez les cours publiés sur la plateforme
        </p>

      </div>

{/* =========================
    STATISTIQUES
========================= */}
<div className="grid md:grid-cols-4 gap-6 mb-8">

    {/* TOTAL */}

    <div className="bg-white rounded-3xl shadow-sm p-6">
        <p className="text-gray-500">
            Total des cours
        </p>

        <h2 className="text-4xl font-bold mt-2">
            {stats.total}
        </h2>

    </div>

    {/* PUBLIÉS */}

    <div className="bg-white rounded-3xl shadow-sm p-6">
        <p className="text-gray-500">
            Publiés
        </p>

        <h2 className="text-4xl font-bold text-green-600 mt-2">
            {stats.published}
        </h2>

    </div>

    {/* EN ATTENTE */}

    <div className="bg-white rounded-3xl shadow-sm p-6">
        <p className="text-gray-500">
            En attente
        </p>

        <h2 className="text-4xl font-bold text-orange-500 mt-2">
            {stats.pending}
        </h2>

    </div>


    {/* SUSPENDUS */}

    <div className="bg-white rounded-3xl shadow-sm p-6">
        <p className="text-gray-500">
            Suspendus
        </p>

        <h2 className="text-4xl font-bold text-red-600 mt-2">
            {stats.suspended}
        </h2>

    </div>
</div>


{/* =========================
    RECHERCHE + FILTRE
========================= */}

<div className="flex gap-4 mb-8">
    <div className="flex-1 relative">
        <FaSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
            type="text"
            value={search}
            onChange={(e) =>
                setSearch(e.target.value)
            }
            placeholder="Rechercher un cours..."
            className=" w-full bg-white rounded-2xl pl-12 py-4 shadow-sm outline-none " />

    </div>

    <select
        value={statusFilter}
        onChange={(e) =>
            setStatusFilter(
                e.target.value
            )
        }

        className="bg-white rounded-2xl px-5 shadow-sm" >

        <option>
            Tous
        </option>

        <option>
            Publié
        </option>

        <option>
            En attente
        </option>

        <option>
            Suspendu
        </option>
    </select>

</div>


      {/* TABLEAU */}

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

{
loading ? (

<div className="py-24 flex flex-col items-center">

<div className="w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>

<p className="mt-6 text-gray-500 text-lg">

Chargement des cours...

</p>

</div>

) : (

<table className="w-full">
          <thead className="bg-gray-50">

            <tr>

            <th className="text-left p-5">
              Cours
            </th>

            <th className="text-left">
              Enseignant
            </th>

            <th className="text-left">
              Catégorie
            </th>

            <th className="text-left">
              Prix
            </th>

            <th className="text-left">
              Étudiants
            </th>

            <th className="text-left">
              Statut
            </th>

            <th className="text-left">
              Actions
            </th>
            </tr>
          </thead>

    <tbody>

{
filteredCourses.length > 0 ? (

filteredCourses.map((course) => (

<tr
    key={course._id}
    className="border-t hover:bg-gray-50 transition"
>

    {/* =========================
        COURS
    ========================= */}
    <td className="p-5">
        <div className="flex items-center gap-4">

        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            onError={(e) => {
              e.currentTarget.style.display = "none"
              e.currentTarget.nextElementSibling?.classList.remove("hidden")
            }}
            className="w-16 h-16 rounded-xl object-cover"
          />
        ) : null}
          
          <div
            className={`w-16 h-16 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center ${
              course.thumbnail ? "hidden" : ""
            }`}
          >
            <FaBookOpen className="text-2xl" />
          </div>

            <div>

                <h3 className="font-semibold">
                    {course.title}
                </h3>

                <p className="text-gray-500 text-sm">
                    {course.description?.slice(0,60)}...
                </p>

            </div>

        </div>
    </td>

    <td>
        {course.teacher?.name}
    </td>

    <td>

        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">

            {course.category}

        </span>

    </td>

<td>
    {course.price !== null &&
    course.price !== undefined ? (

        <div className="flex flex-col gap-1">

            <span className="font-semibold">
                {Number(course.price).toLocaleString("fr-FR")} FCFA
            </span>

            {course.priceStatus && (

                <span
                    className={`
                        text-xs
                        px-2
                        py-1
                        rounded-full
                        w-fit

                        ${
                            course.priceStatus === "Validé"
                                ? "bg-green-100 text-green-700"
                                : course.priceStatus === "Modification demandée"
                                ? "bg-red-100 text-red-700"
                                : "bg-orange-100 text-orange-700"
                        }
                    `}
                >
                    {course.priceStatus}
                </span>

            )}

        </div>

    ) : (

        <span className="text-gray-400">
            Non défini
        </span>

    )}
</td>

    <td>

        {course.studentsCount}

    </td>

    <td>

        <span
            className={`px-3 py-1 rounded-full text-sm

            ${
                course.status === "Publié"

                ? "bg-green-100 text-green-600"

                : course.status === "Suspendu"

                ? "bg-red-100 text-red-600"

                : "bg-orange-100 text-orange-600"

            }`}
        >

            {course.status}

        </span>

    </td>

    <td>

        <div className="flex gap-4 text-lg">

            <button
                onClick={() => handleViewCourse(course._id)}
                className="text-blue-600 hover:scale-110"
            >
                <FaEye/>
            </button>

{
    course.status === "En attente" &&
    course.priceStatus === "En attente de validation" &&

    <button
        onClick={() =>
            navigate(`/admin/courses/${course._id}`)
        }
        title="Examiner le prix"
        className="text-purple-600 hover:scale-110 transition"
    >
        <FaMoneyBillWave />
    </button>
}

            {
                course.status === "Publié" &&

                <button
                    onClick={() => suspendCourse(course._id)}
                    className="text-orange-500 hover:scale-110"
                >
                    <FaBan/>
                </button>
            }

            <button
                onClick={() => {

                    setCourseToDelete(course)

                    setShowDeleteModal(true)

                }}
                className="text-red-600 hover:scale-110"
            >
                <FaTrash/>
            </button>

        </div>

    </td>

</tr>

))

) : (

<tr>

<td
    colSpan="7"
    className="py-16 text-center"
>

<div className="flex flex-col items-center">

<div className="text-6xl mb-4">
📚
</div>

<h2 className="text-2xl font-bold">

Aucun cours trouvé

</h2>

<p className="text-gray-500 mt-2">

Aucun cours ne correspond à votre recherche.

</p>

</div>

</td>

</tr>

)

}

</tbody>

</table>

   )
}

</div>

      {/* =========================
              PAGINATION
      ========================= */}

      <div className="flex justify-between items-center mt-8">
        <p className="text-gray-500">
            Total :
              <span className="font-semibold ml-1">
        {totalCourses}
              </span>
        </p>

      <div className="flex items-center gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className={`
            px-5 py-2 rounded-xl font-medium
            ${
                page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }
         `}
        >
        Précédent
    </button>

    <span className="font-semibold">
        Page {page} / {totalPages}
    </span>

       <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className={`
            px-5 py-2 rounded-xl font-medium
            ${
                page === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }
       `}
        >
        Suivant
       </button>

      </div>
      </div>

      {
        showModal && selectedCourse && (    
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <div className="bg-white rounded-3xl w-[750px] w-[900px] rounded-3xl bg-white overflow-hidden p-8">
                <div className="flex justify-between items-center mb-8">
                    
                    <h2 className="text-3xl font-bold">
                        Détails du cours
                    </h2>
        
                    <button
                        onClick={() => setShowModal(false)}
                        className="text-red-600 font-bold text-xl" >
                        ✕
                    </button>
        
                </div>
        
                {selectedCourse.thumbnail ? (
                  <img
                    src={selectedCourse.thumbnail}
                    alt={selectedCourse.title}
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                      e.currentTarget.nextElementSibling?.classList.remove("hidden")
                    }}
                    className="w-full h-72 object-cover rounded-2xl"
                  />
                ) : null}

                <div
                    className={`w-full h-72 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center ${
                      selectedCourse.thumbnail ? "hidden" : ""
                    }`}
                >
                    <FaBookOpen className="text-7xl" />
                </div>
        
                <div className="mt-8 space-y-4">
                    <div>
                        <p className="text-gray-500">
                            Titre
                        </p>
        
                        <h2 className="text-2xl font-bold">
                            {selectedCourse.title}
                        </h2>
                    </div>
        
                    <div>
                        <p className="text-gray-500">
                            Description
                        </p>
        
                        <p>
                            {selectedCourse.description}
                        </p>
                    </div>
        
                    <div className="grid grid-cols-2 gap-6">
        
                        <div>
                            <p className="text-gray-500">
                                Enseignant
                            </p>
        
                            <h3>
                                {selectedCourse.teacher?.name}
                            </h3>
                        </div>
        
                        <div>
                            <p className="text-gray-500">
                                Catégorie
                            </p>
        
                            <h3>
                                {selectedCourse.category}
                            </h3>
                        </div>
        
                        <div>
                            <p className="text-gray-500">
                                Étudiants
                            </p>
        
                            <h3>
                                {selectedCourse.studentsCount}
                            </h3>
        
                        </div>
        
                        <div>
                            <p className="text-gray-500">
                                Vues
                            </p>
        
                            <h3>
                                {selectedCourse.views}
                            </h3>
                        </div>
        
                        <div>
                            <p className="text-gray-500">
                                Téléchargements
                            </p>
        
                            <h3>
                                {selectedCourse.downloads}
                            </h3>
                        </div>
        
                        <div>
                            <p className="text-gray-500">
                                Statut
                            </p>
        
                            <span
                                className={`px-4 py-2 rounded-full text-white
                                ${
                                    selectedCourse.status === "Publié"
                                    ? "bg-green-600"
                                    : selectedCourse.status === "Suspendu"
                                    ? "bg-red-600"
                                    : "bg-orange-500"
                                }
                                        `}
                            >
                                {selectedCourse.status}
                            </span>
                        </div>
        
                    </div>
                </div>
        
                <div className="flex justify-end mt-10">
                    <button
                        onClick={() => setShowModal(false)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl" >
                          Fermer
                    </button>
                </div>
        
            </div>  
        </div>
        
        )
    }


{/* =========================
    MODAL SUPPRESSION
========================= */}

{
showDeleteModal && courseToDelete && (
<div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
    <div className="bg-white rounded-3xl w-[520px] shadow-2xl p-8 animate-fadeIn">

        {/* HEADER */}

        <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                <FaTrash className="text-red-600 text-3xl"/>
            </div>
        </div>

        {/* TITRE */}

        <h2 className="text-3xl font-bold text-center">
            Supprimer le cours ?
        </h2>

        {/* TEXTE */}

        <p className="text-gray-500 text-center mt-5 leading-8">
            Vous êtes sur le point de supprimer définitivement ce cours.
            <br/>
            Cette action est irréversible.
        </p>

        {/* NOM */}

        <div className="bg-gray-100 rounded-2xl mt-8 p-5">
            <h3 className="font-bold text-xl">
                {courseToDelete.title}
            </h3>

            <p className="text-gray-500 mt-2">
                {courseToDelete.teacher?.name}
            </p>
        </div>

        {/* BOUTONS */}

        <div className="flex justify-end gap-4 mt-10">
            <button
                onClick={() => {
                    setShowDeleteModal(false)
                    setCourseToDelete(null)
                }}
                className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
            >
                Annuler
            </button>

            <button
                onClick={() =>
                    deleteCourse(courseToDelete._id)
                }
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition"
            >
                Supprimer
            </button>
        
        </div>
    </div>
</div>

)
}

    </AdminLayout>

  )

}

export default Courses