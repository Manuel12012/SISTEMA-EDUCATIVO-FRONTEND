// Importaciones
import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {useQuestions} from "../../hooks/admin/useQuestions";
import {FaArrowLeft, FaTrash, FaRedo, FaSearch} from "react-icons/fa";
import type {Question} from "../../types/question";
import {MdCreateNewFolder} from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import {toast} from "react-toastify";
import {useExams} from "../../hooks/admin/useExams";
import type {ExamOption} from "../../types/examOption";
import {useExamOptions} from "../../hooks/admin/useExamOptions";

const ExamQuestionsPage = () => {
  // Importacion para usar el ID de la url como parametro
  const {examId} = useParams();

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

  // Estados para la visibilidad
  const [opcionesVisibles, setOpcionesVisibles] = useState<Set<number>>(
    new Set(),
  );
  const [mostrarFormNuevaOpcion, setMostrarFormNuevaOpcion] = useState<
    Set<number>
  >(new Set());

  // Estado para nueva opcion
  const [nuevaOpcion, setNuevaOpcion] = useState<Record<number, string>>({});

  // Estado para modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para guardar Id en edicion y en busqueda
  const [editResultId, setEditingResultId] = useState<number | null>(null);
  const [searchId, setSearchId] = useState<number | "">("");

  // Estado para traer el Examen para el titulo
  const [examTitle, setExamTitle] = useState<string>("");

  // Metodo para traer Examen por ID
  const {fetchExamById} = useExams();

  // Estado para mostrar las opciones por pregunta
  const [opcionesPorPregunta, setOpcionesPorPregunta] = useState<
    Record<number, ExamOption[]>
  >({});

  // Estado para mostrar las opciones editables
  const [opcionesEditables, setOpcionesEditables] = useState<
    Record<number, ExamOption[]>
  >({});

  // Metodos de useExamOptions
  const {fetchOptionsByQuestions, createExamOption, updateExamOption} =
    useExamOptions();

  // Estado para mostrar las preguntas
  const [displayedQuestions, setDisplayedQuestions] = useState<Question[]>([]);

  // crear question DATA
  const [formData, setFormData] = useState({
    pregunta: "",
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

  // Use effect para buscar por id
  useEffect(() => {
    // Mostramos todas las questions que vienen del hook
    setDisplayedQuestions(questions);
  }, [questions]);

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
      <div className="flex items-center justify-between">
        {/* IZQUIERDA: botón + título */}
        <div className="flex items-center gap-4">
          <button
            // si le damos click al boton retrocedemos un link anterior
            onClick={() => navigate(-1)}
            className="bg-gray-300 hover:bg-gray-400 px-2 py-2 rounded"
          >
            <FaArrowLeft />
          </button>

          <div>
            <h1 className="text-3xl font-bold">
              Preguntas del Examen: {examTitle || `#${examId}`}
            </h1>
            <p className="text-gray-500 text-sm">
              CRUD de preguntas relacionadas a este examen
            </p>
          </div>
        </div>

        {/* Botón guardar cambios */}
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
          onClick={async () => {
            // si el Id del Examen no existe salimos
            if (!examId) return;

            try {
              // Almacenamos el id del examen
              const examIdNumber = Number(examId);

              // Solo actualizamos las preguntas existentes
              const updates = displayedQuestions.map((q) => {
                // Retornamos y le pasamos los 2 parametros (1. Id de Question 2. La question)
                return updateQuestion(q.id, {
                  exam_id: examIdNumber,
                  pregunta: q.pregunta,
                  points: q.points,
                });
              });

              // Esperamos que se cumpla la promesas
              await Promise.all(updates);

              // Actualizamos opciones editadas (Explicame mejor esto)
              const optionUpdates = Object.entries(opcionesEditables).flatMap(
                ([, opts]) =>
                  opts.map((opt) =>
                    updateExamOption(opt.id, {
                      question_id: opt.question_id,
                      opcion: opt.opcion,
                      es_correcta: opt.es_correcta,
                    }),
                  ),
              );

              // Esperamos que se cumpla todas las promesas
              await Promise.all(optionUpdates);

              toast.success("Preguntas y opciones actualizadas correctamente");

              // Refrescamos la lista desde el backend
              fetchQuestionsByExam(examIdNumber);
            } catch (err) {
              console.error(err);
              toast.error("Error al actualizar las preguntas");
            }
          }}
        >
          Guardar cambios
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <button
          className="rounded bg-green-400 px-4 py-2 text-white hover:bg-green-500"
          onClick={() => {
            // Setemos el id en null para crear
            setEditingResultId(null);
            setFormData({
              pregunta: "",
            });

            // Abrimos modal
            setIsModalOpen(true);
          }}
        >
          <MdCreateNewFolder size={18} />
        </button>

        <div className="flex gap-2 items center">
          <input
            type="number"
            placeholder="Buscar por ID"
            value={searchId}
            onChange={(e) =>
              //Si cambia entonces el valor sera ahora el que se ingresara por input
              setSearchId(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="border px-2 py-2 rounded w-32"
          />

          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => {
              // Si SearchId no es un string vacio entonces:
              if (searchId !== "") {
                // Buscamos en find, aquellos que coincidan con el id de search
                const result = questions.find((q) => q.id === searchId);

                // Si existe entonces traemos el resultado en array si no array vacio
                setDisplayedQuestions(result ? [result] : []);
              } else {
                //Si es vacio entonces mostramos todas las questions (metodo All de Hook)
                setDisplayedQuestions(questions);
              }
            }}
          >
            <FaSearch />
          </button>

          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            onClick={() => {
              // Seteamos el setSearchId en vacio y llamamos FetchQuestions() para mostrar todas las preguntas
              setSearchId("");
              fetchQuestionsByExam(Number(examId));
            }}
          >
            <FaRedo />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Hacemos un mapeo de displayedQuestions */}
        {displayedQuestions.map((q) => (
          <div key={q.id} className="flex justify-between gap-5 w-full">
            {/* IZQUIERDA */}
            <div className="flex flex-col rounded w-3/4 bg-gray-200 px-8 py-5 gap-3">
              <p className="rounded text-xl text-black">Pregunta {q.id}</p>
              <textarea
                className="border rounded bg-white w-full"
                value={q.pregunta}
                onChange={(e) =>
                  // Si cambia entonces seteamos las questions, hacemos una copia previa y mapeamos por item, si el item.id es igual a q.id
                  // Entonces guardamos la copia ahora la pregunta sera la nueva ingresa en el input, sino solo seteamos el item
                  setDisplayedQuestions((prev) =>
                    prev.map((item) =>
                      item.id === q.id
                        ? {...item, pregunta: e.target.value}
                        : item,
                    ),
                  )
                }
              />

              <div>
                <button
                  className="cursor-pointer bg-green-400 rounded text-white px-4 py-2 text-sm"
                  onClick={async () => {
                    // Si opciones Visibles tiene el question ID
                    if (opcionesVisibles.has(q.id)) {
                      // Seteamos opciones visibles hacemos una copia previa, y borramos?
                      setOpcionesVisibles((prev) => {
                        const next = new Set(prev);
                        next.delete(q.id);
                        return next;
                      });
                      return;
                    }

                    // si no estan cargadas hacemos fetch a options
                    try {
                      if (!opcionesPorPregunta[q.id]) {
                        // llamoas al metodo y le pasamos id
                        const options = await fetchOptionsByQuestions(q.id);

                        // seteamos hacemos copia previa y ahora q.id tendra las opciones cargdas de la pregunta
                        setOpcionesPorPregunta((prev) => ({
                          ...prev,
                          [q.id]: options ?? [],
                        }));

                        // seteamos las opciones editables, hacemos copia previa y q.id tendra las opciones de la pregunta o sera un array vacio
                        setOpcionesEditables((prev) => ({
                          ...prev,
                          [q.id]: options ?? [],
                        }));
                      }

                      // Seteamos las opciones visibles y creamos uno nuevo apartir del id?
                      setOpcionesVisibles((prev) => new Set(prev).add(q.id));
                    } catch (error) {
                      console.error(error);
                      toast.error("Error al traer opciones");
                    }
                  }}
                >
                  {opcionesVisibles.has(q.id)
                    ? "Ocultar opciones"
                    : "Mostrar opciones"}
                </button>
              </div>

              {/* Si opciones visibles tiene id de question entonces mostramos: */}
              {opcionesVisibles.has(q.id) && (
                <div className="mt-4 bg-white rounded p-4 shadow-sm">
                  <h3 className="font-semibold mb-2 text-gray-700">
                    Opciones:
                  </h3>

                  {/* Si las opciones no tienen valores mostramos: */}
                  {opcionesPorPregunta[q.id]?.length === 0 && (
                    <p className="text-gray-400 text-sm">
                      No hay opciones registradas
                    </p>
                  )}

                  {/* Mapeamos opcion por opcion */}
                  {opcionesEditables[q.id]?.map((opt) => (
                    <div
                      key={opt.id}
                      className="flex items-center gap-3 border rounded p-2 mb-2"
                    >
                      {/* Radio para marcar correcta */}
                      <input
                        type="radio"
                        name={`correct-${q.id}`}
                        checked={opt.es_correcta === 1}
                        onChange={() =>
                          setOpcionesEditables((prev) => ({
                            ...prev,
                            [q.id]: prev[q.id].map((o) => ({
                              ...o,
                              es_correcta: o.id === opt.id ? 1 : 0, // 🔥 1 o 0, no true/false
                            })),
                          }))
                        }
                      />

                      {/* Input texto */}
                      <input
                        type="text"
                        value={opt.opcion}
                        onChange={(e) =>
                          setOpcionesEditables((prev) => ({
                            ...prev,
                            [q.id]: prev[q.id].map((o) =>
                              o.id === opt.id
                                ? {...o, opcion: e.target.value}
                                : o,
                            ),
                          }))
                        }
                        className="border rounded px-2 py-1 text-sm w-1/2"
                      />

                      {opt.es_correcta && (
                        <span className="text-green-600 font-semibold text-sm">
                          Correcta
                        </span>
                      )}
                    </div>
                  ))}

                  <div className="flex justify-center bg-blue-500 rounded">
                    <button
                      onClick={() => {
                        // seteamos nueva opcion, hacemos un prev, y creamos un nuevo prev?
                        setMostrarFormNuevaOpcion((prev) => {
                          const next = new Set(prev);
                          prev.has(q.id) ? next.delete(q.id) : next.add(q.id);
                          return next;
                        });
                      }}
                      className="cursor-pointer text-white px-4 py-2 text-sm"
                    >
                      + Agregar opción
                    </button>
                  </div>

                  {/* Mostramos nueva opcion si este tiene el id de Question */}
                  {mostrarFormNuevaOpcion.has(q.id) && (
                    <div className="flex gap-2 items-center border rounded p-2 mt-2 bg-yellow-50">
                      <input
                        type="text"
                        placeholder="Nueva opción..."
                        value={nuevaOpcion[q.id] ?? ""}
                        onChange={(e) =>
                          // Seteamos la nueva opcion, creamos una copia y asignamos ahora el valor ingresado
                          setNuevaOpcion((prev) => ({
                            ...prev,
                            [q.id]: e.target.value,
                          }))
                        }
                        className="border rounded px-2 py-1 text-sm w-1/2"
                      />

                      {/*Boton guardar nueva opcion */}
                      <button
                        onClick={async () => {
                          try {
                            // Llamamos al metodo del hook y le seteamos los campos
                            await createExamOption({
                              question_id: q.id,
                              opcion: nuevaOpcion[q.id] ?? "",
                              orden:
                                (opcionesPorPregunta[q.id]?.length ?? 0) + 1,
                            });

                            // refrescar opciones
                            const updated = await fetchOptionsByQuestions(q.id);
                            setOpcionesPorPregunta((prev) => ({
                              ...prev,
                              [q.id]: updated ?? [],
                            }));
                            setOpcionesEditables((prev) => ({
                              ...prev,
                              [q.id]: updated ?? [],
                            }));

                            // limpiar y ocultar form
                            setNuevaOpcion((prev) => ({...prev, [q.id]: ""}));
                            setMostrarFormNuevaOpcion((prev) => {
                              const next = new Set(prev);
                              next.delete(q.id);
                              return next;
                            });

                            toast.success("Opción creada exitosamente!");
                          } catch (error) {
                            toast.error("No se pudo crear la opción");
                          }
                        }}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Guardar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* DERECHA */}
            <div className="w-1/4 bg-gray-200 p-4 rounded flex flex-col gap-3">
              {/* aquí puedes poner botones, select, info, etc */}

              <div className="flex flex-col gap-2">
                <label>Tipo de Pregunta</label>
                <div>
                  <select name="" id="">
                    <option value="">-- Seleccione tipo ---</option>
                    <option value="">Seleccion multiple</option>
                    <option value="">Seleccion Unica</option>
                  </select>
                </div>
              </div>

              <div className="">
                <label className="">Puntos</label>
                <div className="flex gap-5">
                  <input
                    type="number"
                    value={q.points}
                    onChange={(e) =>
                      setDisplayedQuestions((prev) =>
                        prev.map((item) =>
                          item.id === q.id
                            ? {...item, points: Number(e.target.value)}
                            : item,
                        ),
                      )
                    }
                    className="border rounded px-2 py-1 w-full"
                  />
                  <p>Ptos</p>
                </div>
              </div>

              <div>
                <button
                  className="cursor-pointer bg-red-500 text-white rounded-lg px-4 py-2"
                  onClick={async () => {
                    try {
                      await deleteQuestion(q.id);
                      toast.success("Pregunta eliminada correctamente");
                    } catch (error) {
                      console.error(error);
                      toast.error("Error al eliminar la pregunta");
                    }
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
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
                      pregunta: String(e.target.value),
                    })
                  }
                  className="border px-3 py-2 rounded w-full"
                />
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
