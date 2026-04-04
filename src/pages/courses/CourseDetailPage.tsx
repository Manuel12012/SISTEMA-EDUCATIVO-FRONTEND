// pages/admin/CourseDetailPage.tsx

import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Gestión del Curso</h1>

      {/* 🔥 TABS */}
      <div className="flex gap-4 border-b pb-2">
        <button
          className={isActive("modules") ? "font-bold border-b-2" : ""}
          onClick={() => navigate(`/admin/courses/${courseId}/modules`)}
        >
          📚 Módulos
        </button>

        <button
          className={isActive("students") ? "font-bold border-b-2" : ""}
          onClick={() => navigate(`/admin/courses/${courseId}/students`)}
        >
          👥 Estudiantes
        </button>

        <button
          className={isActive("exams") ? "font-bold border-b-2" : ""}
          onClick={() => navigate(`/admin/courses/${courseId}/exams`)}
        >
          📝 Exámenes
        </button>
      </div>

      {/* 🔥 CONTENIDO */}
      <Outlet />
    </div>
  );
};

export default CourseDetailPage;