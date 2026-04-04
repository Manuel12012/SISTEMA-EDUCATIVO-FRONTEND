import {useState} from "react";
import type {Course} from "../../types/course";
import {useCourses} from "../../hooks/core/useCourses";
import {toast} from "react-toastify";

type Props = {
  courses: Course[];
  setDisplayedCourses: (courses: Course[]) => void;
};

const CourseSearch = ({courses, setDisplayedCourses}: Props) => {
  const {fetchCourseById} = useCourses();

  const [searchId, setSearchId] = useState<number | "">("");

  const handleSearch = async () => {
    if (searchId === "") {
      setDisplayedCourses(courses);
      return;
    }

    try {
      const result = await fetchCourseById(searchId);

      setDisplayedCourses([result]);
    } catch (error) {
      setDisplayedCourses([]);
      toast.error("Curso no encontrado");
    }
  };

  const handleReset = () => {
    setSearchId("");
    setDisplayedCourses(courses);
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        type="number"
        placeholder="Buscar curso por ID..."
        value={searchId}
        onChange={(e) =>
          setSearchId(e.target.value === "" ? "" : Number(e.target.value))
        }
        className="border border-gray-200 px-4 py-2 rounded-lg w-64 focus:ring-2 focus:ring-indigo-400 outline-none"
      />

      <button
        onClick={handleSearch}
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition"
      >
        Buscar
      </button>

      <button
        onClick={handleReset}
        className="text-gray-500 hover:text-gray-700 text-sm"
      >
        Reset
      </button>
    </div>
  );
};

export default CourseSearch;
