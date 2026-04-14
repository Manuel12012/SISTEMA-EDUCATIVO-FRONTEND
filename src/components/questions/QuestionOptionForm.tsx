import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import type { Dispatch, SetStateAction } from "react";
import type { ExamOption, ExamOptionDTOCreate } from "../../types/examOption";
import type { Question } from "../../types/question";

type QuestionOptionFormProps = {
    setNuevaOpcion: Dispatch<SetStateAction<Record<number, string>>>
    nuevaOpcion: Record<number, string>
    fetchOptionsByQuestions: (id: number) => Promise<ExamOption[]>
    setOpcionesPorPregunta: Dispatch<SetStateAction<Record<number, ExamOption[]>>>
    setOpcionesEditables: Dispatch<SetStateAction<Record<number, ExamOption[]>>>
    createExamOption: (examOption: ExamOptionDTOCreate) => Promise<{
        message: string;
        id: number;
    }>
    q: Question
    opcionesPorPregunta: Record<number, ExamOption[]>
    setMostrarFormNuevaOpcion: Dispatch<SetStateAction<Set<number>>>
}

const QuestionOptionForm = ({ setNuevaOpcion, nuevaOpcion, fetchOptionsByQuestions, setOpcionesPorPregunta, setOpcionesEditables, createExamOption, q, opcionesPorPregunta, setMostrarFormNuevaOpcion }: QuestionOptionFormProps) => {

    return (
        <div className="flex gap-2 items-center border rounded p-2 mt-2 bg-yellow-50">
            <input
                type="text"
                placeholder="Nueva opción..."
                value={nuevaOpcion[q.id] ?? ""}
                onChange={(e) =>
                    // Seteamos la nueva opcion, creamos una copia y asignamos ahora el valor ingresado
                    setNuevaOpcion((prev) => ({
                        ...prev,
                        [q.id]: e.target.value,
                    }))
                }
                className="border rounded px-2 py-1 text-sm w-1/2"
            />

            {/*Boton guardar nueva opcion */}
            <button
                onClick={async () => {
                    try {
                        // Llamamos al metodo del hook y le seteamos los campos
                        await createExamOption({
                            question_id: q.id,
                            opcion: nuevaOpcion[q.id] ?? "",
                            orden:
                                (opcionesPorPregunta[q.id]?.length ?? 0) + 1,
                        });

                        // refrescar opciones
                        const updated = await fetchOptionsByQuestions(q.id);
                        setOpcionesPorPregunta((prev) => ({
                            ...prev,
                            [q.id]: updated ?? [],
                        }));
                        setOpcionesEditables((prev) => ({
                            ...prev,
                            [q.id]: updated ?? [],
                        }));

                        // limpiar y ocultar form
                        setNuevaOpcion((prev) => ({ ...prev, [q.id]: "" }));
                        setMostrarFormNuevaOpcion((prev) => {
                            const next = new Set(prev);
                            next.delete(q.id);
                            return next;
                        });

                        toast.success("Opción creada exitosamente!");
                    } catch (error) {
                        toast.error("No se pudo crear la opción");
                    }
                }}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
            >
                Guardar
            </button>
        </div>
    )
}

export default QuestionOptionForm;