import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { API_PERFILES } from "../../services/api";

// Avatares
import doug from "../../assets/avatars/Doug.jpg";
import starwars from "../../assets/avatars/starwars.jpeg";
import starwars2 from "../../assets/avatars/starwars2.webp";
import starwars3 from "../../assets/avatars/starwars3.webp";

const avatars = [doug, starwars, starwars2, starwars3];

const CreateProfileUser = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ Mongo usa _id
  const userId = user?._id;
  const token = user?.token;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      setErrorMessage("");

      await axios.post(
        `${API_PERFILES}/${userId}/perfiles`,
        {
          name: data.name,
          avatar: data.avatar,
          tipo: "estandar",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Volver al selector de perfiles
      navigate("/profileselector");

    } catch (error) {
      console.error(error);

      setErrorMessage(
        error.response?.data?.mensaje || "Error al crear el perfil"
      );
    }
  };

  return (
    <div className="min-h-screen bg-black/90 flex items-center justify-center p-6">
      <div className="bg-black/40 backdrop-blur-md p-10 rounded-xl w-full max-w-md text-center border border-gray-700">

        <h2 className="text-3xl text-white font-bold mb-6 tracking-wide">
          Crear Perfil
        </h2>

        {/* ERROR */}
        {errorMessage && (
          <p className="text-red-500 font-semibold mb-3">{errorMessage}</p>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="text-left">

          {/* Nombre */}
          <label className="text-gray-300 font-semibold">
            Nombre del perfil
          </label>
          <input
            type="text"
            placeholder="Ej: Enzo"
            className="w-full p-2 mt-1 mb-3 bg-gray-800 text-white rounded 
              border border-gray-600 focus:border-red-500 outline-none"
            {...register("name", {
              required: "El nombre es obligatorio",
            })}
          />

          {errors.name && (
            <p className="text-red-400 text-sm mb-2">
              {errors.name.message}
            </p>
          )}

          {/* Avatares */}
          <p className="text-white mb-3 font-semibold">
            Selecciona un avatar
          </p>

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
                className={`w-20 h-20 rounded-md object-cover cursor-pointer border-4 transition-all
                  ${
                    selectedAvatar === avatar
                      ? "border-red-600 scale-105"
                      : "border-transparent"
                  }`}
              />
            ))}
          </div>

          {/* Avatar oculto */}
          <input
            type="hidden"
            {...register("avatar", {
              required: "Debe seleccionar un avatar",
            })}
          />

          {errors.avatar && (
            <p className="text-red-400 text-sm mb-2">
              {errors.avatar.message}
            </p>
          )}

          {/* BOTONES */}
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
              onClick={() => navigate("/profileselector")}
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
