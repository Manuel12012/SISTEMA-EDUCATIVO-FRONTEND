export interface Course{
    id: number;
    titulo: string;
    descripcion: string;
    grado: Grado;
    imagen_url: string; // el ? significa si no existe colocale undefined
    modules_count: string;

}


export interface CourseDTOCreate{
    titulo: string,
    descripcion: string,
    grado: Grado,
    imagen_url:string,
}

type Grado = "primaria" | "secundaria";


export interface getStudents{
    message: string,
    data: student[]
}

export interface student{
    id: number,
    nombre: string,
    email: string
}