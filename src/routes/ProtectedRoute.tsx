import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/auth/useAuthContext";
import type { JSX } from "react";

// esto no se que hace
interface Props {
  children: JSX.Element;
}

// children para que sirve?
export const ProtectedRoute = ({ children }: Props) => {

  // esto viene del useAuthContext que hereda los metodos del hook useAuth?
  const { user, loading } = useAuthContext();

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};