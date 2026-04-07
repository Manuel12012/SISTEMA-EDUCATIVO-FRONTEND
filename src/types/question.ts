export interface Question {
    id: number;
    exam_id:number;
    pregunta: string;
    option_count: number;
    points: number;
}

export interface QuestionDTOCreate {
  exam_id: number;           // obligatorio
  pregunta: string;   
  points: number       // obligatorio
}
