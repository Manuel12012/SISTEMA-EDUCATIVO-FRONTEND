export interface Enrollment{
    id: number,
    titulo: string,
    descripcion: string,
    grado: string,
    imagen_url:string,
}

export interface EnrollStudent{
    user_id: number,
    course_id: number
}