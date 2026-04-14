// Importaciones
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuestions } from "../../hooks/admin/useQuestions";
import type { Question } from "../../types/question";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useExams } from "../../hooks/admin/useExams";
import type { ExamOption } from "../../types/examOption";
import { useExamOptions } from "../../hooks/admin/useExamOptions";
import QuestionHeader from "../../components/questions/QuestionHeader";
import QuestionAction from "../../components/questions/QuestionActions";
import QuestionContent from "../../components/questions/QuestionContent";

const ExamQuestionsPage = () => {
  // Importacion para usar el ID de la url como parametro
  const { examId } = useParams();

  // Importacion de navigate para navegar entre paginas
  const navigate = useNavigate();

  // Exportacion de metodos del hook useQuestions
  const {
    questions,
    loading,
    error,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    fetchQuestionsByExam,
  } = useQuestions();

  // Metodos de useExamOptions
  const { fetchOptionsByQuestions, updateExamOption } =
    useExamOptions();

  // Estados para la visibilidad
  const [opcionesVisibles, setOpcionesVisibles] = useState<Set<number>>(
    new Set(),
  );
  const [mostrarFormNuevaOpcion, setMostrarFormNuevaOpcion] = useState<
    Set<number>
  >(new Set());

  // Estado para modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para guardar Id en edicion y en busqueda
  const [editResultId, setEditingResultId] = useState<number | null>(null);
  const [searchId, setSearchId] = useState<number | "">("");

  // Estado para traer el Examen para el titulo
  const [examTitle, setExamTitle] = useState<string>("");

  // Metodo para traer Examen por ID
  const { fetchExamById } = useExams();

  // Estado para mostrar las opciones por pregunta
  const [opcionesPorPregunta, setOpcionesPorPregunta] = useState<
    Record<number, ExamOption[]>
  >({});

  // Estado para mostrar las opciones editables
  const [opcionesEditables, setOpcionesEditables] = useState<
    Record<number, ExamOption[]>
  >({});

  // Estado para mostrar las preguntas
  const [displayedQuestions, setDisplayedQuestions] = useState<Question[]>([]);

  // crear question DATA
  const [formData, setFormData] = useState({
    pregunta: "",
    puntos: 0
  });

  // Traemos los examenes
  useEffect(() => {
    // si examenId no existe salimos
    if (!examId) return;

    // Fetch examen por id, y luego seteamos el titulo del examen
    fetchExamById(Number(examId)).then((data) => {
      if (data && data.exam) setExamTitle(data.exam.titulo);
    });

    // Fetch preguntas del examen
    fetchQuestionsByExam(Number(examId));
  }, [examId]);

  useEffect(() => {
    // Si questions no es array, setear array vacío
    setDisplayedQuestions(Array.isArray(questions) ? questions : []);
  }, [questions]);


  // **** ACTIONS AND STATES GROUP ****
  const opcionesState = {
    opcionesVisibles,
    setOpcionesVisibles,
    opcionesPorPregunta,
    setOpcionesPorPregunta,
    opcionesEditables,
    setOpcionesEditables,
  };

  const actions = {
    fetchOptionsByQuestions,
    deleteQuestion,
  };


  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 animate-pulse">Cargando preguntas...</p>
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
      <QuestionHeader
        navigate={navigate}
        examId={examId}
        examTitle={examTitle}
        displayedQuestions={displayedQuestions}
        updateQuestion={updateQuestion}
        fetchQuestionsByExam={fetchQuestionsByExam}
        updateExamOption={updateExamOption}
        opcionesEditables={opcionesEditables}
      />

      <QuestionAction
        setEditingResultId={setEditingResultId}
        searchId={searchId}
        setSearchId={setSearchId}
        setFormData={setFormData}
        setIsModalOpen={setIsModalOpen}
        questions={questions}
        examId={examId}
        fetchQuestionsByExam={fetchQuestionsByExam}
        setDisplayedQuestions={setDisplayedQuestions}
      />

      <div className="flex flex-col gap-4">
        {/* Hacemos un mapeo de displayedQuestions */}
        {displayedQuestions.map((q) => (
          <QuestionContent
            q={q}
            setDisplayedQuestions={setDisplayedQuestions}
            opcionesState={opcionesState}
            actions={actions}
            mostrarFormNuevaOpcion={mostrarFormNuevaOpcion}
            setMostrarFormNuevaOpcion={setMostrarFormNuevaOpcion}
          />
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96 relative">
            <h2 className="text-xl font-bold mb-4">
              {editResultId !== null ? "Editar Pregunta" : "Crear Pregunta"}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pregunta
                </label>

                <input
                  type="text"
                  value={formData.pregunta}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pregunta: String(e.target.value)
                    })
                  }
                  className="border px-3 py-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Puntos
                </label>

                <input
                  type="number"
                  value={formData.puntos}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      puntos: Number(e.target.value)
                    })
                  }
                  className="border px-3 py-2 rounded w-full" />
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>

                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  onClick={async () => {
                    try {
                      if (editResultId !== null) {
                        // actualizar pregunta existente
                        await updateQuestion(editResultId, {
                          exam_id: Number(examId), // obligatoriamente enviamos exam_id
                          pregunta: formData.pregunta,
                        });
                        toast.success("Pregunta actualizada correctamente");
                      } else {
                        // crear nueva pregunta
                        await createQuestion({
                          exam_id: Number(examId), // <-- aquí usamos el ID del examen
                          pregunta: formData.pregunta,
                          points: formData.puntos
                        });
                        toast.success("Pregunta creada correctamente");
                      }

                      // cerrar modal y refrescar lista
                      setIsModalOpen(false);
                      fetchQuestionsByExam(Number(examId));
                    } catch (error) {
                      console.error(error);
                      toast.error("Error al crear la pregunta");
                    }
                  }}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamQuestionsPage;
