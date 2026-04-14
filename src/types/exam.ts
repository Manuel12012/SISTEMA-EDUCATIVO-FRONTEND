
export interface Exam {
  id: number;
  course_id: number;        // ✅ necesario para el select
  course_titulo: string;    // ✅ para mostrar en la tabla
  titulo: string;
  duracion_minutos: number;
  questions_count: number;
  course_color: string;
  ya_rendido: boolean
}


export interface ExamDTOCreate{
    course_id:number,
    titulo: string,
    duracion_minutos: number,
}

