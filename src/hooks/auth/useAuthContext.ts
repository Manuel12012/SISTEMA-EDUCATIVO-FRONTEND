import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export const useAuthContext = () => {

// obtenemos el valor del contexto AuthContext
  const context = useContext(AuthContext);

// si el hook se usa fuera de AuthProvider lanzamos un error
  if (!context) {
    throw new Error("useAuthContext debe usarse dentro de AuthProvider");
  }

  return context;
};