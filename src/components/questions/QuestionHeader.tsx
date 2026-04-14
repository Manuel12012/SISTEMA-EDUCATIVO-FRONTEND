import type { NavigateFunction } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import type { Question } from "../../types/question";
import type { ExamOption } from "../../types/examOption";


type QuestionHeaderProps = {
    navigate: NavigateFunction,
    examId: string | undefined,
    examTitle: string,
    displayedQuestions: Question[],
    updateQuestion: (id: number, question: Partial<Question>) => Promise<{
        message: string;
    }>,
    fetchQuestionsByExam: (examId: number) => Promise<Question[]>,
    updateExamOption: (id: number, examOption: Partial<ExamOption>) => Promise<{
        message: string;
    }>,
    opcionesEditables: Record<number, ExamOption[]>
}

const QuestionHeader = ({ navigate, examId, examTitle, displayedQuestions, updateQuestion,fetchQuestionsByExam, updateExamOption,opcionesEditables }: QuestionHeaderProps) => {

    return (
        <>
            <div className="flex items-center justify-between">
                {/* IZQUIERDA: botón + título */}
                <div className="flex items-center gap-4">
                    <button
                        // si le damos click al boton retrocedemos un link anterior
                        onClick={() => navigate(-1)}
                        className="bg-gray-300 hover:bg-gray-400 px-2 py-2 rounded"
                    >
                        <FaArrowLeft />
                    </button>

                    <div>
                        <h1 className="text-3xl font-bold">
                            Preguntas del Examen: {examTitle || `#${examId}`}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            CRUD de preguntas relacionadas a este examen
                        </p>
                    </div>
                </div>

                {/* Botón guardar cambios */}
                <button
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
                    onClick={async () => {
                        // si el Id del Examen no existe salimos
                        if (!examId) return;

                        try {
                            // Almacenamos el id del examen
                            const examIdNumber = Number(examId);

                            // Solo actualizamos las preguntas existentes
                            const updates = displayedQuestions.map((q) => {
                                // Retornamos y le pasamos los 2 parametros (1. Id de Question 2. La question)
                                return updateQuestion(q.id, {
                                    exam_id: examIdNumber,
                                    pregunta: q.pregunta,
                                    points: q.points
                                });
                            });

                            // Esperamos que se cumpla la promesas
                            await Promise.all(updates);

                            // Actualizamos opciones editadas (Explicame mejor esto)
                            const optionUpdates = Object.entries(opcionesEditables).flatMap(
                                ([, opts]) =>
                                    opts.map((opt) =>
                                        updateExamOption(opt.id, {
                                            question_id: opt.question_id,
                                            opcion: opt.opcion,
                                            es_correcta: opt.es_correcta,
                                        }),
                                    ),
                            );

                            // Esperamos que se cumpla todas las promesas
                            await Promise.all(optionUpdates);

                            toast.success("Preguntas y opciones actualizadas correctamente");

                            // Refrescamos la lista desde el backend
                            fetchQuestionsByExam(examIdNumber);
                        } catch (err) {
                            console.error(err);
                            toast.error("Error al actualizar las preguntas");
                        }
                    }}
                >
                    Guardar cambios
                </button>
            </div>

        </>
    )
}

export default QuestionHeader;