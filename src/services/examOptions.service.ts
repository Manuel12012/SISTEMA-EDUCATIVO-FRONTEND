import { api } from "./api";
import type { ExamOption, ExamOptionDTOCreate } from "../types/examOption"

export const getExamOptions = async (): Promise<ExamOption[]> => {
    const { data } = await api.get<ExamOption[]>("/exam-options");
    return data;
}

export const getExamOptionsById = async (id: number): Promise<ExamOption> => {
    const { data } = await api.get<ExamOption>(`/exam-options/${id}`);
    return data;
}

export const createExamOption = async (examOption: ExamOptionDTOCreate):
    Promise<{ message: string, id: number }> => {
    const { data } = await api.post("/exam-options", examOption);
    return data;
}

export const updateExamOption = async (id: number, examOption: Partial<ExamOption>):
    Promise<{ message: string }> => {
    const { data } = await api.put(`/exam-options/${id}`, examOption);
    return data;
}

export const deleteExamOption = async (id: number): Promise<{ message: string }> => {
    const { data } = await api.delete(`/exam-options/${id}`);
    return data;
}

export const getExamOptionsByQuestion = async(id:number): Promise<ExamOption[]>=>{
    const {data} = await api.get<ExamOption[]>(`/exam-options/question/${id}`);
    return data;
}