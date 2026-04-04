import { AuthContext } from "./AuthContext";
import { useAuth } from "../hooks/core/useAuth";
// ReactNode representa cualquier elemento renderizable
// en React (componentes, texto, elementos JSX, etc.)
import type { ReactNode } from "react";

// Props define las propiedades del componente
// children representa todos los componentes
// que estarán envueltos por AuthProvider
interface Props {
  children: ReactNode;
}
// AuthProvider es el componente que provee
// el estado de autenticación a toda la aplicación
export const AuthProvider = ({ children }: Props) => {
  
// ejecutamos el hook useAuth que contiene
// toda la lógica de autenticación
// y guardamos su resultado en auth
  const auth = useAuth();
  
// compartimos el estado de autenticación
// con todos los componentes de la aplicación
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};