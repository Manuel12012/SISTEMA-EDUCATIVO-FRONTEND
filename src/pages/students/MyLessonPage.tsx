import { useNavigate, useParams } from "react-router-dom";
import { useCourses } from "../../hooks/core/useCourses";
import { useEffect, useState } from "react";
import type { Lesson, LessonDTOCreate, LessonType } from "../../types/lesson";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";

const MyLessonPage= ()=>{

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

  const [lessonTitle, setLessonTitle] = useState<string>("");


  const [, setDisplayedLessons] = useState<Lesson[]>([]);

    // useEffect
    useEffect(() => {
        if (!moduleId) return;
    
        const id = Number(moduleId);
    
        fetchLessonById(id).then((lesson) => {
          if (lesson) setLessonTitle(lesson.titulo);
        });
    
        fetchLessonsByModule(id);
    
      }, [moduleId]);

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
            <FaArrowLeft />
          </button>
          <div>
            <p className="text-3xl font-bold">
              Leccion {lessonTitle}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">


      </div>

      {/* FETCH PRINCIPAL */}
      <div className="flex flex-col gap-4">
        {lessonId
          ? lesson && (
            <div className="w-full">
              <div className="bg-gray-200 p-8 rounded space-y-4">


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


            </div>
          ))}
       
      </div>
    </div>
  );

}

export default MyLessonPage;