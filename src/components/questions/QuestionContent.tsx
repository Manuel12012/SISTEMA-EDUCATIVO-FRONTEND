import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useState } from "react";
import type { Question } from "../../types/question";
import type { ExamOption } from "../../types/examOption";
import QuestionOptionForm from "./QuestionOptionForm";
import { useExamOptions } from "../../hooks/admin/useExamOptions";

type Props = {
  q: Question;
  setDisplayedQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  opcionesState: {
    opcionesVisibles: Set<number>;
    setOpcionesVisibles: React.Dispatch<React.SetStateAction<Set<number>>>;
    opcionesPorPregunta: Record<number, ExamOption[]>;
    setOpcionesPorPregunta: React.Dispatch<
      React.SetStateAction<Record<number, ExamOption[]>>
    >;
    opcionesEditables: Record<number, ExamOption[]>;
    setOpcionesEditables: React.Dispatch<
      React.SetStateAction<Record<number, ExamOption[]>>
    >;
  };
  actions: {
    fetchOptionsByQuestions: (id: number) => Promise<ExamOption[]>;
    deleteQuestion: (id: number) => Promise<{ message: string }>;
  };
  mostrarFormNuevaOpcion: Set<number>;
  setMostrarFormNuevaOpcion: React.Dispatch<React.SetStateAction<Set<number>>>;
};

const QuestionContent = ({
  q,
  setDisplayedQuestions,
  opcionesState,
  actions,
  mostrarFormNuevaOpcion,
  setMostrarFormNuevaOpcion,
}: Props) => {
  const { createExamOption } = useExamOptions();

  const {
    opcionesVisibles,
    setOpcionesVisibles,
    opcionesPorPregunta,
    setOpcionesPorPregunta,
    opcionesEditables,
    setOpcionesEditables,
  } = opcionesState;

  const { fetchOptionsByQuestions, deleteQuestion } = actions;

  const [nuevaOpcion, setNuevaOpcion] = useState<Record<number, string>>({});

  // 🔥 HANDLERS

  const handleToggleOpciones = async () => {
    if (opcionesVisibles.has(q.id)) {
      setOpcionesVisibles((prev) => {
        const next = new Set(prev);
        next.delete(q.id);
        return next;
      });
      return;
    }

    try {
      if (!opcionesPorPregunta[q.id]) {
        const options = await fetchOptionsByQuestions(q.id);

        setOpcionesPorPregunta((prev) => ({
          ...prev,
          [q.id]: options ?? [],
        }));

        setOpcionesEditables((prev) => ({
          ...prev,
          [q.id]: options ?? [],
        }));
      }

      setOpcionesVisibles((prev) => new Set(prev).add(q.id));
    } catch {
      toast.error("Error al traer opciones");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteQuestion(q.id);
      toast.success("Pregunta eliminada correctamente");
    } catch {
      toast.error("Error al eliminar la pregunta");
    }
  };

  const handleUpdateQuestionText = (value: string) => {
    setDisplayedQuestions((prev) =>
      prev.map((item) =>
        item.id === q.id ? { ...item, pregunta: value } : item
      )
    );
  };

  const handleUpdatePoints = (value: number) => {
    setDisplayedQuestions((prev) =>
      prev.map((item) =>
        item.id === q.id ? { ...item, points: value } : item
      )
    );
  };

  const handleToggleCorrect = (optId: number) => {
    setOpcionesEditables((prev) => ({
      ...prev,
      [q.id]: prev[q.id].map((o) => ({
        ...o,
        es_correcta: o.id === optId ? 1 : 0,
      })),
    }));
  };

  const handleUpdateOptionText = (optId: number, value: string) => {
    setOpcionesEditables((prev) => ({
      ...prev,
      [q.id]: prev[q.id].map((o) =>
        o.id === optId ? { ...o, opcion: value } : o
      ),
    }));
  };

  const toggleNuevaOpcionForm = () => {
    setMostrarFormNuevaOpcion((prev) => {
      const next = new Set(prev);
      prev.has(q.id) ? next.delete(q.id) : next.add(q.id);
      return next;
    });
  };

  return (
    <div className="flex justify-between gap-5 w-full">
      {/* IZQUIERDA */}
      <div className="flex flex-col rounded w-3/4 bg-gray-200 px-8 py-5 gap-3">
        <p className="rounded text-xl text-black">Pregunta {q.id}</p>

        <textarea
          className="border rounded bg-white w-full"
          value={q.pregunta}
          onChange={(e) => handleUpdateQuestionText(e.target.value)}
        />

        <div>
          <button
            className="cursor-pointer bg-green-400 rounded text-white px-4 py-2 text-sm"
            onClick={handleToggleOpciones}
          >
            {opcionesVisibles.has(q.id)
              ? "Ocultar opciones"
              : "Mostrar opciones"}
          </button>
        </div>

        {opcionesVisibles.has(q.id) && (
          <div className="mt-4 bg-white rounded p-4 shadow-sm">
            <h3 className="font-semibold mb-2 text-gray-700">
              Opciones:
            </h3>

            {opcionesPorPregunta[q.id]?.length === 0 && (
              <p className="text-gray-400 text-sm">
                No hay opciones registradas
              </p>
            )}

            {opcionesEditables[q.id]?.map((opt) => (
              <div
                key={opt.id}
                className="flex items-center gap-3 border rounded p-2 mb-2"
              >
                {/* RADIO */}
                <input
                  type="radio"
                  name={`correct-${q.id}`}
                  checked={opt.es_correcta === 1}
                  onChange={() => handleToggleCorrect(opt.id)}
                />

                {/* INPUT TEXTO */}
                <input
                  type="text"
                  value={opt.opcion}
                  onChange={(e) =>
                    handleUpdateOptionText(opt.id, e.target.value)
                  }
                  className="border rounded px-2 py-1 text-sm w-1/2"
                />

                {/* 🔥 INDICADOR CORRECTA (LO RECUPERAMOS) */}
                {opt.es_correcta === 1 && (
                  <span className="text-green-600 font-semibold text-sm">
                    Correcta
                  </span>
                )}
              </div>
            ))}

            <div className="flex justify-center bg-blue-500 rounded">
              <button
                onClick={toggleNuevaOpcionForm}
                className="cursor-pointer text-white px-4 py-2 text-sm"
              >
                + Agregar opción
              </button>
            </div>

            {mostrarFormNuevaOpcion.has(q.id) && (
              <QuestionOptionForm
                setNuevaOpcion={setNuevaOpcion}
                nuevaOpcion={nuevaOpcion}
                createExamOption={createExamOption}
                fetchOptionsByQuestions={fetchOptionsByQuestions}
                setOpcionesPorPregunta={setOpcionesPorPregunta}
                setOpcionesEditables={setOpcionesEditables}
                q={q}
                opcionesPorPregunta={opcionesPorPregunta}
                setMostrarFormNuevaOpcion={setMostrarFormNuevaOpcion}
              />
            )}
          </div>
        )}
      </div>

      {/* DERECHA (MISMO DISEÑO ORIGINAL) */}
      <div className="w-1/4 bg-gray-200 p-4 rounded flex flex-col gap-3 items">
        <div>
          <label>Puntos</label>
          <div className="flex gap-5">
            <input
              type="number"
              value={q.points}
              onChange={(e) => handleUpdatePoints(Number(e.target.value))}
              className="border rounded px-2 py-1 w-full"
            />
            <p>Ptos</p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="cursor-pointer bg-red-500 text-white rounded-lg px-4 py-2 w-fit"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default QuestionContent; 