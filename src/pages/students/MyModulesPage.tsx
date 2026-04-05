import { useNavigate, useParams } from "react-router-dom";
import { useModule } from "../../hooks/core/useModule";
import { useEffect, useRef, useState } from "react";
import { useCourses } from "../../hooks/core/useCourses";
import type { Lesson } from "../../types/lesson";
import type { Module } from "../../types/module";
import { FaArrowLeft} from "react-icons/fa";
import { useExams } from "../../hooks/admin/useExams";
import type { Exam } from "../../types/exam";

const MyModulesPage = () => {
  // recibimos el id
  const { courseId } = useParams();

  const inputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const {
    modules,
    loading,
    error,
    fetchModulesByTitle,
    fetchModulesByCourse,
  } = useModule();

  const { exams, getByCourse } = useExams();

  const [leccionesVisibles, setLeccionesVisibles] = useState<Set<number>>(
    new Set(),
  );

  const [searchId, setSearchId] = useState<string | "">("");

  const [courseTitle, setCourseTitle] = useState<string>("");

  const { fetchCourseById, fetchLessonsByModule } = useCourses();

  const [leccionesPorModulo, setLeccionesPorModulo] = useState<
    Record<number, Lesson[]>
  >({});

  const [displayedModules, setDisplayedModules] = useState<Module[]>([]);

  const [displayedExams, setDisplayedExams] = useState<Exam[]>([]);

  // useEffect
  useEffect(() => {
    if (!courseId) return;

    const id = Number(courseId);

    fetchCourseById(id).then((course) => {
      if (course) setCourseTitle(course.titulo);
    });

    fetchModulesByCourse(id);

    // aquí cargamos los examenes
    getByCourse(id);
  }, [courseId]);

  // useEffect
  useEffect(() => {
    setDisplayedModules(modules);
  }, [modules]);

  useEffect(() => {
    setDisplayedExams(exams);
  }, [exams]);

  // useEffect para busqueda
  useEffect(() => {

    const time = setTimeout(() => {
      // validamos que courseId exista
      if (!courseId) return;

      // si searchId tiene un array vacio traemos los modulos por curso
      if (searchId.trim() === "") {
        fetchModulesByCourse(Number(courseId));
      }

      // sino traemos por el titulo
      else {
        fetchModulesByTitle(searchId, Number(courseId));
      }

    }, 500)

    // limpiamos el timeOut
    return () => {
      clearTimeout(time);
    }

    // se ejecutara cada vez que searchID cambie
  }, [searchId, courseId])

  // useEffect para focus en el input
  useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus();

      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [modules]);
  // manejo de errores
  if (error)
    return (
      <div className="p-6">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );

  // manejo de loading
  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 animate-pulse">Cargando modulos...</p>
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        {/* IZQUIERDA: botón + título */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 hover:bg-gray-400 px-2 py-2 rounded"
          >
            <FaArrowLeft />
          </button>

          <div>
            <h1 className="text-3xl font-bold">
              Modulos del curso {courseTitle || `#${courseId}`}
            </h1>

            <p className="text-gray-500 text-sm">
              Visualiza los modulos y sus lecciones respectivas
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div></div>
        <div className="flex gap-2 items center">
          <input
            type="text"
            placeholder="Buscar Modulo"
            value={searchId}
            ref={inputRef}
            onChange={(e) =>
              //Si cambia entonces el valor sera ahora el que se ingresara por input
              setSearchId(e.target.value)
            }
            className="border px-2 py-2 rounded w-auto"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Modulos del curso</h2>
            {displayedModules.length===0 &&(
              <div>No hay resultados</div>
            )}
        {displayedModules.map((m) => (
          <div key={m.id} className="flex justify-between gap-5 w-full">
            <div className="flex flex-col bg-gray-200 p-4 gap-3 rounded text-md w-full">
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="text-sm text-gray-500">Modulo {m.id}</p>
                  <label className="font-semibold text-gray-800">
                    {m.titulo}
                  </label>
                </div>

                <div className="flex gap-3">
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
                      onClick={() => { }}
                    >
                      <div className="">{opt.id}</div>
                      {".-"}
                      <div className="">{opt.titulo}</div>
                      <div className="ml-auto">
                        <button
                          className="bg-blue-400 px-2 py-1 text-white rounded"
                          onClick={() =>
                            navigate(
                              `/admin/courses/${courseId}/modules/${m.id}/lessons/${opt.id}`,
                            )
                          }
                        >
                          Ir
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-center bg-blue-500 rounded "></div>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-4 mt-6">
          <h2 className="text-xl font-semibold">Exámenes del curso</h2>

          {displayedExams.length === 0 && (
            <p className="text-gray-400">No hay exámenes en este curso</p>
          )}

          {displayedExams.map((e) => (
            <div
              key={e.id}
              className="flex justify-between items-center bg-gray-200 p-4 rounded"
            >
              <div>
                <p className="text-sm text-gray-500">Examen {e.id}</p>

                <h3 className="font-semibold">{e.titulo}</h3>
              </div>

              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={() => {
                  navigate(`/exams/${e.id}/take`);
                }}
              >
                Tomar examen
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default MyModulesPage;
