import {useEffect, useRef, useState} from "react";
import {useExams} from "../../hooks/admin/useExams";
import type {Exam} from "../../types/exam";
import {FaEdit, FaTrash} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import {toast} from "react-toastify";
import {useCourses} from "../../hooks/core/useCourses";
import {MdCreateNewFolder} from "react-icons/md";
import {useNavigate} from "react-router-dom";

const ExamPage = () => {
  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);
  const {
    exams,
    loading,
    error,
    fetchExams,
    createExam,
    updateExam,
    deleteExam,
    fetchExamsByTitle
  } = useExams();

  const {courses, fetchCourses} = useCourses();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editResultId, setEditingResultId] = useState<number | null>(null);
  const [searchId, setSearchId] = useState<string | "">("");

  const [formData, setFormData] = useState({
    course_id: 0,
    titulo: "",
    duracion_minutos: 0,
  });

  const [displayedExams, setDisplayedExams] = useState<Exam[]>([]);
  const handleEditClick = (exam: Exam) => {
    setEditingResultId(exam.id);
    setFormData({
      course_id: exam.course_id, // ahora sí funciona
      titulo: exam.titulo,
      duracion_minutos: exam.duracion_minutos,
    });
    setIsModalOpen(true);
  };

  // llamamos a todos los examenes
  useEffect(() => {
    fetchExams();
    fetchCourses();
  }, []);

  // actualizamos los examenes segun cambie el examen
  useEffect(() => {
    setDisplayedExams(exams);
    fetchCourses();
  }, [exams, courses]);

  console.log(courses);
  useEffect(() => {

    const time = setTimeout(() => {

      // si searchId tiene un array vacio traemos los modulos por curso
      if (searchId.trim() === "") {
        fetchExams();
      }

      // sino traemos por el titulo
      else {
        fetchExamsByTitle(searchId);
      }

    }, 500)

    // limpiamos el timeOut
    return () => {
      clearTimeout(time);
    }

    // se ejecutara cada vez que searchID cambie
  }, [searchId])

  useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus();

      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [exams]);
  
  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 animate-pulse">Cargando examenes...</p>
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
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Administrador de Examenes
        </h1>
        <p className="text-gray-500 text-sm">
          Visualiza los examenes, actualizalos, eliminalos o crea uno
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <button
          className=" rounded bg-green-400 px-4 py-2 text-white hover:bg-green-500"
          onClick={() => {
            setEditingResultId(null); // 👈 importante
            setFormData({
              course_id: 0,
              titulo: "",
              duracion_minutos: NaN,
            });
            setIsModalOpen(true);
          }}
        >
          <MdCreateNewFolder size={18} />
        </button>

        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Buscar Examen"
            value={searchId}
            ref={inputRef}
            onChange={(e) =>
              setSearchId(e.target.value)
            }
            className="border px-2 py-2 rounded w-auto"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Curso</th>
                <th className="px-6 py-3 text-left">Titulo</th>
                <th className="px-6 py-3 text-left">Duracion</th>
                <th className="px-6 py-3 text-left">Preguntas</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {displayedExams.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    No hay examenes registrados
                  </td>
                </tr>
              )}
              {displayedExams.map((exam) => {
                return (
                  <tr key={exam.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium">{exam.id}</td>

                    <td className="px-6 py-4">
                      <div className="rounded-full text-white w-fit px-2 py-1"
                      style={{backgroundColor :exam.course_color}}>
                        {exam.course_titulo}
                      </div>
                    </td>

                    <td className="px-6 py-4">{exam.titulo}</td>
                    <td className="px-6 py-4">
                      {Math.floor(exam.duracion_minutos / 60)}m{" "}
                      {exam.duracion_minutos % 60}s
                    </td>

                    {/* LE PASAMOS EL ID DEL EXAMEN PARA RENDERIZAR QUESTIONS */}
                    <td
                      className="px-6 py-4 text-blue-500 cursor-pointer hover:underline"
                      onClick={() =>
                        navigate(`/admin/exams/${exam.id}/questions`)
                      }
                    >
                      {exam.questions_count}
                    </td>

                    <td className="px-6 py-4 flex gap-2">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                        onClick={() => handleEditClick(exam)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        onClick={async () => {
                          try {
                            await deleteExam(exam.id);
                            toast.success("Examen eliminado correctamente");
                          } catch (error) {
                            console.error(error);
                            toast.error("Error al eliminar el examen");
                          }
                        }}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-6 w-96 relative">
                <h2 className="text-xl font-bold mb-4">
                  {editResultId !== null ? "Editar Examen" : "Crear Examen"}
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Curso
                    </label>
                    {/* El select es un componente controlado.
                        El value depende de formData.course_id.
                        Cuando cambia, setFormData mantiene los demás campos (...formData)
                        y solo actualiza course_id con el nuevo valor seleccionado. */}

                    <select
                      value={formData.course_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          course_id: Number(e.target.value),
                        })
                      }
                      className="border px-3 py-2 rounded w-full"
                    >
                      {/* Opción inicial con valor 0.
                          Luego recorremos el array courses y creamos un <option>
                          por cada curso, usando su id como value y su titulo como texto visible. */}

                      <option value={0}>Seleccionar curso</option>

                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.titulo}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Titulo
                    </label>
                    <input
                      type="text"
                      value={formData.titulo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          titulo: String(e.target.value),
                        })
                      }
                      className="border px-3 py-2 rounded w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Duracion
                    </label>
                    <input
                      type="number"
                      value={formData.duracion_minutos}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duracion_minutos: Number(e.target.value),
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
                            // ✏️ EDITAR
                            await updateExam(editResultId, formData);
                            toast.success("Examen actualizado correctamente");
                          } else {
                            // ➕ CREAR
                            await createExam(formData);
                            toast.success("Examen creado correctamente");
                          }

                          setIsModalOpen(false);
                          setEditingResultId(null);
                          fetchExams();
                        } catch (error) {
                          console.error(error);
                          toast.error("Error al guardar el examen");
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
      </div>
    </div>
  );
};

export default ExamPage;
