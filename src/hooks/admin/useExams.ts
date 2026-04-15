import { useReducer } from "react";
import { getExamById, getExams, getExamss, createExam as createExamService, updateExam as updateExamService, deleteExam as deleteExamService } from "../../services/exams.service";
import { examReducer, initialState } from "../../reducers/exam-reducer";
import type { ExamDTOCreate } from "../../types/exam";

export const useExams = () => {
    const [state, dispatch] = useReducer(examReducer, initialState);

    const fetchExams = async () => {
        try {
            dispatch({ type: "FETCH_START" });

            const data = await getExams();

            dispatch({ type: "FETCH_SUCCESS", payload: data });

            return data;
        } catch (error) {
            dispatch({
                type: "FETCH_ERROR",
                payload: "Error al obtener los examenes",
            });
            throw error;
        }
    };

    const fetchExamsByTitle = async (titulo?: string) => {
        try {
            dispatch({ type: "FETCH_START" });

            const data = await getExamss({ titulo });

            dispatch({ type: "FETCH_SUCCESS", payload: data });
        } catch (error) {
            dispatch({
                type: "FETCH_ERROR",
                payload: "Error al buscar examenes",
            });
        }
    };

    const fetchExamById = async (id: number) => {
        try {
            dispatch({ type: "FETCH_START" });

            const data = await getExamById(id);

            dispatch({
                type: "FETCH_ONE_SUCCESS",
                payload: data.exam,
            });

            return data;
        } catch (error) {
            dispatch({
                type: "FETCH_ERROR",
                payload: "Error al obtener el examen",
            });
            throw error;
        }
    };

    const createExam = async (exam: ExamDTOCreate) => {
        try {
            dispatch({ type: "FETCH_START" });

            const response = await createExamService(exam);
            await fetchExams();

            return response;
        } catch (error) {
            dispatch({
                type: "FETCH_ERROR",
                payload: "Error al crear el examen",
            });
            throw error;
        }
    };

    const updateExam = async (id: number, exam: ExamDTOCreate) => {
        try {
            dispatch({ type: "FETCH_START" });

            const response = await updateExamService(id, exam);
            await fetchExams();

            return response;
        } catch (error) {
            dispatch({
                type: "FETCH_ERROR",
                payload: "Error al actualizar el examen",
            });
            throw error;
        }
    };

    const deleteExam = async (id: number) => {
        try {
            dispatch({ type: "FETCH_START" });

            const response = await deleteExamService(id);
            await fetchExams();

            return response;
        } catch (error) {
            dispatch({
                type: "FETCH_ERROR",
                payload: "Error al eliminar el examen",
            });
            throw error;
        }
    };

    return {
        ...state,
        fetchExams,
        fetchExamById,
        fetchExamsByTitle,
        createExam,
        updateExam,
        deleteExam,
    };
};