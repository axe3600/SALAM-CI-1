import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaClipboardCheck,
  FaSave,
  FaUserGraduate,
} from "react-icons/fa";
import TeacherLayout from "../../layouts/TeacherLayout";
import API from "../../services/api";
import {
  errorToast,
  successToast,
} from "../../utils/toast";

const QuizSubmissionDetails = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [teacherScore, setTeacherScore] = useState("");
  const [teacherFeedback, setTeacherFeedback] = useState("");

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setLoading(true);

        const response = await API.get(
          `/quizzes/submissions/${submissionId}`
        );

        const data = response.data?.submission;

        setSubmission(data);

        if (data.status === "corrected") {
          setTeacherScore(
            data.teacherScore ?? data.score ?? ""
          );

          setTeacherFeedback(data.teacherFeedback || "");
        }
      } catch (error) {
        console.error(
          "Erreur récupération de la copie :",
          error.response?.data || error
        );

        errorToast(
          error.response?.data?.message ||
            "Impossible de récupérer cette copie."
        );
      } finally {
        setLoading(false);
      }
    };

    if (submissionId) {
      fetchSubmission();
    }
  }, [submissionId]);

  const handleCorrection = async (e) => {
    e.preventDefault();

    if (!submission) return;

    if (submission.status === "corrected") {
      errorToast("Cette copie a déjà été corrigée.");
      return;
    }

    const score = Number(teacherScore);

    if (
      Number.isNaN(score) ||
      score < 0 ||
      score > submission.totalPoints
    ) {
      errorToast(
        `La note doit être comprise entre 0 et ${submission.totalPoints}.`
      );
      return;
    }

    try {
      setSaving(true);

      const response = await API.patch(
        `/quizzes/submissions/${submissionId}/correct`,
        {
          teacherScore: score,
          teacherFeedback,
        }
      );

      setSubmission(response.data);

      setTeacherScore(
        response.data.teacherScore ??
          response.data.score ??
          score
      );

      setTeacherFeedback(
        response.data.teacherFeedback || teacherFeedback
      );

      successToast("Copie corrigée avec succès.");
    } catch (error) {
      console.error(
        "Erreur correction :",
        error.response?.data || error
      );

      errorToast(
        error.response?.data?.message ||
          "Impossible de corriger cette copie."
      );
    } finally {
      setSaving(false);
    }
  };

  const getStudentName = () => {
    if (!submission?.student) return "Étudiant";

    return `${submission.student.firstName || ""} ${
      submission.student.lastName || ""
    }`.trim();
  };

  const getQuestion = (questionId) => {
    return submission?.quiz?.questions?.find(
      (question) => question._id === questionId
    );
  };

  const getAnswer = (questionId) => {
    return submission?.answers?.find(
      (answer) => answer.questionId === questionId
    );
  };

  const getSelectedAnswerText = (question, selectedAnswer) => {
    if (!question) return selectedAnswer;

    const index = Number(selectedAnswer);

    if (
      Number.isInteger(index) &&
      question.options &&
      question.options[index] !== undefined
    ) {
      return question.options[index];
    }

    return selectedAnswer || "Aucune réponse";
  };

  if (loading) {
    return (
      <TeacherLayout>
        <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      </TeacherLayout>
    );
  }

  if (!submission) {
    return (
      <TeacherLayout>
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="bg-white rounded-2xl shadow-sm border p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-700">
              Copie introuvable
            </h2>

            <Link
              to="/teacher-courses"
              className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-indigo-600 text-white rounded-xl"
            >
              <FaArrowLeft />
              Retour
            </Link>
          </div>
        </div>
      </TeacherLayout>
    );
  }

  const isCorrected = submission.status === "corrected";

  return (
    <TeacherLayout>
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Retour */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition"
        >
          <FaArrowLeft />
          Retour aux soumissions
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 md:p-8 text-white shadow-lg mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-white/20 rounded-xl">
                  <FaClipboardCheck className="text-2xl" />
                </div>

                <span className="text-indigo-100">
                  Copie de l'étudiant
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold">
                {submission.quiz?.title || "Quiz"}
              </h1>

              <div className="flex items-center gap-2 mt-3 text-indigo-100">
                <FaUserGraduate />
                {getStudentName()}
              </div>
            </div>

            {isCorrected && (
              <div className="bg-white/15 rounded-2xl px-6 py-4 text-center">
                <p className="text-sm text-indigo-100">
                  Note finale
                </p>

                <p className="text-3xl font-bold">
                  {submission.teacherScore ??
                    submission.score ??
                    0}
                  {" / "}
                  {submission.totalPoints}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-5">
          {submission.quiz?.questions?.map(
            (question, index) => {
              const answer = getAnswer(question._id);

              const selectedText =
                getSelectedAnswerText(
                  question,
                  answer?.selectedAnswer
                );

              const correctText =
                getSelectedAnswerText(
                  question,
                  question.correctAnswer
                );

              return (
                <div
                  key={question._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between gap-4">
                        <h2 className="font-semibold text-gray-800">
                          {question.question}
                        </h2>

                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          {question.points} pt
                        </span>
                      </div>

                      <div className="mt-5">
                        <p className="text-sm font-medium text-gray-500 mb-2">
                          Réponse de l'étudiant
                        </p>

                        <div className="p-4 rounded-xl bg-gray-50 border">
                          {selectedText || "Aucune réponse"}
                        </div>
                      </div>

                      {isCorrected && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-500 mb-2">
                            Bonne réponse
                          </p>

                          <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800">
                            <div className="flex items-center gap-2">
                              <FaCheckCircle />
                              {correctText}
                            </div>
                          </div>
                        </div>
                      )}

                      {isCorrected && answer && (
                        <div className="mt-4 text-sm">
                          Résultat :{" "}
                          {answer.isCorrect ? (
                            <span className="text-green-600 font-semibold">
                              Correct
                            </span>
                          ) : (
                            <span className="text-red-600 font-semibold">
                              Incorrect
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* Correction */}
        {!isCorrected && (
          <form
            onSubmit={handleCorrection}
            className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                <FaClipboardCheck />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Corriger la copie
                </h2>

                <p className="text-sm text-gray-500">
                  Attribuez la note finale et ajoutez un commentaire
                  si nécessaire.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note / {submission.totalPoints}
                </label>

                <input
                  type="number"
                  min="0"
                  max={submission.totalPoints}
                  step="0.01"
                  value={teacherScore}
                  onChange={(e) =>
                    setTeacherScore(e.target.value)
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commentaire
                </label>

                <textarea
                  rows="4"
                  value={teacherFeedback}
                  onChange={(e) =>
                    setTeacherFeedback(e.target.value)
                  }
                  placeholder="Commentaire pour l'étudiant..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-semibold transition"
              >
                <FaSave />

                {saving
                  ? "Enregistrement..."
                  : "Enregistrer la correction"}
              </button>
            </div>
          </form>
        )}

        {/* Copie déjà corrigée */}
        {isCorrected && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-green-600 text-xl" />

              <div>
                <h2 className="font-bold text-green-800">
                  Copie corrigée
                </h2>

                {submission.teacherFeedback && (
                  <p className="text-green-700 mt-1">
                    {submission.teacherFeedback}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
};

export default QuizSubmissionDetails;