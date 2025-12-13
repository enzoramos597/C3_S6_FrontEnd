import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import ProfileCardUser from "../PagesUser/ProfileCardUser";
import { API_PERFILES } from "../../services/api";

const ProfileSelectorUser = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const userId = user?._id;
  const token = user?.token;

  const [perfiles, setPerfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 TRAER PERFILES DESDE BACKEND
  useEffect(() => {
    const fetchPerfiles = async () => {
      if (!userId || !token) return;

      try {
        const res = await axios.get(
          `${API_PERFILES}/${userId}/perfiles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const perfilesNormalizados = Array.isArray(res.data.perfiles)
          ? res.data.perfiles.map((p) => ({
              id: p._id,
              name: p.name,
              avatar: p.avatar,
            }))
          : [];

        setPerfiles(perfilesNormalizados);

      } catch (error) {
        console.error("Error obteniendo perfiles:", error);
        toast.error("Error cargando perfiles");
      } finally {
        setLoading(false);
      }
    };

    fetchPerfiles();
  }, [userId, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Cargando perfiles...
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Sesión inválida. Inicia sesión nuevamente.
      </div>
    );
  }

  const handleAddProfile = () => {
    if (perfiles.length >= 5) {
      toast.error("Puedes tener hasta 5 perfiles");
      return;
    }
    navigate("/admin/createperfiluser");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black/80 text-white">
      <h1 className="text-4xl font-bold mb-6">¿Quién está viendo?</h1>

      <div className="flex flex-wrap justify-center gap-8 mx-10">

        {/* SIN PERFILES */}
        {perfiles.length === 0 && (
          <div className="flex flex-col items-center">
            <p className="text-xl mb-4">
              No tienes perfiles creados
            </p>
            <button
              onClick={handleAddProfile}
              className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded-lg"
            >
              Crear perfil
            </button>
          </div>
        )}

        {/* LISTADO */}
        {perfiles.map((profile) => (
          <ProfileCardUser
            key={profile.id}
            name={profile.name}
            avatar={profile.avatar}
            onClick={() => navigate("/peliculas")}
          />
        ))}

        {/* AGREGAR PERFIL */}
        {perfiles.length > 0 && (
          <div className="flex flex-col items-center cursor-pointer">
            <div
              onClick={handleAddProfile}
              className="w-24 h-24 flex items-center justify-center bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              <span className="text-4xl font-bold">+</span>
            </div>
            <p className="mt-2 text-sm font-semibold">Agregar Perfil</p>
          </div>
        )}
      </div>

      {/* ADMINISTRAR */}
      {perfiles.length > 0 && (
        <button
          onClick={() => navigate("/manageprofiles")}
          className="mt-8 px-6 py-2 font-semibold bg-gray-800 hover:bg-gray-700 rounded-lg"
        >
          Administrar Perfiles
        </button>
      )}

      <button
        onClick={() => navigate(`/edit-profile/${userId}`)}
        className="mt-4 px-6 py-2 font-semibold bg-gray-800 hover:bg-gray-700 rounded-lg"
      >
        Administrar Cuenta
      </button>
    </div>
  );
};

export default ProfileSelectorUser;
