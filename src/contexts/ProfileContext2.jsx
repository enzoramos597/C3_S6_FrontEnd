import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { API_USERS } from "../services/api";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext();

export const useProfiles = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [usuario, setUsuario] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // Obtenemos el usuario logueado

  const fetchUsuario = async () => {
    // 1. OBTENER EL TOKEN DEL ALMACENAMIENTO LOCAL
    const token = localStorage.getItem("token");

    // 2. Si no hay token, no intentar la petición (aunque el useEffect ya lo maneja, es buena práctica)
    if (!token) {
      setLoading(false);
      console.warn("No hay token de autenticación disponible. No se puede cargar el usuario.");
      return;
    }

    setLoading(true);

    try {
      // 3. ENVIAR EL TOKEN EN EL HEADER 'Authorization'
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Formato estándar: Bearer [TOKEN]
        },
      };

      // 4. Hacer la petición con la configuración de headers
      const { data } = await axios.get(API_USERS, config);
      setUsuario(data);
      
    } catch (error) {
      console.error("Error fetching Usuario:", error);

      // Si el error es 401, podríamos querer cerrar la sesión automáticamente aquí
      if (axios.isAxiosError(error) && error.response?.status === 401) {
          console.warn("Sesión expirada o no autorizada. Redirigiendo a login...");
          // Si tu hook useAuth tiene una función logout, podrías llamarla aquí:
          // logout(); 
      }
      
    } finally {
      setLoading(false);
    }
  };
  // POST
  {/*const createUsuario = async (profile) => {
    const { data } = await axios.post(API_USERS, profile)
    setUsuario((prev) => [...prev, data]);
  }*/}

  // PUT
  {/*const updateUsuario = async (id, updatedUsuario) => {
    const { data } = await axios.put(`${API_USERS}/${id}`, updatedUsuario)
    setUsuario((prev) =>
      prev.map((profile) => (profile.id === id ? data : profile))
    )
  }*/}

  // DELETE
  {/*const deleteUsuario = async (id) => {
    await axios.delete(`${API_USERS}/${id}`)
    setUsuario((prev) => prev.filter((profile) => profile.id !== id))
  }*/}

  useEffect(() => {
    if (user){
      fetchUsuario()
    }    
  }, [user]);

  return (
    <ProfileContext.Provider
      value={{
        usuario,
        loading,
        //createUsuario,
        //updateProfile,
        //deleteProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;
