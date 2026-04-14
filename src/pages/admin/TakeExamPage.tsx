import { useEffect, useState } from "react";
import { submitExam, takeExam } from "../../services/exams.service";
import { useParams } from "react-router-dom";

const TakeExamPage = () => {
  // estados para el examen
  const [exam, setExam] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // tomamos el id del examen
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const data = await takeExam(Number(id));
        setExam(data);

        const expiresAt = new Date(data.expires_at).getTime();
        const now = Date.now();
        
        const segundosRestantes = Math.floor((expiresAt - now) / 1000);
        
        setTimeLeft(segundosRestantes > 0 ? segundosRestantes : 0);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [id]);

  // cuenta hacia atras
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelect = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    if (!exam) return;

    if (Object.keys(answers).length !== exam.questions.length) {
      alert("Debes responder todas las preguntas.");
      return;
    }

    if (!confirm("¿Enviar examen?")) return;

    try {
      setSubmitting(true);
      const data = await submitExam(Number(id), answers);
      setResult(data.result);
    } catch (error: any) {
      alert(error.response?.data?.error || "Error al enviar examen");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Cargando examen...
      </div>
    );
  }

  if (result) {
    return (

      <div className="max-w-xl mx-auto mt-10 bg-white  shadow-xl rounded-2xl p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Resultado</h2>

        <p className="text-lg">
          Puntaje: <span className="font-bold">{result.puntaje}%</span>
        </p>
        <p>
          Correctas: {result.correctas} / {result.total}
        </p>
        <p className="mb-4">
          Puntos ganados: {result.puntos_ganados}
        </p>
      </div>
    );
  }

  const total = exam.questions.length;
  const answered = Object.keys(answers).length;
  const progress = (answered / total) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{exam.exam.titulo}</h1>
        <div className="flex justify-between items-center">

          <div className="bg-red-100 text-red-600 font-bold px-4 py-2 rounded-lg">
            ⏱ {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-3 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm mt-1 text-gray-500">
            {answered} de {total} respondidas
          </p>
        </div>
      </div>

      {/* QUESTIONS */}
      <div className="space-y-6">
        {exam.questions.map((q: any, index: number) => (
          <div
            key={q.id}
            className="bg-white shadow-md rounded-xl p-5 border"
          >
            <h3 className="font-semibold mb-4">
              {index + 1}. {q.pregunta}
            </h3>

            <div className="space-y-2">
              {q.options.map((opt: any) => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition 
                  ${answers[q.id] === opt.id
                      ? "bg-blue-100 border-blue-500"
                      : "hover:bg-gray-100"
                    }`}
                >
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    checked={answers[q.id] === opt.id}
                    onChange={() => handleSelect(q.id, opt.id)}
                  />
                  {opt.opcion}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* SUBMIT BUTTON */}
      <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-4 mt-6 border-t">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
        >
          {submitting ? "Enviando..." : "Enviar examen"}
        </button>
      </div>
    </div>
  );
};

export default TakeExamPage;