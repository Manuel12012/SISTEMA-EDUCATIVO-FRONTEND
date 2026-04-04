import { useState } from "react";
import { takeExam as takeExamService, submitExam as submitExamService } from "../../services/exams.service";

export const useTakeExam = () => {
  const [examData, setExamData] = useState<any>(null);
  const [result, setResult] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExamToTake = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const data = await takeExamService(id);
      setExamData(data);
      return data;
    } catch (err) {
      setError("Error al cargar el examen");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitExam = async (
    id: number,
    answers: { [key: number]: number }
  ) => {
    try {
      setSubmitting(true);
      setError(null);

      const data = await submitExamService(id, answers);
      setResult(data.result);
      return data;
    } catch (err) {
      setError("Error al enviar el examen");
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    examData,
    result,
    loading,
    submitting,
    error,
    fetchExamToTake,
    submitExam,
  };
};