export type LessonType = "texto" | "video" | "imagen" | "simulacion";

export interface Lesson{
    id: number;
    titulo: string;
    tipo: LessonType;
    contenido: string; // URL o texto
    orden: number
}

export interface LessonDTOCreate{
    module_id: number,
    titulo: string,
    tipo: LessonType,
    contenido: string,
    orden: number
}
