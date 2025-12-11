import { createContext, useContext, useState } from "react"
import axios from "axios"
//import { API_USERS } from "../services/api"
import { API_LOGIN } from "../services/api"


const AuthContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {

  // 🟦 USER GUARDADO EN LOCALSTORAGE
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user")    
    return saved ? JSON.parse(saved) : null
  })

  const [loading, setLoading] = useState(false)
  //const APILOGIN = "https://c3s6backend-production.up.railway.app/api/auth/login"
  // 🟩 LOGIN
const login = async (correo, contrasenia) => {
    setLoading(true);
    try {
        // CORRECCIÓN: Usar axios.post y pasar el cuerpo (credenciales) como SEGUNDO argumento
        const res = await axios.post(API_LOGIN, { 
            correo: correo, 
            contrasenia: contrasenia
        });

        const loggedInUser = res.data.user; 
        console.log(loggedInUser);
        //console.log("Mostrar el usuario", loggedInUser); // Eliminé el .data extra
        const token = res.data.token;

        // 2. Verificar si el usuario está deshabilitado (si el backend no lo maneja)
        if (loggedInUser.estado === 0) {
            return { ...loggedInUser, estado: 0 } 
        }

        // 3. Guardar en Contexto (el usuario ya está validado por el backend)
        setUser(loggedInUser);
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        localStorage.setItem("token", token);
        return loggedInUser;

    } catch (error) {
        console.error("Error en login:", error);
        // Si el servidor devuelve 401, el mensaje ya lo indicará
        // Ejemplo: alert(error.response.data.message || "Credenciales incorrectas");
        return null; 
    } finally {
        setLoading(false);
    }
}

  // 🟧 REFRESCAR DATOS DEL USER
  {/*} const refreshUser = async (id) => {
    try {
      const { data } = await axios.get(`${API_USERS}/${id}`)
      setUser(data)
      localStorage.setItem("user", JSON.stringify(data))
      return data
    } catch (error) {
      console.error("Error en refreshUser:", error)
    }
  }*/}

  // 🔴 LOGOUT
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    window.location.href = "/" // fuerza recarga
  }

  // ⭐ FAVORITOS DEL USER
  {/*const updateUserFavoritos = async (favoritos) => {
    if (!user) return

    try {
      const updated = { ...user, favoritos }
      await axios.put(`${API_USERS}/${user.id}`, updated)

      setUser(updated)
      localStorage.setItem("user", JSON.stringify(updated))
    } catch (error) {
      console.error("Error actualizando favoritos:", error)
    }
  }

  const updateUserProfile = async (profileId, updatedData) => {
    if (!user) return

    try {
      const updatedProfiles = user.perfiles.map(p =>
        p.id === profileId ? { ...p, ...updatedData } : p
      )

      const updatedUser = { ...user, perfiles: updatedProfiles }

      await axios.put(`${API_USERS}/${user.id}`, updatedUser)

      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    } catch (error) {
      console.error("Error actualizando perfil:", error)
    }
  }

  const deleteUserProfile = async (profileId) => {
    if (!user) return

    try {
      const updatedProfiles = user.perfiles.filter(p => p.id !== profileId)
      const updatedUser = { ...user, perfiles: updatedProfiles }

      await axios.put(`${API_USERS}/${user.id}`, updatedUser)

      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    } catch (error) {
      console.error("Error eliminando perfil:", error)
    }
  }*/}

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading
        //refreshUser,
        //updateUserFavoritos,
        //updateUserProfile,
        //deleteUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
