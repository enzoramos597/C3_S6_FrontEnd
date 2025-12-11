import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
// ✅ Importaciones completas y correctas, incluyendo API_USER_CRUD
import { API_LOGIN, API_USER_CRUD } from "../services/api"

const AuthContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {

    // 🟦 USER GUARDADO EN LOCALSTORAGE (Inicialización)
    const [user, setUser] = useState(null)
    // 🛑 Mantenemos loading en true para la lectura inicial de localStorage
    const [loading, setLoading] = useState(true)

    // 🛑 EFECTO: Leer localStorage y finalizar la carga (Se mantiene)
    useEffect(() => {
        try {
            const saved = localStorage.getItem("user")
            if (saved) {
                const parsedUser = JSON.parse(saved);
                setUser(parsedUser);
            }
        } catch (error) {
            console.error("Error al parsear el usuario de localStorage:", error);
            localStorage.removeItem("user");
        } finally {
            setLoading(false);
        }
    }, []);

    // 🟩 LOGIN (Se mantiene el POST con token)
    const login = async (correo, contrasenia) => {
        setLoading(true);
        try {
            const res = await axios.post(API_LOGIN, {
                correo: correo,
                contrasenia: contrasenia
            });

            const loggedInUser = res.data.user;
            const token = res.data.token;
            // Aseguramos que el ID de Mongoose (_id) se use si está disponible
            const idField = loggedInUser._id ? '_id' : 'id';

            const userWithToken = {
                ...loggedInUser,
                token: token,
                // Garantizamos que _id siempre esté presente
                _id: loggedInUser[idField]
            };

            if (loggedInUser.estado === 0) {
                return userWithToken;
            }

            setUser(userWithToken);
            localStorage.setItem("user", JSON.stringify(userWithToken));

            return userWithToken;

        } catch (error) {
            console.error("Error en login:", error);
            return null;
        } finally {
            setLoading(false);
        }
    }

    // 🔴 LOGOUT (Se mantiene)
    const logout = () => {
        setUser(null)
        localStorage.removeItem("user")
        window.location.href = "/"
    }

    // ⭐ IMPLEMENTACIÓN CRÍTICA PARA FAVORITOS - 100% FUNCIONAL ⭐
    const updateUserFavoritos = async (favoritos) => {
        // Verificar que el usuario y los datos necesarios existan
        if (!user || !user._id || !user.token) {
            console.error("Usuario no autenticado o ID/Token faltante.");
            return;
        }

        try {
            // 1. Lista de favoritos para actualizar el estado LOCAL (contiene {id, title, poster})
            const updatedUser = { ...user, favoritos };

            // 2. ✅ CORRECCIÓN CLAVE: Mapeamos el array de objetos a un array de solo strings de ID 
            //    Esto es lo que Mongoose espera en el backend.
            const favoritosIds = favoritos.map(fav => fav.id);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            };

            // 3. ✅ USAMOS API_USER_CRUD: Enviamos SOLO LOS IDS al endpoint de actualización.
            await axios.put(`${API_USER_CRUD}/${user._id}`, { favoritos: favoritosIds }, config);

            // 4. Actualizar el estado del contexto y localStorage con el array de OBJETOS completos.
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

        } catch (error) {
            console.error("Error al guardar favoritos en el servidor:", error.response?.data || error);
            // Re-lanzar el error para que MovieDetail pueda manejar la notificación
            throw error;
        }
    }

    // 💡 Nota: No incluí las funciones de perfil (updateUserProfile, deleteUserProfile) 
    // ya que no proporcionaste sus endpoints, pero necesitarían usar API_USER_CRUD 
    // y user._id para ser funcionales.

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                updateUserFavoritos,
                loading
            }}
        >
            {loading ? <p>Cargando aplicación...</p> : children}
        </AuthContext.Provider>
    )
}