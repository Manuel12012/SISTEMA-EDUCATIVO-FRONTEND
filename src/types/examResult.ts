export interface ExamResult {
    id: number,
    user_id: number;
    exam_id: number;
    puntaje: number;
    total_preguntas: number;
    correctas: number;
    duracion_usada: number,
    completado_en: string;
}