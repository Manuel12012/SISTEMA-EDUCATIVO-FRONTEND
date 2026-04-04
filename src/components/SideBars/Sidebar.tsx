import {NavLink} from "react-router-dom";
import {
  FaClipboardList,
  FaChartBar,
  FaBook,
  FaHome,
  FaUser,
} from "react-icons/fa";
import { useAuthContext } from "../../hooks/auth/useAuthContext";

const Sidebar = () => {
  const {logout} = useAuthContext();
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0 shadow-lg">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold tracking-wide">Sistema Educativo</h1>
        <p className="text-sm text-gray-400">Panel Administrativo</p>
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
          to="admin/exams"
          className={({isActive}) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          <FaClipboardList />
          Exámenes
        </NavLink>

        <NavLink
          to="admin/results"
          className={({isActive}) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          <FaChartBar />
          Resultados
        </NavLink>

        <NavLink
          to="admin/courses"
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

        <NavLink
          to="admin/users"
          className={({isActive}) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          <FaUser />
          Usuarios
        </NavLink>

        <div
        className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-800 hover:text-white text-gray-300 
        cursor-pointer"
        >
          <button onClick={logout}>
            Cerrar sesion
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
