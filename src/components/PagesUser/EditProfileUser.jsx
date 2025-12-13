import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2"
import { toast } from "react-toastify"
import axios from "axios"
import { useAuth } from "../../contexts/AuthContext"
import {
  API_TRAERUNUSUARIO,
  API_USER_MODIFICARUNUSUARIO,
} from "../../services/api"

const EditProfileUser = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth() // ✅ USAMOS AUTH CONTEXT

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // 🟡 Iniciales si no hay avatar
  const getInitials = (nombre, apellido) => {
    const n = nombre?.charAt(0)?.toUpperCase() ?? ""
    const a = apellido?.charAt(0)?.toUpperCase() ?? ""
    return n + a
  };

  // 🔵 TRAER USUARIO
  useEffect(() => {
    if (!user || !user.token) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${API_TRAERUNUSUARIO}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        // 🔥 CLAVE: el backend devuelve { usuario }
        const usuario = res.data.usuario;

        setValue("email", usuario.correo)
        setValue("firstname", usuario.name)
        setValue("lastname", usuario.apellido)
        //setValue("password", "");
        setValue("avatar", usuario.avatar ?? "")

      } catch (error) {
        console.error(error.response?.data || error)
        toast.error("No tenés permisos para ver este usuario")
        navigate("/")
      }
    }

    fetchUser();
  }, [id, user, setValue, navigate])

  // 🟣 GUARDAR CAMBIOS
  const onSubmit = async (data) => {
    try {
      let finalAvatar = data.avatar?.trim()

      if (finalAvatar) {
        const isValidImage = /\.(jpg|jpeg|png|webp)$/i.test(finalAvatar)
        if (!isValidImage) {
          toast.error("El avatar debe ser JPG, JPEG, PNG o WEBP");
          return
        }
      }

      if (!finalAvatar) {
        finalAvatar = getInitials(data.firstname, data.lastname)
      }

      const updatedUser = {
        correo: data.email,
        //contrasenia: data.password,
        name: data.firstname,
        apellido: data.lastname,
        avatar: finalAvatar,
      };

      await axios.put(
        `${API_USER_MODIFICARUNUSUARIO}/${id}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Perfil actualizado correctamente 🎉")

      await Swal.fire({
        title: "¡Perfil actualizado!",
        text: "Los cambios fueron guardados.",
        icon: "success",
        confirmButtonColor: "#e50914",
      })

      navigate("/")
    } catch (error) {
      console.error(error.response?.data || error)
      toast.error("Error al actualizar el usuario")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/70">
      <div className="bg-black/90 p-8 rounded-lg w-full max-w-md shadow-lg relative">

        <Link
          to="/"
          className="absolute top-3 right-3 text-gray-400 hover:text-red-700 text-2xl"
        >
          &times;
        </Link>

        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Editar Perfil
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          {/* EMAIL */}
          <label className="text-white text-sm">Correo electrónico</label>
          <input
            disabled
            {...register("email")}
            className="p-3 rounded bg-gray-700 text-gray-400 cursor-not-allowed"
          />

          {/* PASSWORD */}
          {/*<label className="text-white text-sm">Contraseña</label>
          <input
            type="password"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: { value: 6, message: "Mínimo 6 caracteres" },
            })}
            className="p-3 rounded bg-gray-700 text-white"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}*/}

          {/* FIRSTNAME */}
          <label className="text-white text-sm">Nombre</label>
          <input
            {...register("firstname", { required: "El nombre es obligatorio" })}
            className="p-3 rounded bg-gray-700 text-white"
          />

          {/* LASTNAME */}
          <label className="text-white text-sm">Apellido</label>
          <input
            {...register("lastname", { required: "El apellido es obligatorio" })}
            className="p-3 rounded bg-gray-700 text-white"
          />

          {/* AVATAR */}
          <label className="text-white text-sm">Avatar (opcional)</label>
          <input
            {...register("avatar")}
            className="p-3 rounded bg-gray-700 text-white"
          />

          <div className="flex gap-3 mt-4">
            <button className="bg-red-600 w-1/2 p-3 rounded text-white">
              Guardar
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-gray-500 w-1/2 p-3 rounded text-white"
            >
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditProfileUser;
