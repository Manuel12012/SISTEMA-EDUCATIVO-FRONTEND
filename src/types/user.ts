export type Rol = "estudiante" | "docente" | "admin";

export interface User {
  id: number;
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
  avatar_url: string;
}

export interface UserDTOCreate {
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
  avatar_url: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    rol: Rol;
  };
}

export interface MeResponse {
  user: {
    id: number;
    email: string;
    rol: Rol;
  }
}

export interface AuthUser {
  id: number;
  email: string;
  rol: Rol;
}

export type UsersResponse = {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
};