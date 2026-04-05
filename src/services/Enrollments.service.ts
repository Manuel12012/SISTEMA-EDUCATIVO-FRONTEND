import { api } from "./api";
import type { Course } from "../types/course";

// Crear inscripción
export const enroll = async (
  userId: number,
  courseId: number
): Promise<{ message: string; id: number }> => {
  const { data } = await api.post("/enrollments", {
    user_id: userId,
    course_id: courseId,
  });
  return data;
};

// Obtener los cursos en los que está inscrito un usuario
export const myCourses = async (userId: number): Promise<Course[]> => {
  const { data } = await api.get<Course[]>(`/enrollment/user/${userId}`);
  return data;
};