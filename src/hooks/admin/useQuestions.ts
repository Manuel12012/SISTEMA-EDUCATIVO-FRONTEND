import { useState } from "react";
import type { Question, QuestionDTOCreate } from "../../types/question";
import {
    getQuestionById, getQuestions, createQuestion as createQuestionService, updateQuestion as updateQuestionService, deleteQuestion as deleteQuestionService
} from "../../services/questions.service";

import { getQuestionsByExam as getQuestionsByExamService } from "../../services/exams.service";


export const useQuestions = () => {
    // QUESTIONS
    const [questions, setQuestions] = useState<Question[]>([]);
    const [question, setQuestion] = useState<Question | null>(null);

    // INTERFAZ DE USUARIO
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // QUESTIONS METHODS
    const fetchQuestions = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getQuestions();
            setQuestions(data);
        } catch (error) {
            setError("Error al obtener las preguntas");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const fetchQuestionsByExam = async (examId: number) => {
        try {
            setLoading(true);
            setError(null);

            const data = await getQuestionsByExamService(examId);
            setQuestions(data);

            return data;
        } catch (error) {
            setError("Error al obtener las preguntas del examen");
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const fetchQuestionById = async (id: number) => {
        try {
            setLoading(true);
            setError(null);

            const data = await getQuestionById(id);
            setQuestion(data);
            return data;
        } catch (error) {
            setError("Error al obtener la pregunta");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createQuestion = async (question: QuestionDTOCreate) => {
        try {
            setLoading(true);
            setError(null);

            const response = await createQuestionService(question);
            return response;
        } catch (error) {
            setError("Error al crear la pregunta");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateQuestion = async (id: number, question: Partial<Question>) => {
        try {
            setLoading(true);
            setError(null);

            const response = await updateQuestionService(id, question);
            return response;
        } catch (error) {
            setError("Error al actualizar la pregunta");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteQuestion = async (id: number) => {
        try {
            setLoading(true);
            setError(null);

            const response = await deleteQuestionService(id);
            return response;
        } catch (error) {
            setError("Error al eliminar la pregunta");
            throw error;
        } finally {
            setLoading(false);
        }
    };


    return {
        questions,
        question,
        loading,
        error,

        fetchQuestions,
        fetchQuestionById,
        createQuestion,
        updateQuestion,
        deleteQuestion,
        fetchQuestionsByExam
    }
}