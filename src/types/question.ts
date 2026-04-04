export interface Question {
    id: number;
    exam_id:number;
    pregunta: string;
    option_count: number;
}

export interface QuestionDTOCreate {
  exam_id: number;           // obligatorio
  pregunta: string;          // obligatorio
}
