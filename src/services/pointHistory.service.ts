import { api } from "./api";
import type { PointHistory } from "../types/pointHistory"

type GetPointByuser = {
    user_id: number;
    point_histories: PointHistory[];
}

export const getPointHistories = async (): Promise<PointHistory[]> => {
    const { data } = await api.get<PointHistory[]>("/point-histories");
    return data;
}

export const getPointHistoryById = async (id: number): Promise<PointHistory> => {
    const { data } = await api.get<PointHistory>(`/point-histories/${id}`);
    return data;
}

export const updatePointHistory = async (id: number, pointHistory: Partial<PointHistory>):
    Promise<{ message: string }> => {
    const { data } = await api.put(`/point-histories/${id}`, pointHistory);
    return data;
}

export const deletePointHistory = async (id: number): Promise<{ message: string }> => {
    const { data } = await api.delete(`/point-histories/${id}`);
    return data;
}

export const getPointByUser = async (userId: number): Promise<GetPointByuser> => {
    const { data } = await api.get<GetPointByuser>(`/users/${userId}/point-histories`);
    return data;
}