import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaClipboardCheck,
  FaEye,
  FaUserGraduate,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import TeacherLayout from "../../layouts/TeacherLayout";
import API from "../../services/api";
import { errorToast } from "../../utils/toast";

const QuizSubmissions = () => {
  const { quizId } = useParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);

        const response = await API.get(`/quizzes/${quizId}/submissions`);

        setData(response.data);
      } catch (error) {
        console.error(
          "Erreur récupération des soumissions :",
          error.response?.data || error
        );

        errorToast(
          error.response?.data?.message ||
            "Impossible de récupérer les soumissions."
        );
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchSubmissions();
    }
  }, [quizId]);

  const formatDate = (date) => {
    if (!date) return "Date inconnue";

    return new Date(date).toLocaleString("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <TeacherLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Retour */}
        <Link
          to="/teacher-courses"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition"
        >
          <FaArrowLeft />
          Retour
        </Link>

        {/* En-tête */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 md:p-8 text-white shadow-lg mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-white/20 rounded-xl">
                  <FaClipboardCheck className="text-2xl" />
                </div>

                <span className="text-indigo-100 font-medium">
                  Évaluation
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold">
                {data?.quiz?.title || "Soumissions du quiz"}
              </h1>

              {data?.course?.title && (
                <p className="text-indigo-100 mt-2">
                  Cours : {data.course.title}
                </p>
              )}
            </div>

            <div className="bg-white/15 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-3">
                <FaUserGraduate className="text-xl" />

                <div>
                  <p className="text-2xl font-bold">
                    {data?.submissions?.length || 0}
                  </p>

                  <p className="text-sm text-indigo-100">
                    Soumission(s)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chargement */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        )}

        {/* Contenu */}
        {!loading && (
          <>
            {!data?.submissions?.length ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
                <FaClipboardCheck className="mx-auto text-5xl text-gray-300 mb-4" />

                <h2 className="text-xl font-semibold text-gray-700">
                  Aucune soumission
                </h2>

                <p className="text-gray-500 mt-2">
                  Aucun étudiant n'a encore soumis ce quiz.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                          Étudiant
                        </th>

                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                          Date
                        </th>

                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                          Statut
                        </th>

                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                          Note
                        </th>

                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {data.submissions.map((submission) => {
                        const student = submission.student;

                        const studentName = student
                          ? `${student.firstName || ""} ${
                              student.lastName || ""
                            }`.trim()
                          : "Étudiant";

                        const isCorrected =
                          submission.status === "corrected";

                        return (
                          <tr
                            key={submission._id}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                  {studentName
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <div>
                                  <p className="font-semibold text-gray-800">
                                    {studentName}
                                  </p>

                                  {student?.email && (
                                    <p className="text-sm text-gray-500">
                                      {student.email}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-5 text-gray-600">
                              <div className="flex items-center gap-2">
                                <FaClock className="text-gray-400" />
                                {formatDate(submission.submittedAt)}
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              {isCorrected ? (
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                                  <FaCheckCircle />
                                  Corrigée
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
                                  À corriger
                                </span>
                              )}
                            </td>

                            <td className="px-6 py-5">
                              {isCorrected ? (
                                <span className="font-bold text-indigo-600">
                                  {submission.teacherScore ??
                                    submission.score ??
                                    0}
                                  {" / "}
                                  {submission.totalPoints ?? 0}
                                </span>
                              ) : (
                                <span className="text-gray-400">
                                  Non corrigée
                                </span>
                              )}
                            </td>

                            <td className="px-6 py-5 text-right">
                              <Link
                                to={`/teacher-quiz-submission/${submission._id}`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition"
                              >
                                <FaEye />
                                Voir la copie
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </TeacherLayout>
  );
};

export default QuizSubmissions;