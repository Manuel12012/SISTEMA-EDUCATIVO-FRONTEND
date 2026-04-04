import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useExams } from "../../hooks/admin/useExams";

const CourseExamsPage = () => {
  const { courseId } = useParams(); // courseId
  const { exams, loading, error, getByCourse } = useExams();

  useEffect(() => {
    if (courseId) {
      getByCourse(Number(courseId));
    }
  }, [courseId]);

  if (loading) return <p>Cargando exámenes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Exámenes del curso</h1>

      {exams.length === 0 ? (
        <p className="text-gray-500">Este curso no tiene exámenes</p>
      ) : (
        <div className="space-y-3">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="p-4 bg-white shadow rounded-lg flex justify-between"
            >
              <div>
                <p className="font-semibold">{exam.titulo}</p>
                <p className="text-sm text-gray-500">
                  Duración: {exam.duracion_minutos} min
                </p>
              </div>

              <button className="text-blue-500 hover:underline">
                Ver preguntas
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseExamsPage;