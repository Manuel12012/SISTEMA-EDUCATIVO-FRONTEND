type Props = {
  lessons: any[]
}

const CourseStats = ({lessons}:Props)=>{

  return(

    <div className="mt-10">

      <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 w-48">

        <p className="text-sm text-gray-500">
          Lecciones totales
        </p>

        <p className="text-2xl font-bold text-blue-500">
          {lessons.length}
        </p>

      </div>

    </div>

  )
}

export default CourseStats