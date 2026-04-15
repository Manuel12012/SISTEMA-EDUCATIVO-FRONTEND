import { useState, type Dispatch, type RefObject, type SetStateAction } from "react";
import type { Course } from "../../types/course";
import { useCourses } from "../../hooks/core/useCourses";
import { toast } from "react-toastify";

type Props = {
  courses: Course[];
  setDisplayedCourses: (courses: Course[]) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  searchId: string;
  setSearchId: Dispatch<SetStateAction<string>>
};

const CourseSearch = ({ courses, setDisplayedCourses, inputRef, searchId, setSearchId }: Props) => {
  const { fetchCourseById } = useCourses();

  return (
    <div className="flex gap-2 items-center">
      <div className="relative w-72 group">
        {/* ICONO */}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition">
          🔍
        </span>

        {/* INPUT */}
        <input
          type="text"
          placeholder=" "
          value={searchId}
          ref={inputRef}
          onChange={(e) => setSearchId(e.target.value)}
          className="
      peer w-full pl-10 pr-3 pt-5 pb-2 
      border border-gray-300 rounded-xl
      bg-white text-gray-800
      focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100
      transition-all duration-200
    "
        />

        {/* LABEL */}
        <label
  className={`
    absolute left-10 text-gray-400 pointer-events-none transition-all duration-200
    
    ${searchId ? "top-1 text-sm" : "top-3.5 text-base"}
    
    peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500
  `}
>
  Buscar curso
</label>
      </div>
    </div>
  );
};

export default CourseSearch;
