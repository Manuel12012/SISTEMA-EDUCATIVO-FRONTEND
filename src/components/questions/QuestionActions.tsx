import { MdCreateNewFolder } from "react-icons/md";
import { FaRedo, FaSearch } from "react-icons/fa";
import type { Question } from "../../types/question";



type QuestionActionProps = {
    setEditingResultId: React.Dispatch<React.SetStateAction<number | null>>,
    searchId: number | "",
    setSearchId: React.Dispatch<React.SetStateAction<number | "">>,
    setFormData: React.Dispatch<React.SetStateAction<{
        pregunta: string;
        puntos: number;
    }>>,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    questions: Question[],
    examId: string | undefined,
    fetchQuestionsByExam: (examId: number) => Promise<Question[]>,
    setDisplayedQuestions: React.Dispatch<React.SetStateAction<Question[]>>

}


const QuestionAction = ({ setEditingResultId, searchId, setSearchId, setFormData, setIsModalOpen, questions, examId, fetchQuestionsByExam, setDisplayedQuestions }: QuestionActionProps) => {

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <button
                    className="rounded bg-green-400 px-4 py-2 text-white hover:bg-green-500"
                    onClick={() => {
                        // Setemos el id en null para crear
                        setEditingResultId(null);
                        setFormData({
                            pregunta: "",
                            puntos: 1
                        });

                        // Abrimos modal
                        setIsModalOpen(true);
                    }}
                >
                    <MdCreateNewFolder size={18} />
                </button>

                <div className="flex gap-2 items center">
                    <input
                        type="number"
                        placeholder="Buscar por ID"
                        value={searchId}
                        onChange={(e) =>
                            //Si cambia entonces el valor sera ahora el que se ingresara por input
                            setSearchId(e.target.value === "" ? "" : Number(e.target.value))
                        }
                        className="border px-2 py-2 rounded w-32"
                    />

                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={() => {
                            // Si SearchId no es un string vacio entonces:
                            if (searchId !== "") {
                                // Buscamos en find, aquellos que coincidan con el id de search
                                const result = questions.find((q) => q.id === searchId);

                                // Si existe entonces traemos el resultado en array si no array vacio
                                setDisplayedQuestions(result ? [result] : []);
                            } else {
                                //Si es vacio entonces mostramos todas las questions (metodo All de Hook)
                                setDisplayedQuestions(questions);
                            }
                        }}
                    >
                        <FaSearch />
                    </button>

                    <button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                        onClick={() => {
                            // Seteamos el setSearchId en vacio y llamamos FetchQuestions() para mostrar todas las preguntas
                            setSearchId("");
                            fetchQuestionsByExam(Number(examId));
                        }}
                    >
                        <FaRedo />
                    </button>
                </div>
            </div>

        </>
    )
}

export default QuestionAction;