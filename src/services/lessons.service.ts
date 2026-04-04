import { api } from "./api";
import type { Lesson, LessonDTOCreate } from "../types/lesson"

export const getLessons = async (): Promise<Lesson[]> => {
    const { data } = await api.get<Lesson[]>("/lessons");
    return data;
}

export const getLessonById = async (id: number): Promise<Lesson> => {
    const { data } = await api.get<Lesson>(`/lessons/${id}`);
    return data;
}

export const createLesson = async (lesson: LessonDTOCreate):
    Promise<{ message: string, id: number }> => {
    const { data } = await api.post("/lessons", lesson);
    return data;
}

export const updateLesson = async (id: number, lesson: Partial<Lesson>):
    Promise<{ message: string }> => {
    const { data } = await api.put(`/lessons/${id}`, lesson);
    return data;
}   

export const deleteLesson = async (id: number): Promise<{ message: string }> => {
    const { data } = await api.delete(`/lessons/${id}`);
    return data;
}
// como el backend traera varios lessons de un modulo le asignamos corchetes de arreglo
export const getLessonsByModule = async(moduleId: number): Promise<Lesson[]> =>{
    const {data} = await api.get<Lesson[]>(`/modules/${moduleId}/lessons`);
    return data;
}

