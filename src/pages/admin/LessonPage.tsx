import { useEffect, useState } from "react";
import { useCourses } from "../../hooks/core/useCourses";
import { useNavigate, useParams } from "react-router-dom";
import type { Lesson, LessonDTOCreate, LessonType } from "../../types/lesson";
import { toast } from "react-toastify";

const LessonPage = () => {
  const { moduleId } = useParams();

  const navigate = useNavigate();
  const {
    loading,
    error,
    lesson,
    lessons,
    createLesson,
    fetchLessonsByModule,
    fetchLessonById,
    updateLessons,
    deleteLesson,
  } = useCourses();

  const { lessonId } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editResultId, setEditingResultId] = useState<number | null>(null);
  const [searchId, setSearchId] = useState<number | "">("");

  // edicion
  const [formData, setFormData] = useState<LessonDTOCreate>({
    module_id: Number(moduleId),
    titulo: "",
    tipo: "" as LessonType,
    contenido: "",
    orden: 0,
  });

  const [, setDisplayedLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    if (lessonId) {
      fetchLessonById(Number(lessonId));
    } else {
      fetchLessonsByModule(Number(moduleId));
    }
  }, [lessonId, moduleId]);

  useEffect(() => {
    setDisplayedLessons(lessons);
  }, [lessons]);

  useEffect(() => {
    console.log("lesson actual:", lesson);
  }, [lesson]);
  // funcion para editar
  const handleEditclick = (lesson: Lesson) => {
    setEditingResultId(lesson.id);
    setFormData({
      module_id: Number(moduleId),
      titulo: lesson.titulo,
      tipo: lesson.tipo,
      contenido: lesson.contenido,
      orden: lesson.orden,
    });
    setIsModalOpen(true);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p>Cargando lecciones...</p>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 hover:bg-gray-400 px-2 py-2 rounded"
          >
            atras
          </button>
          <div>
            <p className="text-3xl font-bold">
              Visualiza las lecciones y gestionalos
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <button
          className="rounded bg-green-400 px-4 py-2 text-white hover:bg-green-500"
          onClick={() => {
            setEditingResultId(null);
            setFormData({
              module_id: Number(moduleId),
              titulo: "",
              tipo: "texto",
              contenido: "",
              orden: 0,
            });
            setIsModalOpen(true);
          }}
        >
          Crear nueva leccion
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
                const result = lessons.find((q) => q.id === searchId);

                // Si existe entonces traemos el resultado en array si no array vacio
                setDisplayedLessons(result ? [result] : []);
              } else {
                //Si es vacio entonces mostramos todas las questions (metodo All de Hook)
                setDisplayedLessons(lessons);
              }
            }}
          >
            Buscar{" "}
          </button>

          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            onClick={() => {
              setSearchId("");
              fetchLessonsByModule(Number(moduleId)); // trae solo los del curso actual
            }}
          >
            Reset{" "}
          </button>
        </div>
      </div>

      {/* FETCH PRINCIPAL */}
      <div className="flex flex-col gap-4">
        {lessonId
          ? lesson && (
            <div className="w-full">
              <div className="bg-gray-200 p-8 rounded space-y-4">
                <div>
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="font-semibold">{lesson.id}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Título</p>
                  <p className="font-semibold">{lesson.titulo}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Tipo</p>
                  <p className="font-semibold">{lesson.tipo}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Orden</p>
                  <p className="font-semibold">{lesson.orden}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Contenido</p>
                  <div className="bg-white p-4 rounded border">
                    {lesson.contenido}
                  </div>
                </div>
              </div>
            </div>
          )
          : lessons.map((l) => (
            <div
              key={l.id}
              className="bg-white rounded-lg shadow-sm border p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{l.titulo}</p>
                <p className="text-sm text-gray-500">Tipo: {l.tipo}</p>
                <p className="text-sm text-gray-500">Orden: {l.orden}</p>
              </div>

              <div className="flex gap-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  onClick={() => handleEditclick(l)}
                >
                  Editar
                </button>

                <button
                  className="bg-red-400 text-white px-3 py-1 rounded text-sm hover:bg-red-500"
                  onClick={async () => {
                    try {
                      await deleteLesson(l.id);
                      toast.success("Lección eliminada correctamente");
                      fetchLessonsByModule(Number(moduleId));
                    } catch (error) {
                      toast.error("Error al eliminar la lección");
                    }
                  }}
                >
                  Borrar
                </button>
              </div>
            </div>
          ))}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-96 relative">
              <h2 className="text-xl font-bold mb-4">
                {editResultId !== null ? "Editar Lección" : "Crear Lección"}
              </h2>

              <div className="space-y-3">

                <div>
                  <label className="block text-sm font-medium">Título</label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) =>
                      setFormData({ ...formData, titulo: e.target.value })
                    }
                    className="border px-3 py-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Tipo</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tipo: e.target.value as LessonType,
                      })
                    }
                    className="border px-3 py-2 rounded w-full"
                  >
                    <option value="texto">Texto</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">Contenido</label>
                  <textarea
                    value={formData.contenido}
                    onChange={(e) =>
                      setFormData({ ...formData, contenido: e.target.value })
                    }
                    className="border px-3 py-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Orden</label>
                  <input
                    type="number"
                    value={formData.orden}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        orden: Number(e.target.value),
                      })
                    }
                    className="border px-3 py-2 rounded w-full"
                  />
                </div>

              </div>

              <div className="flex justify-end mt-6 gap-3">
                <button
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>

                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={async () => {
                    try {
                      if (editResultId !== null) {
                        await updateLessons(editResultId, formData);
                        toast.success("Lección actualizada correctamente");
                      } else {
                        await createLesson(formData);
                        toast.success("Lección creada correctamente");
                      }

                      setIsModalOpen(false);
                      setEditingResultId(null);
                      fetchLessonsByModule(Number(moduleId));
                    } catch (error) {
                      toast.error("Error al guardar la lección");
                    }
                  }}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPage;
