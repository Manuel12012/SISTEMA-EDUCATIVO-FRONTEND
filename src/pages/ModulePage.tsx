import {useNavigate, useParams} from "react-router-dom";
import {useModule} from "../hooks/core/useModule";
import {useEffect, useState} from "react";
import {useCourses} from "../hooks/core/useCourses";
import type {Lesson, LessonType} from "../types/lesson";
import type {Module} from "../types/module";
import {FaArrowLeft, FaRedo, FaSearch} from "react-icons/fa";
import {MdCreateNewFolder} from "react-icons/md";
import {toast} from "react-toastify";

const ModulePage = () => {
  const {courseId} = useParams();

  const navigate = useNavigate();

  const {
    modules,
    loading,
    error,
    createModule,
    updateModule,
    deleteModule,
    fetchModulesByCourse,
  } = useModule();

  const [leccionesVisibles, setLeccionesVisibles] = useState<Set<number>>(
    new Set(),
  );
  const [mostrarFormNuevaLeccion, setMostrarFormNuevaLeccion] = useState<
    Set<number>
  >(new Set());

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editResultId, setEditingResultId] = useState<number | null>(null);
  const [searchId, setSearchId] = useState<number | "">("");

  const [courseTitle, setCourseTitle] = useState<string>("");

  const [leccionesPorModulo, setLeccionesPorModulo] = useState<
    Record<number, Lesson[]>
  >({});

  const [, setLeccionesEditables] = useState<
    Record<number, Lesson[]>
  >({});

  const [nuevaLeccion, setNuevaLeccion] = useState<
    Record<
      number,
      {
        titulo: string;
        tipo: LessonType;
        contenido: string;
        orden: number;
      }
    >
  >({}); // Falta implmentar hooks de Lessons
  const {fetchCourseById, fetchLessonsByModule, createLesson} = useCourses();

  const [displayedModules, setDisplayedModules] = useState<Module[]>([]);

  const [formData, setFormData] = useState({
    course_id: 0,
    titulo: "",
    orden: 0,
  });

  useEffect(() => {
    if (!courseId) return;

    fetchCourseById(Number(courseId)).then((course) => {
      if (course) setCourseTitle(course.titulo);
    });

    fetchModulesByCourse(Number(courseId));
  }, [courseId]);

  useEffect(() => {
    setDisplayedModules(modules);
  }, [modules]);

  // funciones para editar
  const handleEditClick = (module: Module) => {
    setEditingResultId(module.id);
    setFormData({
      course_id: module.course_id,
      titulo: module.titulo,
      orden: module.orden,
    });
    setIsModalOpen(true);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 animate-pulse">Cargando modulos...</p>
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
        <div className="flex items-center gap-4 ">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 hover:bg-gray-400 px-2 py-2 rounded"
          >
            <FaArrowLeft />
          </button>

          <div>
            <h1 className="text-3xl font-bold">
              Modulos del Curso {courseTitle || `#${courseId}`}
            </h1>

            <p className="text-gray-500 text-sm">
              Visualiza los modulos y sus lecciones respectivas
            </p>
          </div>
        </div>

        {/*Boton de guardar cambios */}
      </div>

      <div className="flex justify-between items-center mb-4">
        <button
          className="rounded bg-green-400 px-4 py-2 text-white hover:bg-green-500"
          onClick={() => {
            setEditingResultId(null);
            setFormData({
              course_id: Number(courseId),
              titulo: "",
              orden: 0,
            });

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
                const result = modules.find((q) => q.id === searchId);

                // Si existe entonces traemos el resultado en array si no array vacio
                setDisplayedModules(result ? [result] : []);
              } else {
                //Si es vacio entonces mostramos todas las questions (metodo All de Hook)
                setDisplayedModules(modules);
              }
            }}
          >
            <FaSearch />
          </button>

          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            onClick={() => {
              setSearchId("");
              fetchModulesByCourse(Number(courseId)); // trae solo los del curso actual
            }}
          >
            <FaRedo />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {displayedModules.map((m) => (
          <div key={m.id} className="flex justify-between gap-5 w-full">
            <div className="flex flex-col bg-gray-200 px-8 py-8 gap-3 rounded text-md w-full">
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="text-sm text-gray-500">Modulo {m.id}</p>
                  <label className="font-semibold text-gray-800">
                    {m.titulo}
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    className="bg-red-400 text-white rounded px-4 py-2"
                    onClick={async () => {
                      try {
                        await deleteModule(m.id);
                        toast.success("Módulo eliminado correctamente");
                        fetchModulesByCourse(Number(courseId)); // 👈 refresca la lista
                      } catch (error) {
                        console.error(error);
                        toast.error("Error al eliminar el módulo");
                      }
                    }}
                  >
                    Eliminar
                  </button>

                  <button
                    className="bg-yellow-400 text-white rounded px-4 py-2"
                    onClick={() => handleEditClick(m)}
                  >
                    Editar
                  </button>

                  <button
                    className="bg-purple-400 text-white rounded px-4 py-2"
                    onClick={async () => {
                      if (leccionesVisibles.has(m.id)) {
                        setLeccionesVisibles((prev) => {
                          const next = new Set(prev);
                          next.delete(m.id);
                          return next;
                        });
                        return;
                      }

                      try {
                        if (!leccionesPorModulo[m.id]) {
                          const lessons = await fetchLessonsByModule(m.id);

                          setLeccionesPorModulo((prev) => ({
                            ...prev,
                            [m.id]: lessons ?? [],
                          }));

                          setLeccionesEditables((prev) => ({
                            ...prev,
                            [m.id]: lessons ?? [],
                          }));
                        }
                        setLeccionesVisibles((prev) => new Set(prev).add(m.id));
                      } catch (error) {
                        console.error(error);
                      }
                    }}
                  >
                    {leccionesVisibles.has(m.id)
                      ? "Ocultar lecciones"
                      : "Mostrar lecciones"}
                  </button>
                </div>
              </div>
              {leccionesVisibles.has(m.id) && (
                <div className="mt-4 bg-white rounded p-4 shadow-sm">
                  <h3 className="font-semibold mb-2 text-gray-700">
                    Lecciones:
                  </h3>

                  {leccionesPorModulo[m.id]?.length === 0 && (
                    <p className="text-gray-400 text-sm">
                      No hay lecciones registradas
                    </p>
                  )}

                  {leccionesPorModulo[m.id]?.map((opt) => (
                    <div
                      key={opt.id}
                      className="flex gap-2 items-center border rounded p-2 mb-2"
                      onClick={() => {}}
                    >
                      <div className="">{opt.id}</div>
                      {".-"}
                      <div className="">{opt.titulo}</div>
                      <div className="ml-auto">
                      <button className="bg-blue-400 px-2 py-1 text-white rounded"
                      onClick={()=>
                        navigate(
                           `/admin/courses/${courseId}/modules/${m.id}/lessons/${opt.id}`
                        )
                      }>
                        Ir
                      </button>
                      </div>

                    </div>
                  ))}

                  <div className="flex justify-center bg-blue-500 rounded ">
                    <button
                      onClick={() => {
                        setMostrarFormNuevaLeccion((prev) => {
                          const next = new Set(prev);

                          if (prev.has(m.id)) {
                            next.delete(m.id);
                          } else {
                            next.add(m.id);

                            // 👇 Inicializar lección si no existe
                            setNuevaLeccion((prevLesson) => ({
                              ...prevLesson,
                              [m.id]: {
                                titulo: "",
                                tipo: "texto",
                                contenido: "",
                                orden: 0,
                              },
                            }));
                          }

                          return next;
                        });
                      }}
                      className="text-white px-4 py-2"
                    >
                      + Agregar leccion
                    </button>
                  </div>

                  {mostrarFormNuevaLeccion.has(m.id) && (
                    <div className="flex gap-2 items-center border rounded p-2 mt-2 bg-yellow-50">
                      <div className="flex flex-col gap-2 border rounded p-3 mt-2 bg-yellow-50">
                        {/* TITULO */}
                        <input
                          type="text"
                          placeholder="Título"
                          value={nuevaLeccion[m.id]?.titulo ?? ""}
                          onChange={(e) =>
                            setNuevaLeccion((prev) => ({
                              ...prev,
                              [m.id]: {
                                ...prev[m.id],
                                titulo: e.target.value,
                              },
                            }))
                          }
                          className="border rounded px-2 py-1 text-sm"
                        />

                        {/* TIPO */}
                        <select
                          value={nuevaLeccion[m.id]?.tipo ?? "texto"}
                          onChange={(e) =>
                            setNuevaLeccion((prev) => ({
                              ...prev,
                              [m.id]: {
                                ...prev[m.id],
                                tipo: e.target.value as LessonType,
                              },
                            }))
                          }
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="texto">Texto</option>
                          <option value="video">Video</option>
                          <option value="imagen">Imagen</option>
                          <option value="simulacion">Simulación</option>
                        </select>

                        {/* CONTENIDO */}
                        <input
                          type="text"
                          placeholder="Contenido (URL o texto)"
                          value={nuevaLeccion[m.id]?.contenido ?? ""}
                          onChange={(e) =>
                            setNuevaLeccion((prev) => ({
                              ...prev,
                              [m.id]: {
                                ...prev[m.id],
                                contenido: e.target.value,
                              },
                            }))
                          }
                          className="border rounded px-2 py-1 text-sm"
                        />

                        {/* ORDEN */}
                        <input
                          type="number"
                          placeholder="Orden"
                          value={nuevaLeccion[m.id]?.orden ?? 0}
                          onChange={(e) =>
                            setNuevaLeccion((prev) => ({
                              ...prev,
                              [m.id]: {
                                ...prev[m.id],
                                orden: Number(e.target.value),
                              },
                            }))
                          }
                          className="border rounded px-2 py-1 text-sm"
                        />

                        <button
                          className="bg-green-500 text-white rounded px-3 py-1 mt-2"
                          onClick={async () => {
                            try {
                              const data = nuevaLeccion[m.id];

                              if (!data?.titulo) {
                                toast.error("El título es obligatorio");
                                return;
                              }

                              // 🔥 AQUÍ ESTABA EL ERROR — faltaba esto
                              await createLesson({
                                module_id: m.id,
                                titulo: data.titulo,
                                tipo: data.tipo,
                                contenido: data.contenido,
                                orden: data.orden,
                              });

                              // Luego refrescamos
                              const updated = await fetchLessonsByModule(m.id);

                              setLeccionesPorModulo((prev) => ({
                                ...prev,
                                [m.id]: updated ?? [],
                              }));

                              // limpiar formulario
                              setNuevaLeccion((prev) => {
                                const copy = {...prev};
                                delete copy[m.id];
                                return copy;
                              });

                              setMostrarFormNuevaLeccion((prev) => {
                                const next = new Set(prev);
                                next.delete(m.id);
                                return next;
                              });

                              toast.success("Lección creada correctamente");
                            } catch (error) {
                              console.error(error);
                              toast.error("No se pudo crear la lección");
                            }
                          }}
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-96 relative">
              <h2 className="text-xl font-bold mb-4">
                {editResultId !== null ? "Editar Modulo" : "Crear Modulo"}
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Titulo
                  </label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) =>
                      setFormData({...formData, titulo: e.target.value})
                    }
                    className="border px-3 py-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Orden
                  </label>
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
                          await updateModule(editResultId, formData);
                          toast.success("Módulo actualizado correctamente");
                        } else {
                          await createModule(formData); // course_id ya viene en formData desde el botón
                          toast.success("Módulo creado correctamente");
                        }
                        setIsModalOpen(false);
                        fetchModulesByCourse(Number(courseId));
                      } catch (error) {
                        console.error(error);
                        toast.error("Error al guardar el módulo");
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
      <button
  onClick={() => navigate(`/admin/courses/${courseId}/students`)}
  className="bg-blue-500 text-white px-4 py-2 rounded"
>
  Ver estudiantes
</button>
    </div>
  );
};

export default ModulePage;
