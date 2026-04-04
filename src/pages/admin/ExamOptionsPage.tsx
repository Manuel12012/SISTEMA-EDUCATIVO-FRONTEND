import {useEffect} from "react";
import {useExamOptions} from "../../hooks/admin/useExamOptions";
import {useNavigate, useParams} from "react-router-dom";
import {FaArrowLeft, FaTrash, FaEdit} from "react-icons/fa";

const ExamOptionsPage = () => {
  // Usamos params leemos el id de question
  const {questionId} = useParams();

  // para navegar entre los buttons
  const navigate = useNavigate();

  const {
    examOptions,
    loading,
    error,
    fetchExamOptions,
    fetchOptionsByQuestions,
    createExamOption,
    updateExamOption,
    deleteExamOption,
    fetchExamOptionsById,
  } = useExamOptions();

  useEffect(() => {
    if (questionId) {
      fetchOptionsByQuestions(Number(questionId));
    }
  }, [questionId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 animate-pulse">Cargando opciones ...</p>
      </div>
    );
  if (error)
    return (
      <div className="p-6">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gra-300 hover:bg-gray-400 p-2 rounded"
        >
          <FaArrowLeft />
        </button>

        <div>
          <h1 className="text-3xl font-bold">
            Opciones de la pregunta {questionId}
          </h1>
          <p className="text-gray-500 text-sm">
            CRUD de las opciones relacionadas a la pregunta
          </p>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Pregunta ID</th>
                <th className="px-6 py-3 text-left">Opcion</th>
                <th className="px-6 py-3 text-left">Orden</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {examOptions.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    No hay preguntas registradas
                  </td>
                </tr>
              )}

              {examOptions.map((examOption) => (
                <tr key={examOption.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{examOption.id}</td>
                  <td className="px-6 py-4">{examOption.question_id}</td>
                  <td className="px-6 py-4">{examOption.opcion}</td>
                  <td className="px-6 py-4">{examOption.orden}</td>

                  <td className="px-6 py-4 flex gap-2">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm">
                      <FaEdit />
                    </button>

                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      onClick={async () => {
                        await deleteExamOption(examOption.id);
                        await fetchOptionsByQuestions(Number(questionId));
                      }}
                    ></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExamOptionsPage;
