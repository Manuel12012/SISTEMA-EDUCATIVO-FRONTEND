export interface PointHistory {
    id: number;
    userId: number;
    puntos: number;
    motivo: string;
    created_at: TimeRanges;
}

export type GetPointByUser = {
    user_id: string; // viene como string desde backend
    point_histories: PointHistory[];
};
