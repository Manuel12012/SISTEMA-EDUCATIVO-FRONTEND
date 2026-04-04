import {useNavigate} from "react-router-dom";
import type {Course} from "../../types/course";

type Props = {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (id: number) => void;
};

const CourseCard = ({course, onEdit, onDelete}: Props) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col"
    onClick={()=>navigate(`/admin/courses/${course.id}`)}>
      <img
        src={`http://localhost:8000${course.imagen_url}`}
        className="w-full h-40 object-cover"
      />

      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="font-semibold text-gray-800">{course.titulo}</h3>

        <p
          onClick={() => navigate(`/admin/courses/${course.id}/modules`)}
          className="text-xs text-gray-500 cursor-pointer"
        >
          {course.modules_count} módulos
        </p>

        <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-md w-fit capitalize">
          {course.grado}
        </span>

        {/* acciones */}

        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onEdit(course)}
            className="text-xs bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
          >
            Editar
          </button>

          <button
            onClick={() => onDelete(course.id)}
            className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
