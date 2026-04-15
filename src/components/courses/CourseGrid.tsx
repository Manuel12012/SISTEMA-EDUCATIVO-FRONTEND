import type {Course} from "../../types/course"
import CourseCard from "./CourseCard"

type Props = {
  displayedCourses: Course[]
  onEdit: (course: Course) => void
  onDelete: (id: number) => void
}

const CourseGrid = ({displayedCourses,onEdit,onDelete}:Props) => {

  return(

    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
   >
{displayedCourses.length === 0  && (
  <p>No se encontraron cursos</p>
)}      {displayedCourses.map(course => (

        <CourseCard
          key={course.id}
          course={course}
          onEdit={onEdit}
          onDelete={onDelete}
        />

      ))}

    </div>

  )

}

export default CourseGrid