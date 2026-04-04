// Payload que enviamos al backend
export interface SubmitExamPayload {
    answers: Record<number, number>;
    // questionId -> selectedOptionId
}

// Resultado interno que devuelve el modelo
export interface ExamSubmissionResult {
    result_id: number;
    puntaje: number;
    correctas: number;
    total: number;
    puntos_ganados: number;
}

// Respuesta completa del controller
export interface SubmitExamResponse {
    message: string;
    result: ExamSubmissionResult;
}
