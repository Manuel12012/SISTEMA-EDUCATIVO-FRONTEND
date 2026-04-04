import { useEffect, useState, useCallback } from "react";
import { getExamById, submitExam, type ExamDetailResponse } from "../services/exams.service";
import type { SubmitExamPayload } from "../types/submitExam";

// Estado de respuestas: clave = questionId, valor = optionId seleccionada
type AnswerState = Record<number, number>;

export const useExamSession = (examId: number) => {
    // --- Estados principales ---
    const [exam, setExam] = useState<ExamDetailResponse | null>(null); // información del examen
    const [answers, setAnswers] = useState<AnswerState>({});            // respuestas del usuario
    const [loading, setLoading] = useState(true);                       // estado de carga
    const [submitting, setSubmitting] = useState(false);                // estado de envío
    const [score, setScore] = useState<number | null>(null);            // puntaje final
    const [error, setError] = useState<string | null>(null);            // errores de carga/envío

    // --- Cargar examen desde el backend ---
    useEffect(() => {
        if (!examId) return; // evita llamadas si no hay examId

        const fetchExam = async () => {
            setLoading(true);
            try {
                const data = await getExamById(examId); // fetch del examen
                setExam(data);
            } catch {
                setError("Error loading exam");
            } finally {
                setLoading(false);
            }
        };

        fetchExam(); // llamar a la función async
    }, [examId]);

    // --- Guardar la respuesta de una pregunta ---
    const selectAnswer = useCallback((questionId: number, optionId: number) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionId, // actualiza solo la pregunta seleccionada
        }));
    }, []);

    // --- Enviar examen al backend ---
    const handleSubmit = useCallback(async () => {
        if (!exam) return;

        setSubmitting(true);
        setError(null);

        try {
            const payload: SubmitExamPayload = { answers };       // envía las respuestas en payload
            const response = await submitExam(examId, payload);   // llamada al service
            setScore(response.result.puntaje);                    // actualizar puntaje
            return response;
        } catch {
            setError("Error submitting exam");
            throw new Error("Failed to submit exam");
        } finally {
            setSubmitting(false); // asegura que el estado de submitting siempre se reinicie
        }
    }, [exam, examId, answers]);

    // --- Valores que el componente puede usar ---
    return {
        exam,
        answers,
        loading,
        submitting,
        score,
        error,
        selectAnswer,
        handleSubmit,
    };
};
