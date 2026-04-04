import { useState } from "react";
import type { Badge } from "../../types/badge";
// importamos el service de badge
import { getBadges, getBadgeById, createBadge, } from "../../services/badges.service";
import type { PointHistory } from "../../types/pointHistory";
import {
    getPointHistories,
    getPointHistoryById,
    updatePointHistory as UpdatePointHistoryService,
    deletePointHistory as deletePointHistoryService,
    getPointByUser
} from "../../services/pointHistory.service";
import {
    getBadgesByUser, assignBadge as assignBadgeServices
    , removeBadge as removeBadgeServices
} from "../../services/userBadge.service";

// TODO: MEJORAR HOOK
//creamos una funcion useBadges
export const useGamification = () => {
    // usamos useState y le decimos que sera de tipo Badge[] y lo iniciamos como un array vacio, cabe a recalcar que el estado nunca debe mutar por eso usamos setBadges
    const [badges, setBadges] = useState<Badge[]>([]);
    const [pointHistories, setPointHistories] = useState<PointHistory[]>([]);
    const [userPointHistories, setUserPointHistories] = useState<PointHistory[]>([]);
    const [userBadges, setUserBadges] = useState<Badge[]>([]);
    // lo mismo para el badge en forma singular
    const [badge, setBadge] = useState<Badge | null>(null);
    const [pointHistory, setPointHistory] = useState<PointHistory | null>(null);
    // loading aun no se para que sera
    const [loading, setLoading] = useState(false);
    // tampoco error
    const [error, setError] = useState<string | null>(null);


    /* Obtener todos los badges */
    //creamos una funcion fetchBadges que sera asincrona, ya que estamos hablando de requests 
    const fetchBadges = async () => {
        // try catch y llamamos setLoading y setError le pasamos parametros true y null
        try {
            setLoading(true);
            setError(null);

            // creamos una variable data y le decimos aguarda a que obtengas los badges (getBadges())
            // luego se resolvera la promesa resolve internamente
            const data = await getBadges();

            // y seteamos los badges y le pasamos la data es decir los badges que vienen en un arreglo
            setBadges(data);

            // si falla lanzamos error
        } catch (err) {
            setError("Error al obtener los badges");
        } finally {
            // finalmente colocamos setLoading en false como estaba al principio
            setLoading(false);
        }
    };

    /* Obtener badge por ID */
    // creamos una funcion y le diremos que sera asincrona, tomara un parametro que sera id:number
    const fetchBadgeById = async (id: number) => {
        // try catch, setLoading colocamos en true y setError a null
        try {
            setLoading(true);
            setError(null);

            // creamos data y await para esperar que getBadgesById se complete
            const data = await getBadgeById(id);
            // seteamos esa data
            setBadge(data);
        } catch (err) {
            setError("Error al obtener el badge");
        } finally {
            setLoading(false);
        }
    };

    /* Crear nuevo badge */
    // creamos funcions asincrona donde badgeData tendra el tipado de badge excepto el id porque el id viene del backend
    const createNewBadge = async (badgeData: Omit<Badge, "id">) => {
        // try catch y cambiamos de estado a setLoading y setError
        try {
            setLoading(true);
            setError(null);

            // POST devuelve { message, id }
            const response = await createBadge(badgeData);

            // Opción segura: volver a pedir la lista
            await fetchBadges();

            return response;
        } catch (err) {
            setError("Error al crear el badge");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // POINT HISTORY //
    const fetchPointHistories = async () => {

        try {
            setLoading(true);
            setError(null);

            const data = await getPointHistories()
            setPointHistories(data);
        } catch (err) {
            setError("Error al obtener los historiales de puntos");
        } finally {
            setLoading(false);
        }
    };

    const fetchPointHistoryById = async (id: number) => {
        try {
            setLoading(true);
            setError(null);

            const data = await getPointHistoryById(id);
            setPointHistory(data);
        } catch (err) {
            setError("Error al obtener el historial de puntos")
        } finally {
            setLoading(false);
        }
    };

    const updatePointHistory = async (id: number, payload: Partial<PointHistory>) => {
        try {
            setLoading(true);
            setError(null);
            const response = await UpdatePointHistoryService(id, payload);
            await fetchPointHistories();
            return response;
        } catch (error) {
            setError("Error al actualizar el historial de puntos");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deletePointHistory = async (id: number) => {
        try {
            setLoading(true);
            setError(null);

            const response = await deletePointHistoryService(id);

            // refrescamos lista
            await fetchPointHistories();

            return response;
        } catch (err) {
            setError("Error al eliminar el historial de puntos");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchPointHistoriesByUser = async (userId: number) => {
        try {
            setLoading(true);
            setError(null);

            const data = await getPointByUser(userId);
            setUserPointHistories(data.point_histories);

        } catch (error) {
            setError("Error al obtener el historial de puntos");

        } finally {
            setLoading(false);

        }
    };

    const fetchBadgeByUser = async (userId: number) => {
        try {
            setLoading(true);
            setError(null);

            const data = await getBadgesByUser(userId);
            setUserBadges(data.badges);
        } catch (error) {
            setError("Error al obtener el badge");
        } finally {
            setLoading(false);
        }
    };

    const assignBadge = async (userId: number, badgeId: number) => {
        try {
            setLoading(true);
            setError(null);

            const response = await assignBadgeServices(userId, badgeId);

            await fetchBadgeByUser(userId);

            return response;


        } catch (error) {
            setError("Error al asignar badge");
            throw error;

        } finally {
            setLoading(false);
        }
    }

    const removeBadge = async (userId: number, badgeId: number) => {
        try {
            setLoading(true);
            setError(null);

            const response = await removeBadgeServices(userId, badgeId);

            await fetchBadgeByUser(userId);

            return response;

        } catch (error) {
            setError("Error al eliminar badge");
            throw error;

        } finally {
            setLoading(false);
        }
    }

    // retornamos todo para que luego page lo consuma
    return {
        badges,
        badge,
        pointHistories,
        pointHistory,
        userPointHistories,
        userBadges,
        loading,
        error,
        fetchBadges,
        fetchBadgeById,
        createNewBadge,
        fetchPointHistories,
        fetchPointHistoryById,
        updatePointHistory,
        deletePointHistory,
        fetchPointHistoriesByUser,
        fetchBadgeByUser,
        assignBadge,
        removeBadge
    };
};
