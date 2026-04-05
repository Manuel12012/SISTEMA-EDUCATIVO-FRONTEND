import {NavLink} from "react-router-dom";
import {

  FaBook,
  FaHome,
} from "react-icons/fa";
import {useAuthContext} from "../../hooks/auth/useAuthContext";

const SideBarStudents = () => {
  const {logout} = useAuthContext();

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0 shadow-lg">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold tracking-wide">
          Plataforma Educativa
        </h1>
        <p>¡Bienvenido Estudiante!</p>
      </div>

      <nav className="flex flex-col p-4 gap-2">
        <NavLink
          to="/"
          className={({isActive}) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          <FaHome />
          Inicio
        </NavLink>

        <NavLink
          to="student/myCourses"
          className={({isActive}) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          <FaBook />
          Cursos
        </NavLink>

        <div>
            <button onClick={logout}
            className="hover:bg-gray-800 flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full">
                Cerrar Sesion
            </button>
        </div>
      </nav>
    </aside>
  );
};

export default SideBarStudents;
