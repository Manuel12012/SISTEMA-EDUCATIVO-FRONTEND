export interface ExamOption{
    id: number;
    question_id: number;
    opcion: string;
    orden: number | null;
    es_correcta: number
}

export interface ExamOptionDTOCreate{
    question_id: number,
    opcion: string,
    orden: number
}