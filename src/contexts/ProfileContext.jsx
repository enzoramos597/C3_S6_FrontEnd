import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { API_USERS } from "../services/api"; // ✅ Esta está bien para listar todos
import { useAuth } from "./AuthContext";

const ProfileContext = createContext();

export const useProfiles = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
    const [usuario, setUsuario] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const token = user?.token;

    const fetchUsuario = async () => {
        if (!token) {
            setLoading(false);
            console.log("ProfileContext: Token no disponible. Esperando autenticación.");
            return;
        }

        setLoading(true);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            // ✅ CORRECCIÓN: Si quieres obtener TODOS los usuarios, usa API_USERS
            const { data } = await axios.get(API_USERS, config);
            setUsuario(data);

        } catch (error) {
            console.error("Error fetching Usuario:", error);

            if (axios.isAxiosError(error) && error.response?.status === 401) {
                console.warn("Sesión expirada o no autorizada.");
            }

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUsuario()
        } else {
            setUsuario([]);
            setLoading(false);
        }
    }, [user, token]);

    return (
        <ProfileContext.Provider
            value={{
                usuario,
                loading,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};

export default ProfileContext;