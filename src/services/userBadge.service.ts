import { api } from "./api";
import type { Badge } from "../types/badge";

type UserAndBadgeResponse ={
    user_id: number;
    badges: Badge[];
}

export const getBadgesByUser  = async(userId: number): Promise<UserAndBadgeResponse> =>{
    const {data} = await api.get<UserAndBadgeResponse>(`/users/${userId}/user-badges`);
    return data;

}

export const assignBadge = async(userId:number, badgeId:number): Promise<{message: string}> =>{
    const {data} = await api.post(`/users/${userId}/badges/${badgeId}`);
    return data;
}

export const removeBadge = async(userId: number, badgeId: number): Promise<{message: string}> =>{
    const {data} = await api.delete(`/users/${userId}/badges/${badgeId}`);
    return data;
}