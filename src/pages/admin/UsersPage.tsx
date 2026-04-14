import { useEffect, useRef, useState } from "react";
import { useUser } from "../../hooks/core/useUser";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import type { User, UserDTOCreate } from "../../types/user";

const UsersPage = () => {
  const {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    fetchUsersByName
  } = useUser();

  const inputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editResultId, setEditingResultId] = useState<number | null>(null);
  const [searchId, setSearchId] = useState<string | "">("");

  // creamos la forma de data de CREAR y EDITAR
  const [formData, setFormData] = useState<UserDTOCreate>({
    nombre: "",
    email: "",
    password: "",
    rol: "estudiante",
    avatar_url: "",
  });

  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);

  // Funcion Editar
  const handleEditClick = (user: User) => {
    setEditingResultId(user.id);
    setFormData({
      nombre: user.nombre,
      email: user.email,
      password: user.password, // correcto
      rol: user.rol,           // usa el rol real
      avatar_url: user.avatar_url,
    });
    setIsModalOpen(true);
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (Array.isArray(users)) {
      setDisplayedUsers(users);
    } else {
      setDisplayedUsers([]);
    }
  }, [users]);

  // useEffect para busqueda
  useEffect(() => {
    const time = setTimeout(() => {
      if (searchId.trim() === "") {
        fetchUsers(); // 👈 lista normal
      } else {
        fetchUsersByName(searchId);
      }
    }, 500);
  
    return () => clearTimeout(time);
  }, [searchId]);
  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 animate-pulse">Cargando usuarios...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-6">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Administrador de Usuarios
        </h1>
        <p className="text-gray-500 text-sm">
          Visualiza los usuarios, actualizalos, eliminalos o crea uno
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
      <input
            type="text"
            placeholder="Buscar usuario"
            value={searchId}
            ref={inputRef}
            onChange={(e) =>
              //Si cambia entonces el valor sera ahora el que se ingresara por input
              setSearchId(e.target.value)
            }
            className="border px-2 py-2 rounded w-auto"
          />

        <button
          className="rounded bg-green-400 px-4 py-2 text-white hover:bg-green-500"
          onClick={() => {
            setEditingResultId(null);
            setFormData({
              nombre: "",
              email: "",
              password: "",
              rol: "estudiante",
              avatar_url: "",
            });
            setIsModalOpen(true);
          }}
        >
          Crear Usuario +
        </button>
      </div>
      {/*BOTON DE CREAR EXAMEN */}

      <div className="bg-white shadow rounded-xl w-full overflow-hidden">
                <div className="w-full overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm whitespace-nowrap">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Nombre</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Rol</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {displayedUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    No hay usuarios registrados
                  </td>
                </tr>
              )}
              {displayedUsers.map((user) => {
                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium">{user.id}</td>
                    <td className="px-6 py-4">{user.nombre}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.rol}</td>
                    <td className="px-6 py-4">

                      <div className="flex gap-2">
                        {/*BOTON PARA EDITAR */}
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                          onClick={() => handleEditClick(user)}
                        >
                          Editar
                        </button>

                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                          onClick={async () => {
                            try {
                              await deleteUser(user.id);
                              toast.success("Usuario eliminado correctamente");
                            } catch (error) {
                              console.error(error);
                              toast.error("Error al eliminar el usuario");
                            }
                          }}
                        >
                          Eliminar
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-6 w-96 relative">
                <h2 className="text-xl font-bold mb-4">
                  {editResultId !== null ? "Editar Usuario" : "Crear Usuario"}
                </h2>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nombre: String(e.target.value),
                      })
                    }
                    className="border px-3 rounded w-full "
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        email: String(e.target.value),
                      });
                    }}
                    className="border px-3 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    value={formData.password}
                    type="text"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        password: String(e.target.value),
                      });
                    }}
                    className="border px-3 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rol
                  </label>
                  <input
                    value={formData.rol}
                    type="text"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        rol: e.target.value as UserDTOCreate["rol"],
                      });
                    }}
                    className="border px-3 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Avatar
                  </label>
                  <input
                    type="text"
                    value={formData.avatar_url}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        avatar_url: String(e.target.value),
                      });
                    }}
                    className="border px-3 rounded w-full"
                  />
                </div>

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
                      try {
                        if (editResultId !== null) {
                          // EDITAR
                          await updateUser(editResultId, formData);
                          toast.success("Usuario actualizado correctamente");
                        } else {
                          // Crear
                          await createUser(formData);
                          toast.success("Usuario creado correctamente");
                        }
                        setIsModalOpen(false);
                        setEditingResultId(null);
                        fetchUsers();
                      } catch (error) {
                        console.log(error);
                        toast.error("Error al guardar el usuario");
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

export default UsersPage;
