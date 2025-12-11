import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { API_USERS } from "../services/api";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext();

export const useProfiles = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
    const [usuario, setUsuario] = useState([]);
    const [loading, setLoading] = useState(false);
    // 🛑 OBTENEMOS EL USUARIO Y EL TOKEN DIRECTAMENTE
    const { user } = useAuth();

    // 🛑 EXTRAEMOS EL TOKEN UNA SOLA VEZ
    const token = user?.token;

    const fetchUsuario = async () => {
        // 1. OBTENER EL TOKEN DEL CONTEXTO
        // 🛑 Ahora 'token' se obtiene directamente del estado 'user'.
        //    No es necesario volver a buscarlo en localStorage.

        // 2. Si no hay token, no intentar la petición.
        if (!token) {
            setLoading(false);
            // 🛑 Cambiamos a console.log/warn para que no parezca un error de la aplicación
            console.log("ProfileContext: Token no disponible. Esperando autenticación.");
            return;
        }

        setLoading(true);

        try {
            // 3. ENVIAR EL TOKEN EN EL HEADER 'Authorization'
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`, // Usamos el token del estado
                },
            };

            // 4. Hacer la petición
            const { data } = await axios.get(API_USERS, config);
            setUsuario(data);

        } catch (error) {
            console.error("Error fetching Usuario:", error);

            if (axios.isAxiosError(error) && error.response?.status === 401) {
                console.warn("Sesión expirada o no autorizada. Sugerencia: llamar a logout aquí.");
            }

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 🛑 La lógica es correcta: si hay usuario (y por lo tanto token)
        //    llama a fetchUsuario.
        if (user) {
            fetchUsuario()
        } else {
            // 🛑 OPCIONAL: Si el usuario se desconecta, limpiar el estado local
            setUsuario([]);
            setLoading(false);
        }
    }, [user, token]); // 🛑 Añadimos 'token' a las dependencias para robustez (aunque 'user' basta)

    return (
        <ProfileContext.Provider
            value={{
                usuario,
                loading,
                // ...
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};

export default ProfileContext;