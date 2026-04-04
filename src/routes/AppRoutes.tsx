import { Routes, Route, Navigate } from "react-router-dom";
import ResultsPage from "../pages/admin/ResultsPage";
import ExamPage from "../pages/admin/ExamPage";
import MainLayout from "../layouts/admin/MainLayout";
import CoursePage from "../pages/admin/CoursePage";
import UsersPage from "../pages/admin/UsersPage";
import ExamQuestionPage from "../pages/admin/ExamQuestionPage";
import ModulePage from "../pages/ModulePage";
import LessonPage from "../pages/admin/LessonPage";
import TakeExamPage from "../pages/admin/TakeExamPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import MyCoursesPage from "../pages/students/MyCoursesPage";
import StudentLayout from "../layouts/student/StudentLayout";
import MyModulesPage from "../pages/students/MyModulesPage";
import CourseStudentsPage from "../pages/courses/CourseStudentPages";
import CourseExamsPage from "../pages/courses/CourseExamPage";
import CourseDetailPage from "../pages/courses/CourseDetailPage"; // 🔥 NUEVO

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<MainLayout />}>
        <Route path="/admin/results" element={<ResultsPage />} />
        <Route path="/admin/exams" element={<ExamPage />} />

        {/* LISTA DE CURSOS */}
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute>
              <CoursePage />
            </ProtectedRoute>
          }
        />

        {/* 🔥 NUEVA ESTRUCTURA CON TABS */}
        <Route
          path="/admin/courses/:courseId"
          element={<CourseDetailPage />}
        >
          <Route index element={<Navigate to="modules" />} />
          <Route path="modules" element={<ModulePage />} />
          <Route path="students" element={<CourseStudentsPage />} />
          <Route path="exams" element={<CourseExamsPage />} />
        </Route>

        {/* 🔒 TUS RUTAS ANTIGUAS (NO SE BORRAN) */}
        <Route
          path="/admin/courses/:courseId/students"
          element={<CourseStudentsPage />}
        />

        <Route
          path="/admin/courses/:courseId/modules"
          element={<ModulePage />}
        />

        {/* ❗ INCONSISTENTE PERO LO DEJAMOS */}
        <Route
          path="/courses/:id/exams"
          element={<CourseExamsPage />}
        />

        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/exams/:id/take" element={<TakeExamPage />} />

        <Route
          path="/admin/exams/:examId/questions"
          element={<ExamQuestionPage />}
        />

        <Route
          path="/admin/courses/:courseId/modules/:moduleId/lessons/:lessonId"
          element={<LessonPage />}
        />
      </Route>

      <Route element={<StudentLayout />}>
        <Route path="/student/myCourses" element={<MyCoursesPage />} />
        <Route
          path="/student/myCourses/:courseId/myModules"
          element={<MyModulesPage />}
        />
      </Route>
    </Routes>
  );
}