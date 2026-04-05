import {useEffect, useState} from "react";
import {useCourses} from "../../hooks/core/useCourses";
import type {Course} from "../../types/course";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {useAuthContext} from "../../hooks/auth/useAuthContext";

const MyCoursesPage = () => {
  const {
    courses,
    
    loading,
    error,
    fetchCoursesByStudent,
    
  } = useCourses();

  const {user} = useAuthContext(); // <--- obtenemos el usuario logueado

  const [displayedCourses, setDisplayedCourses] = useState<Course[]>([]);

  const [searchId, setSearchId] = useState<number | "">("");

  const navigate = useNavigate();
  // Search
const handleSearch = () => {
  if (searchId === "") {
    setDisplayedCourses(courses);
    return;
  }

  const filtered = courses.filter(course => course.id === searchId);

  if (filtered.length === 0) {
    toast.error("Curso no encontrado o no inscrito");
  }

  setDisplayedCourses(filtered);
};

  // reset
  const handleReset = () => {
    setSearchId("");
    setDisplayedCourses(courses);
  };

  // UseEffects
  useEffect(() => {
    if (user?.id) {
      fetchCoursesByStudent(user.id); // <--- usamos el id del context
    }
  }, [user?.id]);

  useEffect(() => {
    setDisplayedCourses(courses);
  }, [courses]);

  // Manejo de estados loading y errores
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 animate-pulse">Cargando cursos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-red font-semibold">{error}</p>
      </div>
    );
  }

  // retorno vista
  return (
    <div className="p-6 min-h-screen flex flex-col gap-8">
      {/* Botones Search */}

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Mis cursos</h1>

        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Buscar Curso"
            value={searchId}
            onChange={(e) =>
              setSearchId(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="border border-gray-200 px-4 py-2 rounded-lg w-64 focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <button
            onClick={handleSearch}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition"
          >
            Buscar
          </button>

          <button
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Reset
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col"
          >
            <img
              src={`http://localhost:8000${course.imagen_url}`}
              className="w-full h-40 object-cover"
            />

            <div className="p-4 flex flex-col gap-3 flex-1">
              <h3 className="font-semibold text-gray-800">{course.titulo}</h3>

              <p
                onClick={() => navigate(`/student/myCourses/${course.id}/myModules`)}
                className="text-xs text-gray-500 cursor-pointer"
              >
                {course.modules_count} modulos
              </p>

              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-md w-fit capitalize">
                {course.grado}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCoursesPage;
