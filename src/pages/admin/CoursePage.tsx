import { useEffect, useRef, useState } from "react";
import { useCourses } from "../../hooks/core/useCourses";
import type { Course } from "../../types/course";

import CourseHeader from "../../components/courses/CourseHeader";
import CourseSearch from "../../components/courses/CourseSearch";
import CourseGrid from "../../components/courses/CourseGrid";
import CourseModal from "../../components/courses/CourseModal";
import CourseStats from "../../components/courses/CourseStats";
import { deleteCourse } from "../../services/courses.service";
import { toast } from "react-toastify";

const CoursePage = () => {
  const { courses, lessons, loading, error, fetchCourses, fetchLessons, fetchCoursesByName } =
    useCourses();

  const inputRef = useRef<HTMLInputElement>(null);
  const [searchId, setSearchId] = useState<string | "">("");

  const [displayedCourses, setDisplayedCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  useEffect(() => {
    fetchCourses();
    fetchLessons();
  }, []);
  const handleCreate = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };
  const handleDelete = async (id: number) => {
    try {
      await deleteCourse(id);
      await fetchCourses(); // refresca la lista

      toast.success("Curso eliminado");
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };
  useEffect(() => {
    setDisplayedCourses(courses);
  }, [courses]);

  // useEffect para busqueda
  useEffect(() => {
    const time = setTimeout(() => {
      if (searchId.trim() === "") {
        fetchCourses(); // 👈 lista normal
      } else {
        fetchCoursesByName(searchId);
      }
    }, 500);

    return () => clearTimeout(time);
  }, [searchId]);
  console.log("courses", courses);
  console.log("searchId", searchId);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 animate-pulse">Cargando cursos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  
  return (
    <div className="p-6 min-h-screen flex flex-col gap-8">
      <CourseHeader openModal={handleCreate} />

      <CourseSearch
        courses={courses}
        setDisplayedCourses={setDisplayedCourses}
        inputRef={inputRef}
        searchId={searchId}
        setSearchId={setSearchId}
      />

      <CourseGrid
        displayedCourses={displayedCourses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <CourseStats lessons={lessons} />

      {isModalOpen && (
        <CourseModal closeModal={closeModal} editingCourse={editingCourse} />
      )}
    </div>
  );
};

export default CoursePage;
