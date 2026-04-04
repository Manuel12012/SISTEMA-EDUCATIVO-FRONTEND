import { useState } from "react"
import {
    getModuleById, getModules
    , createModule as createModuleService, updateModule as updateModuleService,
    deleteModule as deleteModuleService, getModulesByCourse,
    getModuless
} from "../../services/modules.service";
import type { Module } from "../../types/module";

export const useModule = () => {

    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false);


    // MODULES
    const [modules, setModules] = useState<Module[]>([]);
    const [module, setModule] = useState<Module | null>(null);



    // MODULES METHODS
    const fetchModules = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getModules();
            setModules(data);

        } catch (error) {
            setError("Error al obtener los modulos");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const fetchModulesByTitle = async(titulo?:string, course_id?:number)=>{
        try {
            setLoading(true);
            setError(null);

            const data = await getModuless({titulo,course_id});
            setModules(data);

        } catch (error) {
            setError("Error al obtener el titulo");
        } finally{
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

    const fetchModulesByCourse = async (courseId: number) => {
        try {
            setLoading(true);
            setError(null);

            const data = await getModulesByCourse(courseId);
            setModules(data);
        } catch (error) {
            setError("Error al obtener los modulos del curso")
            throw error;
        } finally {
            setLoading(false);
        }
    }


    return {
        error,
        loading,
        module,
        modules,
        fetchModules,
        fetchModuleById,
        createModule,
        updateModule,
        deleteModule,
        fetchModulesByCourse,
        fetchModulesByTitle
    }
}

