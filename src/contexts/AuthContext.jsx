import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { API_LOGIN, API_USER_CRUD, API_IDMOVIES, API_TRAERUNUSUARIO } from "../services/api"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // 🆕 FUNCIÓN AUXILIAR: Hidrata los favoritos (IDs → Objetos completos)
    const hydrateFavoritos = async (favoritosIds, token) => {
        if (!Array.isArray(favoritosIds) || favoritosIds.length === 0) {
            return [];
        }

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        try {
            // Obtener detalles de cada película
            const promises = favoritosIds.map(id => 
                axios.get(`${API_IDMOVIES}/${id}`, config)
                    .then(res => {
                        const movie = res.data.pelicula || res.data;
                        return {
                            id: String(movie._id || movie.id),
                            title: String(movie.original_title || movie.title || 'Título Desconocido'),
                            poster: movie.poster || '',
                            detalle: String(movie.detalle || 'Sin descripción disponible')
                        };
                    })
                    .catch(err => {
                        console.error(`Error obteniendo película ${id}:`, err);
                        return null; // Si falla, retornar null para filtrarlo después
                    })
            );

            const results = await Promise.all(promises);
            // Filtrar los que fallaron (null)
            return results.filter(fav => fav !== null);

        } catch (error) {
            console.error("Error hidratando favoritos:", error);
            return [];
        }
    };

    // Leer localStorage al iniciar
    useEffect(() => {
        const initAuth = async () => {
            try {
                const saved = localStorage.getItem("user");
                if (saved) {
                    const parsedUser = JSON.parse(saved);
                    
                    // 🔥 CLAVE: Si los favoritos son strings (IDs), hidratarlos
                    if (parsedUser.favoritos && parsedUser.favoritos.length > 0) {
                        const firstFav = parsedUser.favoritos[0];
                        
                        // Si el primer favorito es un string, son IDs
                        if (typeof firstFav === 'string') {
                            const hydrated = await hydrateFavoritos(parsedUser.favoritos, parsedUser.token);
                            parsedUser.favoritos = hydrated;
                        }
                    }
                    
                    setUser(parsedUser);
                }
            } catch (error) {
                console.error("Error al inicializar auth:", error);
                localStorage.removeItem("user");
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // 🟩 LOGIN
    // 🟩 LOGIN - LÍNEA ~70
const login = async (correo, contrasenia) => {
    setLoading(true);
    try {
        const res = await axios.post(API_LOGIN, { correo, contrasenia });

        const loggedInUser = res.data.user;
        const token = res.data.token;
        const idField = loggedInUser._id ? '_id' : 'id';

        // ✅ CORRECCIÓN: Asegurarse de guardar el role._id o role como string
        let userWithToken = {
            ...loggedInUser,
            token: token,
            _id: loggedInUser[idField],
            // 🔥 GUARDAR EL ROLE ID COMO STRING
            role: typeof loggedInUser.role === 'object' 
                ? String(loggedInUser.role._id) 
                : String(loggedInUser.role)
        };

        if (loggedInUser.estado === 0) {
            return userWithToken;
        }

        // Hidratar favoritos...
        if (userWithToken.favoritos && userWithToken.favoritos.length > 0) {
            const firstFav = userWithToken.favoritos[0];
            
            if (typeof firstFav === 'string') {
                const hydrated = await hydrateFavoritos(userWithToken.favoritos, token);
                userWithToken.favoritos = hydrated;
            }
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
    // 🔴 LOGOUT
    const logout = () => {
        setUser(null)
        localStorage.removeItem("user")
        window.location.href = "/"
    }

    // ⭐ ACTUALIZAR FAVORITOS
    const updateUserFavoritos = async (favoritos) => {
        if (!user || !user._id || !user.token) {
            console.error("Usuario no autenticado o ID/Token faltante.");
            return;
        }

        try {
            // Actualizar estado local con objetos completos
            const updatedUser = { ...user, favoritos };

            // Enviar solo IDs al backend
            const favoritosIds = favoritos.map(fav => fav.id);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            };

            await axios.put(`${API_USER_CRUD}/${user._id}`, { favoritos: favoritosIds }, config);

            // Actualizar contexto y localStorage
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

        } catch (error) {
            console.error("Error al guardar favoritos:", error.response?.data || error);
            throw error;
        }
    }

    // 🟢 REFRESCAR USER DESDE LA API — TRAE PERFILES POPULADOS

const refreshUser = async (userId) => {
    if (!user || !user.token) {
        console.error("Usuario no autenticado o token faltante.");
        return;
    }

    try {
        const config = {
            headers: { Authorization: `Bearer ${user.token}` }
        };

        const res = await axios.get(`${API_TRAERUNUSUARIO}/${userId}`, config);
        let updated = res.data.usuario || res.data;

        // 🔥 Normalizar perfiles (para que React pueda usarlos)
        updated.perfiles = Array.isArray(updated.perfiles)
            ? updated.perfiles.map(p => ({
                id: String(p._id || p.id),
                name: p.name,
                avatar: p.avatar
            }))
            : [];

        // ------------------------------------------
        // ⭐ MISMA LÓGICA QUE updateUserFavoritos
        // Mezcla el usuario anterior con el nuevo
        // ------------------------------------------

        const mergedUser = {
            ...user,         // conserva token, favoritos, etc.
            ...updated       // pisa datos actualizados (como perfiles)
        };

        // Guardar en estado + localStorage
        setUser(mergedUser);
        localStorage.setItem("user", JSON.stringify(mergedUser));

        return mergedUser;

    } catch (error) {
        console.error("Error refrescando usuario:", error.response?.data || error);
        throw error;
    }
};



    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                token: user?.token, 
                logout,
                refreshUser,
                updateUserFavoritos,
                loading
            }}
        >
            {loading ? <p>Cargando aplicación...</p> : children}
        </AuthContext.Provider>
    )
}
