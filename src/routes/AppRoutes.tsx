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
import CourseDetailPage from "../pages/courses/CourseDetailPage";
import MyLessonPage from "../pages/students/MyLessonPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* 🔹 Redirigir "/" a "/login" */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Ruta login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas admin */}
      <Route element={<MainLayout />}>
        <Route path="/admin/results" element={<ResultsPage />} />
        <Route path="/admin/exams" element={<ExamPage />} />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute>
              <CoursePage />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/courses/:courseId" element={<CourseDetailPage />}>
          <Route index element={<Navigate to="modules" />} />
          <Route path="modules" element={<ModulePage />} />
          <Route path="students" element={<CourseStudentsPage />} />
          <Route path="exams" element={<CourseExamsPage />} />
        </Route>
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/exams/:examId/questions" element={<ExamQuestionPage />} />
        <Route
          path="/admin/courses/:courseId/modules/:moduleId/lessons/:lessonId"
          element={<LessonPage />}
        />
      </Route>

      {/* Rutas estudiante */}
      <Route element={<StudentLayout />}>
        <Route path="/student/myCourses" element={<MyCoursesPage />} />
        <Route
          path="/student/myCourses/:courseId/myModules"
          element={<MyModulesPage />}
        />
                <Route path="/exams/:id/take" element={<TakeExamPage />} />

        <Route path="/student/myModules/:moduleId/myLessons/:lessonId" element={<MyLessonPage />}></Route>
      </Route>
    </Routes>
  );
}