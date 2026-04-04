import { useState } from "react";
import type { ExamResult } from "../../types/examResult";
import { getResults, getResultsById, updateResult as updateResultService, deleteResult as deleteResultService } from "../../services/examResults.service";

export const useExamResults = () => {
    //EXAM RESULTS
    const [examResults, setExamResults] = useState<ExamResult[]>([]);
    const [examResult, setExamResult] = useState<ExamResult | null>(null);


    // INTERFAZ DE USUARIO
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const fetchResults = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getResults();
            setExamResults(data);

        } catch (error) {
            setError("Error al obtener los resultados");
        } finally {
            setLoading(false);
        }
    }

    const fetchResultsById = async (id: number) => {
        try {
            setLoading(true);
            setError(null);

            const data = await getResultsById(id);
            setExamResult(data);
            return data;
        } catch (error) {
            setError("Error al obtener el resultado del usuario")
            throw error;
        } finally {
            setLoading(false);
        }
    }


    const updateResult = async (id: number, examResult: Partial<ExamResult>) => {
        try {
            setLoading(true);
            setError(null);

            const response = await updateResultService(id, examResult);
            await fetchResults();

            return response;
        } catch (error) {
            setError("Error al actualizar el resultado");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const deleteResult = async (id: number) => {
        try {
            setLoading(true);
            setError(null);

            const response = await deleteResultService(id);
            setExamResults(prev => prev.filter(result => result.id !== id));

            return response;
        } catch (error) {
            setError("Error al eliminar el resultado");
            throw error;
        } finally {
            setLoading(false);
        }
    }
    return {
        examResults,
        examResult,
        loading,
        error,
        fetchResults,
        fetchResultsById,
        updateResult,
        deleteResult
    }


}