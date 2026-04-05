import { useEffect, useState, useCallback } from "react";
import { getExamById, submitExam, type ExamDetailResponse } from "../../services/exams.service";

// Estado de respuestas: clave = questionId, valor = optionId seleccionada
type AnswerState = Record<number, number>;

export const useExamSession = (examId: number) => {
    const [exam, setExam] = useState<ExamDetailResponse | null>(null);
    const [answers, setAnswers] = useState<AnswerState>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!examId) return;

        const fetchExam = async () => {
            setLoading(true);
            try {
                const data = await getExamById(examId); // devuelve ExamDetailResponse
                setExam(data);
            } catch {
                setError("Error loading exam");
            } finally {
                setLoading(false);
            }
        };

        fetchExam();
    }, [examId]);

    const selectAnswer = useCallback((questionId: number, optionId: number) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionId,
        }));
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!exam) return;

        setSubmitting(true);
        setError(null);

        try {
            const response = await submitExam(examId, answers); // ✅ enviar directamente answers
            setScore(response.result.puntaje);
            return response;
        } catch {
            setError("Error submitting exam");
            throw new Error("Failed to submit exam");
        } finally {
            setSubmitting(false);
        }
    }, [exam, examId, answers]);

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