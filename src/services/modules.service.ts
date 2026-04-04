import { api } from "./api";
import type { Module, ModuleDTOCreate } from "../types/module"

export const getModules = async (): Promise<Module[]> => {
    const { data } = await api.get<Module[]>("/modules");
    return data;
}

export const getModuless = async (params?: {
    titulo?: string;
    course_id?:number
}) => {
    const { data } = await api.get("/modules", {
        params,
    });
    return data;
}

export const getModuleById = async (id: number): Promise<Module> => {
    const { data } = await api.get<Module>(`/modules/${id}`);
    return data;
}

export const createModule = async (module: ModuleDTOCreate):
    Promise<{ message: string, id: number }> => {
    const { data } = await api.post("/modules", module);
    return data;
}

export const updateModule = async (id: number, module: Partial<Module>):
    Promise<{ message: string }> => {
    const { data } = await api.put(`/modules/${id}`, module);
    return data;
}

export const deleteModule = async (id: number): Promise<{ message: string }> => {
    const { data } = await api.delete(`/modules/${id}`);
    return data;
}

export const getModulesByCourse = async (courseId: number): Promise<Module[]> => {
    const { data } = await api.get<Module[]>(`/courses/${courseId}/modules`);
    return data;
}