import { api } from "./api";
import type { LoginResponse, MeResponse, User, UserDTOCreate, UserLogin } from "../types/user"
import type { ExamResult } from "../types/examResult";



export const getUserById = async (id: number): Promise<User> => {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
}

export const createUser = async (user: UserDTOCreate):
    Promise<{ message: string, id: number }> => {
    const { data } = await api.post("/users", user);
    return data;
}

export const updateUser = async (id: number, user: UserDTOCreate):
    Promise<{ message: string }> => {
    const { data } = await api.put(`/users/${id}`, user);
    return data;
}

export const deleteUser = async (id: number): Promise<{ message: string }> => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
}

export const getResultsByUser = async (userId: number): Promise<ExamResult[]> => {
    const { data } = await api.get<ExamResult[]>(`/users/${userId}/results`);
    return data;
}

export const getMe = async (): Promise<MeResponse> => {
    const { data } = await api.get<MeResponse>("/me");
    return data;
}

export const loginUser = async (
    credentials: UserLogin
): Promise<LoginResponse> => {

    const { data } = await api.post<LoginResponse>("/login", credentials);

    return data;
};

export const getUsers = async (params?: {
    role?: string;
    page?: number;
    limit?: number;
  }) => {
    const { data } = await api.get("/users", {
      params, // 🔥 axios arma el query string automáticamente
    });
    return data;
  };

