import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/auth/useAuthContext";

export const LoginPage = () => {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login({ email, password });

      if (response.token) {
        switch (response.user.rol) {
          case "admin":
            navigate("/admin/results");
            break;
          case "estudiante":
            navigate("/student/myCourses");
            break;
          case "docente":
            navigate("/teacher/courses");
            break;
          default:
            navigate("/login");
        }
      }
    } catch (error) {
      console.error("Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE (branding) */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10">
        <div>
          <h1 className="text-4xl font-bold mb-4">Sistema Educativo Full Stack</h1>
          <p className="text-lg opacity-80">
            Gestiona cursos, estudiantes y exámenes de forma inteligente.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE (form) */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-100 px-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md backdrop-blur-lg bg-white/70 p-8 rounded-2xl shadow-xl"
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Bienvenido
          </h2>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-6 relative">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* SHOW PASSWORD */}
            <span
              className="absolute right-3 top-10 cursor-pointer text-gray-500 text-sm"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Ocultar" : "Ver"}
            </span>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 text-white font-medium hover:bg-blue-700 transition transform hover:scale-[1.02]"
          >
            Ingresar
          </button>

          {/* EXTRA */}
          <p className="text-center text-sm text-gray-500 mt-4">
            ¿Olvidaste tu contraseña?
          </p>
        </form>
      </div>
    </div>
  );
};