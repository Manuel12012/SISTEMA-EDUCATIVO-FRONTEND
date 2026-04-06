import {useState, useEffect} from "react";
import {toast} from "react-toastify";
import type {Course, CourseDTOCreate} from "../../types/course";
import {useCourses} from "../../hooks/core/useCourses";

type Props = {
  closeModal: () => void;
  editingCourse: Course | null;
};

const GRADOS = [
  {value: "primaria", label: "Primaria"},
  {value: "secundaria", label: "Secundaria"},
];

const colors = [
  {value: "#3B82F6", label: "azul"},
  {value: "#22C55E", label: "verde"},
  {value: "#EF4444", label: "rojo"},
  {value: "#F59E0B", label: "amarillo"},
  {value: "#8B5CF6", label: "morado"}
];

const CourseModal = ({closeModal, editingCourse}: Props) => {
  const {createCourse, updateCourse, uploadImageHandler} = useCourses();
  const [previewImage, setPreviewImage] = useState<string>("");

  const [formData, setFormData] = useState<CourseDTOCreate>({
    titulo: "",
    descripcion: "",
    grado: "primaria",
    imagen_url: "",
    color: "",
  });

  useEffect(() => {
    if (editingCourse) {
      setFormData({
        titulo: editingCourse.titulo || "",
        descripcion: editingCourse.descripcion || "",
        grado: editingCourse.grado || "primaria",
        imagen_url: editingCourse.imagen_url || "",
        color: editingCourse.color || "",
      });

      if (editingCourse.imagen_url) {
        setPreviewImage(`http://localhost:8000${editingCourse.imagen_url}`);
      }
    }
  }, [editingCourse]);

  const handleSubmit = async () => {
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, formData);
        toast.success("Curso actualizado");
      } else {
        await createCourse(formData);
        toast.success("Curso creado");
      }

      closeModal();
    } catch (error) {
      toast.error("Error al guardar curso");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96 relative">
        <h2 className="text-xl font-bold mb-4">
          {editingCourse ? "Editar Curso" : "Crear Curso"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Grado
            </label>

            <select
              value={formData.grado}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  grado: e.target.value as CourseDTOCreate["grado"],
                })
              }
              className="border px-3 py-2 rounded w-full"
            >
              {GRADOS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Titulo
            </label>

            <input
              type="text"
              value={formData.titulo}
              onChange={(e) =>
                setFormData({...formData, titulo: e.target.value})
              }
              className="border px-3 py-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>

            <input
              type="text"
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({...formData, descripcion: e.target.value})
              }
              className="border px-3 py-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Imagen
            </label>

            <input
              type="file"
              onChange={async (e) => {
                if (e.target.files?.[0]) {
                  try {
                    const file = e.target.files[0];

                    const url = await uploadImageHandler(file);

                    setFormData({
                      ...formData,
                      imagen_url: url,
                    });

                    setPreviewImage(URL.createObjectURL(file));
                  } catch {
                    toast.error("Error subiendo imagen");
                  }
                }
              }}
            />
            {previewImage && (
              <img
                src={previewImage}
                className="w-full h-32 object-cover rounded-lg border mt-2"
              />
            )}
          </div>

          <div>
            <label>Selecciona el color</label>

            <select
            value={formData.color}
            onChange={(e)=>
              setFormData({
                ...formData,
                color: e.target.value as CourseDTOCreate["color"],
              })
            }
            className="border px-3 py-2 rounded w-full">
              {colors.map((c)=>(
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
              ))}

            </select>
          </div>
        </div>


        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={closeModal}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            {editingCourse ? "Actualizar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseModal;
