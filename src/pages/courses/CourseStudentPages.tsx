import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourses } from "../../hooks/core/useCourses";
import { FaArrowLeft } from "react-icons/fa";
import { enroll } from "../../services/Enrollments.service";
import { toast } from "react-toastify";
import { useEnrollments } from "../../hooks/teachers/useEnrollment";
import { useUser } from "../../hooks/core/useUser";

const CourseStudentsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const {
    students,
    loading: loadingCourse,
    error,
    fetchStudentsByCourse,
    fetchCourseById,
    course
  } = useCourses();
  
  const {
    students: allStudents=[],
    fetchStudents,
    loading: loadingUsers
  } = useUser();

  const { enrollStudent } = useEnrollments();
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!courseId) return;

    fetchStudentsByCourse(Number(courseId));
    fetchCourseById(Number(courseId));
  }, [courseId]);

  // funcion para enrollar alumno
  const handleEnroll = () => {
    fetchStudents(); // 🔥 trae estudiantes del backend
    setModalOpen(true);
  };

  // formData
  const [formData, setFormData] = useState(
    {
      user_id: 0,
      course_id: Number(courseId)
    }
  )
  if (loadingCourse) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 animate-pulse">
          Cargando estudiantes...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 hover:bg-gray-400 px-2 py-2 rounded"
        >
          <FaArrowLeft />
        </button>

        <div>
          <h1 className="text-3xl font-bold">
            Estudiantes del curso {course?.titulo || `#${courseId}`}
          </h1>
          <p className="text-gray-500 text-sm">
            Lista de alumnos inscritos en este curso
          </p>
        </div>
      </div>

      <div>
        <button
          className="bg-blue-400 hover:bg-blue-500 text-white px-2 py-2 rounded-md"
          onClick={handleEnroll}>Agregar estudiante</button>
      </div>

      {/* LISTA */}
      <div className="bg-white shadow rounded-xl p-6">

        {students.length === 0 ? (
          <p className="text-gray-400 text-center">
            No hay estudiantes inscritos en este curso
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex justify-between items-center border p-3 rounded-lg hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {student.nombre}
                  </p>
                  <p className="text-sm text-gray-500">
                    {student.email}
                  </p>
                </div>

                {/* FUTURO: acciones */}
                <div className="flex gap-2">
                  <button className="bg-red-400 text-white px-3 py-1 rounded text-sm">
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>


        )}
      </div>
      {isModalOpen && (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-xl shadow-lg p-6 w-96 relative">
          <h2 className="text-xl font-bold mb-4">
          Agregar estudiante al curso</h2>

            <div className="space-y-3">


              <div>
                <select
                  value={formData.user_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      user_id: Number(e.target.value),
                    })
                  }
                  className="border px-3 py-2 rounded w-full"
                >
                  <option value={0}>Seleccione un estudiante</option>

                  {loadingUsers ? (
                    <option>Cargando...</option>
                  ) : (
                    allStudents.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.nombre} - {student.email}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>

                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  onClick={async () => {
                    try {

                      // ✏️ EDITAR
                      await enrollStudent(formData.user_id, formData.course_id);
                      toast.success("Alumno asignado correctamente");
                      await fetchStudentsByCourse(Number(courseId)); // 🔥 refresca lista


                      setModalOpen(false);
                    } catch (error) {
                      console.error(error);
                      toast.error("Error al asignar al alumno");
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

export default CourseStudentsPage;