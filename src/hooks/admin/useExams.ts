import { useState } from "react";
import { getExamById, getExams, createExam as createExamService, updateExam as updateExamService, deleteExam as deleteExamService, getExamsByCourse } from "../../services/exams.service";
import type { Exam, ExamDTOCreate } from "../../types/exam";


export const useExams = () => {
    // EXAMS
    const [exams, setExams] = useState<Exam[]>([]);
    const [exam, setExam] = useState<Exam | null>(null);

    // INTERFAZ DE USUARIO
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // EXAMS METHODS
    const fetchExams = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getExams();
            setExams(data);
            return data;
        } catch (error) {
            setError("Error al obtener los examenes");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const fetchExamById = async (id: number) => {
        try {
            setLoading(true);
            setError(null);

            const data = await getExamById(id);
            setExam(data.exam);
            return data;
        } catch (error) {
            setError("Error al obtener el examen");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createExam = async (exam: ExamDTOCreate) => {
        try {
            setLoading(true);
            setError(null);

            const response = await createExamService(exam);
            await fetchExams();

            return response;
        } catch (error) {
            setError("Error al crear el examen");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateExam = async (id: number, exam: ExamDTOCreate) => {
        try {
            setLoading(true);
            setError(null);

            const response = await updateExamService(id, exam);
            await fetchExams();

            return response;
        } catch (error) {
            setError("Error al actualizar el examen");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteExam = async (id: number) => {
        try {
            setLoading(true);
            setError(null);

            const response = await deleteExamService(id);
            await fetchExams();

            return response;
        } catch (error) {
            setError("Error al eliminar el examen");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getByCourse = async(id: number) =>{
        try {
            setLoading(true);
            setError(null);

            const data = await getExamsByCourse(id);
            setExams(data);
            return data;
        } catch (error) {
            setError("Error al obtener los examenes");
            throw error;
        } finally{
            setLoading(false);
        }
    }
    return {
        exam,
        exams,
        loading,
        error,
        fetchExams,
        fetchExamById,
        createExam,
        updateExam,
        deleteExam,
        getByCourse
    }
}