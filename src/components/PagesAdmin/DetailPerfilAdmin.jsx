import { useParams, Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { toast } from "react-toastify"
import axios from "axios"
import { useAuth } from "../../contexts/AuthContext"
import { API_USERID, API_SHOW_ROLES, API_USER_CRUD } from "../../services/api"

const DetailPerfilAdmin = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()

  const [user, setUser] = useState(null)
  const [roles, setRoles] = useState([])

  // =============================
  // CONFIG AXIOS
  // =============================
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // =============================
  // CARGAR USUARIO Y ROLES
  // =============================
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resUser = await axios.get(`${API_USERID}/${id}`, config)
        const u = resUser.data.data
        console.log("que trae aqui detail",u)
        // Normalizados
        setUser({
          _id: u._id,
          name: u.name || "",
          apellido: u.apellido || "",
          correo: u.correo || "",
          avatar:
            u.avatar ||
            "https://i.pinimg.com/originals/34/65/cd/3465cda198db3eef055503fbb826e526.jpg",
          estado: u.estado ?? 1,
          role: typeof u.role === "object" ? u.role._id : u.role,
        })

        const resRoles = await axios.get(API_SHOW_ROLES, config);
        setRoles(resRoles.data.data);
      } catch (err) {
        toast.error("Error al cargar el usuario");
      }
    };

    cargarDatos();
  }, [id]);

  // =============================
  // VALIDACIONES
  // =============================
  const validarCampos = () => {
    if (!user.name.trim()) return "El nombre es obligatorio"
    if (!user.apellido.trim()) return "El apellido es obligatorio"
    if (!user.correo.trim()) return "El correo es obligatorio"

    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!correoRegex.test(user.correo)) return "Correo inválido"

    if (!user.role) return "Debe seleccionar un rol"

    return null
  }

  // =============================
  // VALIDAR CORREO DUPLICADO
  // =============================
  const validarCorreoDuplicado = async () => {
    try {
      const res = await axios.get(API_USER_CRUD, config) // trae TODOS los usuarios
      const usuarios = res.data.data

      return usuarios.some(
        (u) => u.correo === user.correo && u._id !== user._id
      )
    } catch (err) {
      return false;
    }
  };

  // =============================
  // HANDLE CHANGE
  // =============================
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    })
  }

  // =============================
  // GUARDAR CAMBIOS
  // =============================
  const guardarCambios = async () => {
    // ▪ Validación básica
    const msg = validarCampos()
    if (msg) {
      toast.error(msg)
      return
    }

    // ▪ Validar email duplicado
    const existe = await validarCorreoDuplicado()
    if (existe) {
      toast.error("El correo ya pertenece a otro usuario")
      return
    }

    // ▪ Confirmación visual
    const confirm = await Swal.fire({
      title: "¿Está seguro?",
      text: "Va a modificar este usuario.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e50914",
      cancelButtonColor: "#555",
      confirmButtonText: "Sí, modificar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      const updatedUser = {
        name: user.name,
        apellido: user.apellido,
        correo: user.correo,
        avatar: user.avatar,
        estado: Number(user.estado),
        role: user.role,
      };
      console.log("Mostrar User",updatedUser)
      await axios.put(`${API_USER_CRUD}/${id}`, updatedUser, config);

      toast.success("Usuario modificado correctamente 🎉")

      await Swal.fire({
        title: "¡Usuario modificado!",
        text: "Los cambios fueron guardados exitosamente.",
        icon: "success",
        confirmButtonColor: "#e50914",
      });

      navigate("/gestion-usuarios");
    } catch (error) {
      toast.error(error.response?.data?.mensaje || "Error al actualizar");
    }
  };

  if (!user)
    return <p className="text-white text-center mt-10">Cargando usuario...</p>;

  // =============================
  // UI
  // =============================
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 bg-black/90">
      <div className="bg-black/80 text-white p-8 rounded-xl shadow-xl w-full max-w-lg border border-red-700 relative">

        <Link
          to="/gestion-usuarios"
          className="absolute top-3 right-4 text-gray-400 hover:text-red-600 text-3xl"
        >
          &times;
        </Link>

        <h2 className="text-3xl font-bold text-center mb-6">Perfil del Usuario</h2>

        {/* Avatar Preview */}
        <div className="flex justify-center mb-4">
          <img
            src={user.avatar}
            className="w-24 h-24 rounded-full border-2 border-red-600 object-cover"
            onError={(e) => (e.target.src = "/default-avatar.png")}
          />
        </div>

        {/* ID */}
        <label className="text-gray-300 text-sm">ID</label>
        <input
          type="text"
          value={user._id}
          disabled
          className="w-full p-3 rounded bg-gray-700 text-gray-400 cursor-not-allowed mb-4"
        />

        {/* Nombre */}
        <label className="text-gray-300 text-sm">Nombre</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white mb-4"
        />

        {/* Apellido */}
        <label className="text-gray-300 text-sm">Apellido</label>
        <input
          type="text"
          name="apellido"
          value={user.apellido}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white mb-4"
        />

        {/* Correo */}
        <label className="text-gray-300 text-sm">Correo</label>
        <input
          type="email"
          name="correo"
          value={user.correo}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white mb-4"
        />

        {/* Roles */}
        <label className="text-gray-300 text-sm">Rol</label>
        <select
          name="role"
          value={user.role}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white mb-4"
        >
          <option disabled value="">
            Seleccione un rol
          </option>

          {roles.map((r) => (
            <option key={r._id} value={r._id}>
              {r.name}
            </option>
          ))}
        </select>

        {/* Estado */}
        <label className="text-gray-300 text-sm">Estado</label>
        <select
          name="estado"
          value={user.estado}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white mb-4"
        >
          <option value={1}>Activo</option>
          <option value={0}>Inactivo</option>
        </select>

        {/* Avatar */}
        <label className="text-gray-300 text-sm">Avatar (URL)</label>
        <input
          type="text"
          name="avatar"
          value={user.avatar}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white mb-4"
        />

        {/* BOTONES */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={guardarCambios}
            className="bg-red-600 hover:bg-red-700 w-1/2 p-3 rounded-lg text-lg font-semibold transition"
          >
            Guardar Cambios
          </button>

          <button
            onClick={() => navigate("/gestion-usuarios")}
            className="bg-gray-600 hover:bg-gray-700 w-1/2 p-3 rounded-lg text-lg font-semibold transition"
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
};

export default DetailPerfilAdmin;
