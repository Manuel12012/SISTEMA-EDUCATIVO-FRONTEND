import { useEffect, useState } from "react";
import { useExamResults } from "../../hooks/admin/useExamResults";
import type { ExamResult } from "../../types/examResult";
import { FaEdit, FaTrash, FaSearch, FaRedo } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const ResultsPage = () => {
  //exportacion de los metodos del hook
  const {
    examResults,
    loading,
    error,
    fetchResults,
    fetchResultsById,
    deleteResult,
    updateResult,
  } = useExamResults();

  //creamos un estado para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  //creamos un estado para editar resultado
  const [editResultId, setEditingResultId] = useState<number | null>(null);

  //estado para buscar por id
  const [searchId, setSearchId] = useState<number | "">("");

  //estado para actualizar la data
  const [formData, setFormData] = useState({
    puntaje: 0,
    correctas: 0,
    total_preguntas: 0,
    duracion_usada: 0,
  });

  //estado para mostrar los resultados
  const [displayedResults, setDisplayedResults] = useState<ExamResult[]>([]);
  const [filtro, setFiltro] = useState("");
  //funcion para editar
  const handleEditClick = (result: ExamResult) => {
    // le pasamos como parametro result
    setEditingResultId(result.id); // colocamos el id en EditingResultId como estado
    setFormData({
      // seteamos cada campo del resultado
      puntaje: result.puntaje,
      correctas: result.correctas,
      total_preguntas: result.total_preguntas,
      duracion_usada: result.duracion_usada,
    });
    setIsModalOpen(true); // abrimos el modal
  };

  // Llamamos a la API al montar la página por primera vez
  useEffect(() => {
    fetchResults(); // esto llenará examResults
  }, []);

  // Actualizar displayedResults cuando cambie examResults
  useEffect(() => {
    setDisplayedResults(examResults);
  }, [examResults]); // si examResults cambia entonces mostramos todos los resultados en el estado setDisplayedResults

  const OpcionesFiltro = [
    { value: "user", label: "Usuario" },
    { value: "exam", label: "Examen" },
    { value: "date", label: "Fecha" }
  ];
  // si loading existe entonces mostramos
  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 animate-pulse">Cargando resultados...</p>
      </div>
    );

  // si error existe entonces mandamos error
  if (error)
    return (
      <div className="p-6">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );

  // Estadísticas rápidas
  const totalResultados = examResults.length;

  const promedio =
    totalResultados > 0
      ? Math.round(
        examResults.reduce((acc, r) => acc + r.puntaje, 0) / totalResultados,
      )
      : 0;

  // retornamos
  return (
    <div className="p-6 space-y-6">
      {/* TITULO */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Resultados de Exámenes
        </h1>
        <p className="text-gray-500 text-sm">
          Visualiza el desempeño de los usuarios
        </p>
      </div>

      {/* CARDS RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-sm text-gray-500">Total Resultados</p>
          <h2 className="text-2xl font-bold">{totalResultados}</h2>{" "}
          {/*Total de resultados*/}
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-sm text-gray-500">Puntaje Promedio</p>
          <h2 className="text-2xl font-bold">{promedio}</h2>{" "}
          {/*Promedio de los resultados */}
        </div>
      </div>

      {/*INPUT DE BUSQUEDA */}
      <div className="flex gap-2 items-center mb-4">
        <input
          type="number"
          placeholder="Buscar por ID"
          value={searchId}
          onChange={
            (e) =>
              setSearchId(e.target.value === "" ? "" : Number(e.target.value)) // si cambia el evento y e.target.value es igual a una cadena vacia entonces "" sino que es Number?
          }
          className="border px-2 py-2 rounded w-32"
        />

        {/*BOTON DE BUSCAR */}
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={async () => {
            if (searchId !== "") {
              // si search ID es diferente a una cadena vacia entonces
              const result = await fetchResultsById(searchId); // llamamos al hook
              if (result) {
                setDisplayedResults([result]); // si resultado es true, entonces seteamos los resultados en setDisplayedResults
              } else {
                setDisplayedResults([]); // seteamos un array vacio
              }
            } else {
              setDisplayedResults(examResults); // resetear búsqueda si searchId tiene un array vacio
            }
          }}
        >
          <FaSearch />
        </button>

        {/*BOTON DE RESETEAR */}
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          onClick={() => {
            setSearchId("");
            fetchResults(); // resetear búsqueda
          }}
        >
          <FaRedo />
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Usuario</th>
                <th className="px-6 py-3 text-left">Examen</th>
                <th className="px-6 py-3 text-left">Puntaje</th>
                <th className="px-6 py-3 text-left">Rendimiento</th>
                <th className="px-6 py-3 text-left">Duración</th>
                <th className="px-6 py-3 text-left">Fecha</th>
                <th className="px-6 py-3 text-left  ">Acciones</th>{" "}
                {/* Nueva columna */}
              </tr>
            </thead>
            <tbody className="divide-y">
              {/*Si la longitud de displayedResults es igual a 0 entonces decimos no hay resultados registrados */}
              {displayedResults.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">
                    No hay resultados registrados
                  </td>
                </tr>
              )}

              {displayedResults.map((result) => {
                const porcentaje = Math.round(
                  (result.correctas / result.total_preguntas) * 100,
                );

                const rendimientoColor =
                  porcentaje >= 80
                    ? "bg-green-100 text-green-700"
                    : porcentaje >= 50
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700";

                return (
                  <tr key={result.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium">{result.id}</td>

                    <td className="px-6 py-4">{result.user_id}</td>

                    <td className="px-6 py-4">{result.exam_id}</td>

                    <td className="px-6 py-4 font-semibold text-indigo-600">
                      {result.puntaje}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${rendimientoColor}`}
                      >
                        {porcentaje}%
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {Math.floor(result.duracion_usada / 60)}m{" "}
                      {result.duracion_usada % 60}s
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      {new Date(result.completado_en).toLocaleString()}
                    </td>

                    <td className="px-6 py-4 flex gap-2">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                        onClick={() => handleEditClick(result)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        onClick={async () => {
                          try {
                            await deleteResult(result.id); // esperamos que termine
                            toast.success("Resultado eliminado correctamente"); // luego el toast
                          } catch (error) {
                            console.error(error);
                            toast.error("Error al eliminar el resultado");
                          }
                        }}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/*RENDERIZDO DE MODAL */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-6 w-96 relative">
                <h2 className="text-xl font-bold mb-4">Editar Resultado</h2>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Puntaje
                    </label>
                    <input
                      type="number"
                      value={formData.puntaje}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          puntaje: Number(e.target.value),
                        })
                      }
                      className="border px-3 py-2 rounded w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Correctas
                    </label>
                    <input
                      type="number"
                      value={formData.correctas}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          correctas: Number(e.target.value),
                        })
                      }
                      className="border px-3 py-2 rounded w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Total Preguntas
                    </label>
                    <input
                      type="number"
                      value={formData.total_preguntas}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          total_preguntas: Number(e.target.value),
                        })
                      }
                      className="border px-3 py-2 rounded w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Duración (segundos)
                    </label>
                    <input
                      type="number"
                      value={formData.duracion_usada}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duracion_usada: Number(e.target.value),
                        })
                      }
                      className="border px-3 py-2 rounded w-full"
                    />
                  </div>
                </div>

                {/* Botones */}
                <div className="flex justify-end mt-6 gap-3">
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    onClick={async () => {
                      if (editResultId !== null) {
                        try {
                          await updateResult(editResultId, formData);
                          toast.success("Resultado actualizado correctamente"); // <-- toast aquí
                          setIsModalOpen(false);
                          setEditingResultId(null);
                        } catch (error) {
                          console.error(error);
                          toast.error("Error al actualizar el resultado");
                        }
                      }
                    }}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
