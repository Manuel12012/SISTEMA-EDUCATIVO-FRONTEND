import {MdCreateNewFolder} from "react-icons/md"

type Props = {
  openModal: () => void
}

const CourseHeader = ({openModal}:Props) => {

  return(

    <div className="flex justify-between items-center">

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Cursos
        </h1>

        <p className="text-gray-500 text-sm">
          Administra los cursos del sistema educativo
        </p>
      </div>

      <button
        onClick={openModal}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
      >
        <MdCreateNewFolder size={20}/>
        Nuevo Curso
      </button>

    </div>

  )
}

export default CourseHeader