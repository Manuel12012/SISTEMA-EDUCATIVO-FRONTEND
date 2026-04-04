export interface Module{
    id: number;
    course_id: number,
    titulo: string;
    orden: number;
}

export interface ModuleDTOCreate{
    course_id: number,
    titulo: string,
    orden: number,
}