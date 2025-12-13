// ManageProfilesUser.jsx (CÓDIGO 100% FUNCIONAL)

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import ModalEditProfile from "./ModalEditProfile";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import axios from "axios";
import { API_PERFILES } from "../../services/api";
import { useNavigate } from "react-router-dom";

const ManageProfilesUser = () => {
  // Mantenemos refreshPerfilesList por si lo usas en otro lado o tu AuthContext lo requiere
  const { user, refreshPerfilesList, loadingAuth } = useAuth(); // 🛑 Añadimos 'loadingAuth'
  const [modalOpen, setModalOpen] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState(null);

  const [perfilesActuales, setPerfilesActuales] = useState([]);
  // Usamos 'loadingAuth' del contexto para el estado inicial de carga
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const userId = user?.id || user?._id;
  const token = user?.token;

  // Asumo que tu contexto 'user' guarda el perfil activo en 'user.currentProfileId' o similar.
  const activeProfileId = user?.currentProfileId;


  // 🔥 FUNCIÓN CENTRAL PARA CARGAR PERFILES (Envuelto en useCallback)
  const fetchPerfiles = useCallback(async () => {
    // 🛑 Mantenemos la verificación estricta para userId y token.
    if (!userId || !token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `${API_PERFILES}/${userId}/perfiles`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Normalización: _id del backend a id del frontend
      const perfilesNormalizados = Array.isArray(res.data.perfiles)
        ? res.data.perfiles.map((p) => ({
          id: p._id,
          name: p.name,
          avatar: p.avatar,
        }))
        : [];

      setPerfilesActuales(perfilesNormalizados);

      // Opcional: Si tu AuthContext necesita actualizarse con la lista recién cargada
      if (refreshPerfilesList) {
        // Asumo que refreshPerfilesList no requiere un userId, solo actualiza el estado interno
        await refreshPerfilesList();
      }

    } catch (error) {
      toast.error("Error cargando perfiles a administrar.");
      console.error("Error obteniendo perfiles:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, token, refreshPerfilesList]);

  // Ejecutar al montar: Solo se ejecuta si los datos de autenticación no están cargando
  useEffect(() => {
    if (!loadingAuth) {
      fetchPerfiles();
    }
  }, [fetchPerfiles, loadingAuth]); // 🛑 Dependencia de loadingAuth


  // 🛑 CLAVE: Nueva función para manejar el cierre del modal
  const handleModalClose = (shouldRefresh = false) => {
    setModalOpen(false);
    setProfileToEdit(null);

    if (shouldRefresh) {
      fetchPerfiles();
    }
  };


  // 🗑 ELIMINAR PERFIL (BLOQUE CORREGIDO FINAL)
  const handleDelete = async (profileId) => {
    const perfil = perfilesActuales.find((p) => p.id === profileId);

    if (!perfil) {
      toast.error("Perfil no encontrado.");
      return;
    }

    Swal.fire({
      text: `¿Eliminar el perfil "${perfil.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#1f1f1f",
      color: "white",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = user?.token;
          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            },
          };

          // 1. Llamada DELETE al backend
          await axios.delete(
            `${API_PERFILES}/${userId}/perfiles/${perfil.id}`,
            config
          );

          // 2. Recargar perfiles (refresca perfilesActuales y el contexto si está configurado)
          await fetchPerfiles();


          // 3. Lógica de Navegación Condicional y Feedback
          const isDeletedProfileActive = activeProfileId === profileId;

          // Usamos la lista actualizada *después* del fetch.
          if (perfilesActuales.length === 0 || isDeletedProfileActive) {
            toast.success(`Perfil ${perfil.name} eliminado. Volviendo al selector.`);
            navigate("/profileselector");
          } else {
            toast.success("Perfil eliminado correctamente");
          }

        } catch (error) {
          toast.error("Error eliminando el perfil");
          console.error(error.response?.data || error);
        }
      } else {
        toast.info("Eliminación cancelada");
      }
    });
  };


  // Manejo de carga de datos 
  // 🛑 CLAVE 1: Mostrar "Cargando" si la autenticación aún no terminó.
  if (loadingAuth || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black/90">
        Cargando perfiles para administrar...
      </div>
    );
  }

  // 🛑 CLAVE 2: Si user es null/undefined después de cargar, redirigir
  if (!user || !userId) {
    navigate("/login");
    return null;
  }


  // Manejo de la lista de perfiles vacía después de la carga
  if (perfilesActuales.length === 0 && !loading) {
    // Si la carga terminó y no hay perfiles, siempre navegamos al selector.
    navigate("/profileselector");
    return null;
  }


  return (
    <div className="min-h-screen bg-black/90 text-white flex flex-col items-center pt-20 pb-10">

      <h1 className="text-4xl font-bold mb-10">Administrar Perfiles</h1>
      {/* ... (El resto del JSX es igual) ... */}
      <button
        onClick={() => navigate("/profileselector")}
        className="mb-10 bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg"
      >
        Volver a Perfiles
      </button>

      <div
        className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 place-items-center"
      >
        {/* Renderizado */}
        {perfilesActuales.map((p) => (
          <div key={p.id} className="flex flex-col items-center text-center">

            <img
              src={p.avatar}
              className="w-28 h-28 rounded-lg cursor-pointer object-cover mb-3 shadow-xl hover:scale-105 transition"
            />

            <p className="text-lg font-semibold mb-3">{p.name}</p>

            <div className="flex gap-3">
              {/* BOTÓN EDITAR */}
              <button
                className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded"
                onClick={() => {
                  setProfileToEdit(p);
                  setModalOpen(true);
                }}
              >
                Editar
              </button>

              {/* BOTÓN ELIMINAR */}
              <button
                className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded"
                onClick={() => handleDelete(p.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL EDITAR */}
      <ModalEditProfile
        isOpen={modalOpen}
        onClose={handleModalClose}
        profile={profileToEdit}
      />
    </div>
  );
};

export default ManageProfilesUser;