// Importamos api de api.ts
import { api } from "./api";
// Importamos el type de Course y usamos Course con la firma de cada atributo
import type { Course, CourseDTOCreate, getStudents } from "../types/course";

// Creamos una funcion getCourses que se encargara de traerse los cursos GET, le decimos que sera un arreglo
export const getCourses = async (): Promise<Course[]> => {
  // extraemos solo data, await porque esperamos primjero a la base de datos ("/courses supongo que viene de las rutas de mi backend")
  const { data } = await api.get<Course[]>("/courses");
  // solo retornamos data
  return data;
  
};
// Creamos una funcion para obtener el curso por el ID tipo GET  (id: number) con esto le decimos que el id sera de tipo number
export const getCourseById = async (id: number): Promise<Course> => {
  // extraemos data. y usamos la ruta /courses/id
  const { data } = await api.get<Course>(`/courses/${id}`);
  return data;
};

// Funcion para crear un curso
export const createCourse = async (
  // omit es para omitir el id, porque al crear el id se creara desde el backend?
  course: CourseDTOCreate
  // con Promise haremos que luego se muestre message e id? que vienen del backend, en este caso cursos creado correctamente (o algo asi)
): Promise<{ message: string; id: number }> => {
  const { data } = await api.post("/courses", course);
  return data;
};

// Funcion para actualizar el curso
export const updateCourse = async (
  id: number,
  //Partial usamos para que acepte algunos campos actualizados y no todos quizas?
  course: CourseDTOCreate
  // y hacemos una promesa (Promise) que se enviara un mensaje luego de tipo string? "curso actualizado"
): Promise<{ message: string }> => {
  const { data } = await api.put(`/courses/${id}`, course);
  return data;
};

// Funcion para borrar el curso
export const deleteCourse = async (
  // aqui no entiendo porque le dice que el id sera async?
  id: number
  // hacemos uina promesa que devolvera un mensaje de tipo string "curso eliminado"
): Promise<{ message: string }> => {
  const { data } = await api.delete(`/courses/${id}`);
  return data;
};
export const uploadCourseImage = async (file: File): Promise<{ imageUrl: string }> => {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await api.post("/courses/upload", formData);

  return data;
};

export const getStudentsByCourse = async(id: number): Promise<getStudents> => {
const {data} = await api.get<getStudents>(`/courses/${id}/students`);
return data;
}