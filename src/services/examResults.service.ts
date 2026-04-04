import { api } from "./api";
import type { ExamResult } from "../types/examResult";
import type { User } from "../types/user";
import type { Exam } from "../types/exam";

// definimos un type para el resultado que arrojara el getByUserAndExam
type ByUserAndExam = {
    examResult: ExamResult;
    user: User;
    exam: Exam;
}

export const getResults = async (): Promise<ExamResult[]> => {
    const { data } = await api.get<ExamResult[]>("/exam-results");
    return data;
}

export const getResultsById = async (id: number): Promise<ExamResult> => {
    const { data } = await api.get<ExamResult>(`/exam-results/${id}`);
    return data;
}

export const createResult = async (examResult: Omit<ExamResult, "id">):
    Promise<{ message: string, id: number }> => {
    const { data } = await api.post("/exam-results", examResult);
    return data;
}

export const updateResult = async (id: number, examResult: Partial<ExamResult>):
    Promise<{ message: string }> => {
    const { data } = await api.put(`/exam-results/${id}`, examResult);
    return data;
}

export const deleteResult = async (id: number): Promise<{ message: string }> => {
    const { data } = await api.delete(`/exam-results/${id}`);
    return data;
}

export const getByUserAndExam = async (UserId: number, ExamId: number): Promise<ByUserAndExam> => {
    const { data } = await api.get<ByUserAndExam>(`/users/${UserId}/exams/${ExamId}/result`);
    return data;
}

