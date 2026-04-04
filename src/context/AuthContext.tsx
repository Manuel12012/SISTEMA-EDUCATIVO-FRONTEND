import { createContext } from "react";
import type { AuthUser } from "../types/user";

// crea el contenedor del estado global
interface AuthContextType {
  // donde usuario sera igual al type user
  user: AuthUser | null;

  // loading sera de tipo boolean
  loading: boolean;

  // login sera de tipo crendetials que tendra
  // email y password
  login: (credentials: { email: string; password: string }) => Promise<any>;

  // logout sera de tipo void
  logout: () => void;
}

// exportamos el contenedor 
export const AuthContext = createContext<AuthContextType | null>(null);