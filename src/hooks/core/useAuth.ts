import { useEffect, useState } from "react"
import type { AuthUser, UserLogin } from "../../types/user";
import { getMe, loginUser } from "../../services/user.service";
import { useNavigate } from "react-router-dom";


export const useAuth = () => {

    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (credentials: UserLogin) => {

        const response = await loginUser(credentials);

        localStorage.setItem("token", response.token);

        setUser({
            id: response.user.id,
            email: response.user.email,
            rol: response.user.rol
        })
        return response;
    };

    const checkAuth = async () => {

        const token = localStorage.getItem("token");

        // 👇 si no hay token no consultamos al backend
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const response = await getMe();

            setUser(response.user);

        } catch (error) {

            console.log("token invalido");

            localStorage.removeItem("token");
            setUser(null);

        } finally {

            setLoading(false);

        }

    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    };


    return {
        user,
        loading,
        login,
        logout
    }
}