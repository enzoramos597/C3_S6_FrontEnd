import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import axios from "axios";
import { API_REGISTERUSER, API_USERSINTOKEN } from "../../services/api";

const RegisterFormAdmin = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // 🟡 Generar iniciales
  const getInitials = (nombre, apellido) => {
    const n = nombre?.charAt(0)?.toUpperCase() ?? "";
    const a = apellido?.charAt(0)?.toUpperCase() ?? "";
    return n + a;
  };

  const onSubmit = async (data) => {
    try {
      const email = data.email.toLowerCase().trim();

      // 🔴 1. TRAER USUARIOS SIN TOKEN
      const usersRes = await axios.get(API_USERSINTOKEN);

      if (!usersRes.data?.usuarios) {
        toast.error("No se pudieron obtener los usuarios");
        return;
      }

      const users = usersRes.data.usuarios;

      // 🔴 2. VALIDAR EMAIL DUPLICADO
      const emailExists = users.some(
        (u) => u.correo.toLowerCase() === email
      );

      if (emailExists) {
        toast.error("Ya existe un usuario con ese correo 📧");
        return;
      }

      // 🔵 3. AVATAR O INICIALES
      let finalAvatar;
      const avatarUrl = data.avatar?.trim();

      if (avatarUrl) {
        const isValidImage = /\.(jpg|jpeg|png|webp)$/i.test(avatarUrl);
        if (!isValidImage) {
          toast.error("El avatar debe ser JPG, JPEG, PNG o WEBP");
          return;
        }
        finalAvatar = avatarUrl;
      } else {
        finalAvatar = getInitials(data.firstname, data.lastname);
      }

      // 🟣 4. OBJETO ADMIN
      const newAdmin = {
        correo: email,
        contrasenia: data.password,
        name: data.firstname,
        apellido: data.lastname,
        avatar: finalAvatar,
        perfiles: [],
        favoritos: [],
        estado: 1,
        role: "admin", // 🔥 ADMIN
      };

      // 🟢 5. CREAR ADMIN (NO PIDE TOKEN)
      const res = await axios.post(API_REGISTERUSER, newAdmin);

      if (res.data.result === "success") {
        toast.success("Administrador creado correctamente 🎉");

        await Swal.fire({
          title: "¡Administrador creado!",
          text: "La cuenta fue registrada correctamente.",
          icon: "success",
          confirmButtonColor: "#e50914",
        });

        navigate("/");
      } else {
        toast.error(res.data.mensaje || "Error al crear administrador");
      }

    } catch (error) {
      console.error("Error al registrar administrador:", error);
      toast.error(
        error.response?.data?.mensaje || "Error al crear el administrador"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
      <div className="bg-black/90 p-8 rounded-lg w-full max-w-md shadow-lg relative">

        <Link
          to="/"
          className="absolute top-3 right-3 text-gray-400 hover:text-red-700 text-2xl"
        >
          &times;
        </Link>

        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Crear Administrador
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          {/* EMAIL */}
          <input
            type="email"
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Correo inválido",
              },
            })}
            placeholder="Correo electrónico"
            className="w-full p-3 rounded bg-gray-700 text-white"
          />
          {errors.email && (
            <p className="text-red-500 text-sm -mt-3 mb-2">
              {errors.email.message}
            </p>
          )}

          {/* PASSWORD */}
          <input
            type="password"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: { value: 6, message: "Mínimo 6 caracteres" },
            })}
            placeholder="Contraseña"
            className="w-full p-3 rounded bg-gray-700 text-white"
          />
          {errors.password && (
            <p className="text-red-500 text-sm -mt-3 mb-2">
              {errors.password.message}
            </p>
          )}

          {/* NOMBRE */}
          <input
            {...register("firstname", {
              required: "El nombre es obligatorio",
              maxLength: { value: 20, message: "Máximo 20 caracteres" },
              pattern: { value: /^[A-Za-zÁÉÍÓÚÑáéíóúñ]+$/, message: "Solo letras" },
            })}
            placeholder="Nombre"
            className="w-full p-3 rounded bg-gray-700 text-white"
          />
          {errors.firstname && (
            <p className="text-red-500 text-sm -mt-3 mb-2">
              {errors.firstname.message}
            </p>
          )}

          {/* APELLIDO */}
          <input
            {...register("lastname", {
              required: "El apellido es obligatorio",
              maxLength: { value: 20, message: "Máximo 20 caracteres" },
              pattern: { value: /^[A-Za-zÁÉÍÓÚÑáéíóúñ]+$/, message: "Solo letras" },
            })}
            placeholder="Apellido"
            className="w-full p-3 rounded bg-gray-700 text-white"
          />
          {errors.lastname && (
            <p className="text-red-500 text-sm -mt-3 mb-2">
              {errors.lastname.message}
            </p>
          )}

          {/* AVATAR */}
          <div>
            <label className="text-white text-sm">URL de avatar (opcional)</label>
            <input
              type="text"
              {...register("avatar")}
              placeholder="https://miavatar.com/foto.png"
              className="w-full p-2 mt-1 rounded bg-gray-700 text-white"
            />
          </div>

          <div className="flex justify-between gap-3 mt-4">
            <button
              type="submit"
              className="bg-red-600 text-white w-1/2 p-3 rounded text-lg font-semibold hover:bg-red-700 transition"
            >
              Crear Admin
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-gray-500 text-white w-1/2 p-3 rounded text-lg font-semibold hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RegisterFormAdmin;
