import { api } from "./api";
import type { Question, QuestionDTOCreate } from "../types/question"
import type { ExamOption } from "../types/examOption";

export const getQuestions = async (): Promise<Question[]> => {
    const { data } = await api.get<Question[]>("/questions");
    return data;
}

export const getQuestionById = async (id: number): Promise<Question> => {
    const { data } = await api.get<Question>(`/questions/${id}`);
    return data;
}

export const getOptionByQuestions = async(id:number): Promise<ExamOption[]>=>{
    const {data} = await api.get<ExamOption[]>(`/questions/${id}/exam-options`);
    return data;
}

export const createQuestion = async (question: QuestionDTOCreate):
    Promise<{ message: string, id: number }> => {
    const { data } = await api.post("/questions", question);
    return data;
}

export const updateQuestion = async (id: number, question: Partial<Question>):
    Promise<{ message: string }> => {
    const { data } = await api.put(`/questions/${id}`, question);
    return data;
}

export const deleteQuestion = async (id: number): Promise<{ message: string }> => {
    const { data } = await api.delete(`/questions/${id}`);
    return data;
}