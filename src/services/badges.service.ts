import { api } from "./api";
import type {Badge} from "../types/badge";

export const getBadges = async(): Promise<Badge[]> =>{
    const {data} = await api.get<Badge[]>("/badges");
    return data;
}

export const getBadgeById = async(id:number): Promise<Badge> =>{
     const {data} = await api.get<Badge>(`/badges/${id}`);
     return data;
};

export const createBadge = async(badge: Omit<Badge,"id">): Promise<{message:
    string; id: number}> => {
    
        const {data} = await api.post("/badges", badge);
        return data;
}


