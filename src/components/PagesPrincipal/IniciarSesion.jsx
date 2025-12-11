import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

const IniciarSesion = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors }} = useForm();

  const ADMIN_ROLE_ID = '69366436d9ae941a18015fc0'; // Definir la constante
  const USER_ROLE_ID = '6936638cd9ae941a18015fbb'; // Definir la constante

  const onSubmit = async (data) => {
    const user = await login(data.email, data.password);
    console.log(user)
    if (!user) {
      toast.error("Usuario o contraseña incorrectas ❌");
      return;
    }

    // 🚨 NUEVA VALIDACIÓN DE ESTADO
    if (user.estado === 0) {
      toast.error(
        "Tu cuenta está deshabilitada por falta de pago u otro inconveniente. " +
        "Por favor contacta al administrador."
      );
      navigate("/cuenta-deshabilitada");
      return;
    }

    // Si está activo (estado = 1)
    toast.success(`Bienvenido ${user.name} 🎉`);
    console.log("Propiedad user.rol:", user?.role);
    console.log("ADMIN_ROLE_ID:", ADMIN_ROLE_ID);
    console.log("USER_ROLE_ID:", USER_ROLE_ID);
    if (user?.rol === ADMIN_ROLE_ID) {
        navigate("/admin"); // Ruta base para el admin
    } 
    // Si el rol del usuario (user.role) coincide con el ID de User
    else if (user?.rol === USER_ROLE_ID) {
        navigate("/user"); // Ruta base para el usuario estándar
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[82vh] w-full">
      <div className="bg-neutral-900 w-full max-w-md p-8 rounded-lg relative">

        <Link
          to="/"
          className="absolute top-3 right-3 text-gray-400 hover:text-red-700 text-2xl"
        >
          &times;
        </Link>

        <h2 className="text-white text-3xl mb-6 text-center font-bold">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

           <input
            type="email"
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Correo inválido" }
            })}
            placeholder="Correo electrónico"
            className="p-3 rounded bg-neutral-800 text-white border border-neutral-700"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <input
            type="password"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: { value: 6, message: "Mínimo 6 caracteres" }
            })}
            placeholder="Contraseña"
            className="p-3 rounded bg-neutral-800 text-white border border-neutral-700"
          />
          
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <button
            type="submit"
            className="bg-red-600 py-3 rounded text-white font-semibold hover:bg-red-500"
          >
            Iniciar sesión
          </button>

          <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-red-600" />
              Recordarme
            </label>
            <Link to="#" className="hover:underline text-gray-300">
              ¿Olvidaste la contraseña?
            </Link>
          </div>

          <p className="text-gray-400 mt-6 text-sm">
            ¿Primera vez en PeliFlix?
            <Link
              to="/registrar-usuario"
              className="text-white font-semibold hover:underline ml-1"
            >
              Suscríbete ya.
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default IniciarSesion;
