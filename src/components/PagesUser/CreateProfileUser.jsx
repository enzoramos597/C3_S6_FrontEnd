import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { API_TRAERUNUSUARIO, API_USER_MODIFICARUNUSUARIO } from "../../services/api";

// Avatares
import doug from "../../assets/avatars/Doug.jpg";
import starwars from "../../assets/avatars/starwars.jpeg";
import starwars2 from "../../assets/avatars/starwars2.webp";
import starwars3 from "../../assets/avatars/starwars3.webp";

const avatars = [doug, starwars, starwars2, starwars3];

const CreateProfileUser = () => {
  const { user, setUser } = useAuth();

  const userId = user?._id;
  const token = user?.token;

  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      // 🔥 Obtener usuario actual del backend
      const res = await axios.get(`${API_TRAERUNUSUARIO}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userData = res.data;
      const perfiles = userData.perfiles || [];

      // ❌ Límite de 5 perfiles
      if (perfiles.length >= 5) {
        return setErrorMessage("Puedes crear hasta 5 perfiles");
      }

      // ❌ Nombre repetido
      const nombreExiste = perfiles.some(
        (p) => p.name.toLowerCase() === data.name.toLowerCase()
      );

      if (nombreExiste) {
        return setErrorMessage("Ya existe un perfil con ese nombre");
      }

      // Crear nuevo perfil (Mongo hace el _id)
      const nuevoPerfil = {
        name: data.name,
        avatar: data.avatar
      };

      // 🔥 PUT para guardar perfil
      const putRes = await axios.put(
        `${API_USER_MODIFICARUNUSUARIO}/${userId}`,
        { perfiles: [...perfiles, nuevoPerfil] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ⚠️ IMPORTANTE: tu backend devuelve { result, mensaje, usuario }
      const updatedUser = putRes.data.usuario;

      // Mantener el token
      const userWithToken = {
        ...updatedUser,
        token
      };

      // Guardar nuevo usuario en contexto + localStorage
      setUser(userWithToken);
      localStorage.setItem("user", JSON.stringify(userWithToken));

      // Volver a selector de perfiles
      navigate("/user");

    } catch (error) {
      console.log(error);
      setErrorMessage("Error al crear el perfil");
    }
  };

  return (
    <div className="min-h-screen bg-black/90 flex items-center justify-center p-6">
      <div className="bg-black/40 backdrop-blur-md p-10 rounded-xl w-full max-w-md text-center border border-gray-700">

        <h2 className="text-3xl text-white font-bold mb-6 tracking-wide">
          Crear Perfil
        </h2>

        {errorMessage && (
          <p className="text-red-500 font-semibold mb-3">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="text-left">

          <label className="text-gray-300 font-semibold">Nombre del perfil</label>
          <input
            type="text"
            placeholder="Ej: Juan"
            className="w-full p-2 mt-1 mb-3 bg-gray-800 text-white rounded 
            border border-gray-600 focus:border-red-500 outline-none"
            {...register("name", { required: "El nombre es obligatorio" })}
          />

          {errors.name && (
            <p className="text-red-400 text-sm mb-2">{errors.name.message}</p>
          )}

          <p className="text-white mb-3 font-semibold">Selecciona un avatar:</p>

          <div className="grid grid-cols-4 gap-4 justify-center mb-4">
            {avatars.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt="avatar"
                onClick={() => {
                  setSelectedAvatar(avatar);
                  setValue("avatar", avatar, { shouldValidate: true });
                }}
                className={`w-20 h-20 rounded-md object-cover cursor-pointer border-4 transition-all duration-200
                ${
                  selectedAvatar === avatar
                    ? "border-red-600 scale-105"
                    : "border-transparent"
                }`}
              />
            ))}
          </div>

          <input
            type="hidden"
            {...register("avatar", { required: "Debe seleccionar un avatar" })}
          />

          {errors.avatar && (
            <p className="text-red-400 text-sm mb-2">{errors.avatar.message}</p>
          )}

          <div className="flex flex-col gap-3 mt-4">
            <button
              type="submit"
              className="bg-red-600 text-white font-semibold py-2 rounded hover:bg-red-700 transition"
            >
              Crear Perfil
            </button>

            <button
              type="button"
              className="bg-gray-700 text-white py-2 rounded hover:bg-gray-600 transition"
              onClick={() => navigate("/user")}
            >
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateProfileUser;
