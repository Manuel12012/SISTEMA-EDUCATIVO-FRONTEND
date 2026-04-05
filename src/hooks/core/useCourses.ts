import { useState } from "react";
import type { Course, CourseDTOCreate, student } from "../../types/course";
import {
    getCourseById, getCourses, createCourse as createCourseService
    , updateCourse as updateCourseService
    , deleteCourse as deleteCourseService
    , uploadCourseImage,
    getStudentsByCourse
} from "../../services/courses.service";
import type { Module } from "../../types/module";
import type { Lesson, LessonDTOCreate } from "../../types/lesson";
import {
    getModuleById, getModules, createModule as createModuleService,
    updateModule as updateModuleService, deleteModule as deleteModuleService,
    getModulesByCourse
} from "../../services/modules.service";
import {
    getLessonById, getLessons, createLesson as createLessonService,
    updateLesson as updateLessonService, deleteLesson as deleteLessonService,
    getLessonsByModule
} from "../../services/lessons.service";
import { myCourses } from "../../services/Enrollments.service";



export const useCourses = () => {
    // COURSES
    const [courses, setCourses] = useState<Course[]>([]);
    const [course, setCourse] = useState<Course | null>(null);
    const [students, setStudents] = useState<student[]>([]);

    // MODULES
    const [modules, setModules] = useState<Module[]>([]);
    const [module, setModule] = useState<Module | null>(null);

    // LESSONS
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [lesson, setLesson] = useState<Lesson | null>(null);

    // STATES
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // COURSES METHODS

    const fetchCourses = async (): Promise<Course[]> => {
        try {
            setLoading(true);
            setError(null);

            const data = await getCourses();

            setCourses(data);

            return data; // 👈 FALTABA ESTO

        } catch (error) {
            setError("Error al obtener los cursos")
            throw error;

        } finally {
            setLoading(false);
        }
    }

    const fetchCoursesByStudent = async (userId: number) => {
        try {
            setLoading(true);
            setError(null);

            const data = await myCourses(userId);

            setCourses(data); return data;
        } catch (error) {
            setError("Error al obtener el curso del estudiante");
            throw (error);

        } finally {
            setLoading(false);
        }
    }
    const uploadImageHandler = async (file: File) => {
        try {
            setLoading(true);
            const { imageUrl } = await uploadCourseImage(file);
            return imageUrl;
        } catch (err: any) {
            setError(err.message || "Error al subir imagen");
            throw err;
        } finally {
            setLoading(false);
        }
    };
    const fetchCourseById = async (id: number) => {
        try {
            setLoading(true);
            setError(null);

            const data = await getCourseById(id);

            setCourse(data);
            return data;
        } catch (error) {
            setError("Error al obtener el curso");
            throw error;

        } finally {
            setLoading(false)
        }
    }

    const createCourse = async (CourseData: CourseDTOCreate) => {
        try {
            setLoading(true);
            setError(null);

            const response = await createCourseService(CourseData);

            await fetchCourses();
            return response;
        } catch (error) {
            setError("Error al crear el curso");
            throw error;
        } finally {
            setLoading(false);

        }
    }

    const updateCourse = async (id: number, payload: CourseDTOCreate) => {
        try {
            setLoading(true);
            setError(null);

            const response = await updateCourseService(id, payload);
            await fetchCourses();
            return response;
        } catch (error) {
            setError("Error al actualizar el curso")
            throw error;

        }
        finally {
            setLoading(false);
        }
    }

    const deleteCourse = async (id: number) => {
        try {
            setLoading(true);
            setError(null);

            const response = await deleteCourseService(id);

            await fetchCourses();
            return response;
        } catch (error) {
            setError("Error al eliminar el curso")
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const fetchStudentsByCourse = async(id:number) =>{
        try {
            setLoading(true);
            setError(null);

            const data = await getStudentsByCourse(id);
            setStudents(data.data);
            return data;
        } catch (error) {
            setError("Error al obtener los alumnos");
            throw error;
        } finally{
            setLoading(false);
        }
    }

    // MODULES METHODS
    const fetchModules = async (): Promise<Module[]> => {
        try {
            setLoading(true);
            setError(null);

            const data = await getModules();
            setModules(data);

            return data;

        } catch (error) {
            setError("Error al obtener los modulos");
            throw error;

        } finally {
            setLoading(false);
        }
    }

    const fetchModuleById = async (id: number) => {
        try {
            setLoading(true);
            setError(null);

            const data = await getModuleById(id);
            setModule(data);
        } catch (error) {
            setError("Error al obtener el modulo");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const createModule = async (moduleData: Omit<Module, "id">) => {
        try {
            setLoading(true);
            setError(null);

            const response = await createModuleService(moduleData);

            await fetchModules();
            return response;
        } catch (error) {
            setError("Error al crear el modulo");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const updateModule = async (id: number, payload: Partial<Module>) => {
        try {
            setLoading(true);
            setError(null);

            const response = await updateModuleService(id, payload);
            await fetchModules();
            return response;
        } catch (error) {
            setError("Error al actualizar el modulo");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const deleteModule = async (id: number) => {
        try {
            setLoading(true);
            setError(null);

            const response = await deleteModuleService(id);
            await fetchModules();
            return response;

        } catch (error) {
            setError("Error al eliminar el modulo");
            throw error;

        } finally {
            setLoading(false);
        }
    }

    const fetchModulesByCourse = async (courseId: number): Promise<Module[]> => {
        try {
            setLoading(true);
            setError(null);

            const data = await getModulesByCourse(courseId);
            setModules(data);

            return data;

        } catch (error) {
            setError("Error al obtener los modulos del curso")
            throw error;

        } finally {
            setLoading(false);
        }
    }

    // LESSONS
    const fetchLessons = async (): Promise<Lesson[]> => {
        try {
            setLoading(true);
            setError(null);

            const data = await getLessons();
            setLessons(data);

            return data
        } catch (error) {
            setError("Error al obtener la leccion");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const fetchLessonById = async (id: number): Promise<Lesson> => {
        try {
            setLoading(true);
            setError(null);

            const data = await getLessonById(id);
            setLesson(data);

            return data;

        } catch (error) {
            setError("Error al obtener las lecciones");
            throw error;

        } finally {
            setLoading(false);
        }
    }

    const createLesson = async (lessonData: LessonDTOCreate) => {
        try {
            setLoading(true);
            setError(null);

            const response = await createLessonService(lessonData);
            await fetchLessons();
            return response;
        } catch (error) {
            setError("Error al crear la leccion");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const updateLessons = async (id: number, payload: Partial<Lesson>) => {
        try {
            setLoading(true);
            setError(null);

            const response = await updateLessonService(id, payload);
            await fetchLessons();
            return response;
        } catch (error) {
            setError("Error al actualizar la leccion");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const deleteLesson = async (id: number) => {
        try {
            setLoading(true);
            setError(null);

            const response = await deleteLessonService(id);
            await fetchLessons();
            return response;
        } catch (error) {
            setError("Error al eliminar la leccion");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const fetchLessonsByModule = async (moduleId: number) => {
        try {
            setLoading(true);
            setError(null);

            const data = await getLessonsByModule(moduleId);
            setLessons(data);
            return data; // 👈 agrega esto
        } catch (error) {
            setError("Error al obtener la leccion");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    return {
        courses,
        course,
        modules,
        module,
        lessons,
        lesson,
        loading,
        error,
        students,
        // courses
        fetchCourses,
        fetchCourseById,
        createCourse,
        updateCourse,
        deleteCourse,
        uploadImageHandler,
        fetchCoursesByStudent,
        fetchStudentsByCourse,
        // modules
        fetchModules,
        fetchModuleById,
        createModule,
        updateModule,
        deleteModule,
        fetchModulesByCourse,
        // lessons
        fetchLessons,
        fetchLessonById,
        createLesson,
        updateLessons,
        deleteLesson,
        fetchLessonsByModule
    }
}
