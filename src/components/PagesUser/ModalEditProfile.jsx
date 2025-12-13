import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { toast } from "react-toastify"
import { useAuth } from "../../contexts/AuthContext"

// Importaciones de Avatares (Mantengo tus rutas)
//import doug from "../../assets/avatars/Doug.jpg";
//import starwars from "../../assets/avatars/starwars.jpeg";
//import starwars2 from "../../assets/avatars/starwars2.webp";
//import starwars3 from "../../assets/avatars/starwars3.webp";
import doug from "../../../public/avatars/Doug.jpg"
import starwars from "../../../public/avatars/starwars.jpeg"
import starwars2 from "../../../public/avatars/starwars2.webp"
import starwars3 from "../../../public/avatars/starwars3.webp"

const avatars = [doug, starwars, starwars2, starwars3]

// El prop onClose ahora acepta un booleano (didSave)
const ModalEditProfile = ({ isOpen, onClose, profile }) => {
  // Desestructuramos el usuario y la función de actualización del perfil
  const { user, updateUserProfile } = useAuth()

  const [name, setName] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState("")

  // 1. Cargar datos del perfil al abrir el modal o cambiar de perfil
  useEffect(() => {
    if (!profile) return;

    const t = setTimeout(() => {
      setName(profile.name);
      setSelectedAvatar(profile.avatar);
    }, 0);

    return () => clearTimeout(t)
  }, [profile]);

  if (!isOpen) return null;

  // 💾 GUARDAR CAMBIOS
  const handleSave = async () => {
    try {
      const trimmedName = name.trim()
      const currentProfileId = profile.id// ID del perfil que estamos editando

      // ❗ 1. VALIDAR NOMBRE VACÍO
      if (trimmedName.length === 0) {
        toast.error("El nombre no puede estar vacío.");
        return;
      }

      // ❗ 2. VALIDAR NOMBRE REPETIDO (Comparando con todos los demás perfiles)
      const nombreExiste = user.perfiles.some(
        (p) => {
          const pId = p.id || p._id; // Usamos el ID de la lista de perfiles, puede ser 'id' o '_id'

          // Comprueba si el nombre es igual Y si el ID es diferente
          return (
            String(p.name || '').trim().toLowerCase() === trimmedName.toLowerCase() &&
            pId !== currentProfileId
          );
        }
      );

      if (nombreExiste) {
        await Swal.fire({
          title: "Nombre repetido",
          text: `Ya existe otro perfil llamado "${trimmedName}".`,
          icon: "error",
          confirmButtonText: "Entendido",
          background: "#1f1f1f",
          color: "white",
        })
        return
      }

      // ❗ 3. VALIDAR CAMBIOS
      const originalNameTrimmed = String(profile.name || '').trim()
      if (trimmedName === originalNameTrimmed && selectedAvatar === profile.avatar) {
        toast.info("No se han detectado cambios.")
        onClose(false) // No hubo cambios, cerramos sin recargar.
        return
      }

      // 4. Confirmación de guardado
      const confirm = await Swal.fire({
        title: "¿Guardar cambios del perfil?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        background: "#1f1f1f",
        color: "white",
      });

      if (confirm.isDismissed) {
        toast.info("Edición cancelada")
        // Si cancela, cerramos sin indicar guardado
        onClose(false)
        return
      }

      // 5. Llamada a la función del contexto (Guardar)
      await updateUserProfile(currentProfileId, {
        name: trimmedName,
        avatar: selectedAvatar,
      })

      // 6. Feedback y cierre (SOLO si no hay error y se confirma)
      toast.success("Perfil actualizado correctamente")

      // 🛑 CLAVE: Cerramos y pasamos TRUE para indicar que se debe recargar la lista
      onClose(true)

    } catch (error) {
      console.error("Error al guardar el perfil:", error.response?.data || error)
      toast.error(error.response?.data?.mensaje || "Error al actualizar el perfil. Intenta de nuevo.")
      // Si hay error, cerramos sin indicar guardado
      onClose(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50"
      // 🛑 CLAVE: Al hacer clic fuera, cerramos sin indicar guardado (false)
      onClick={() => onClose(false)}
    >
      <div
        className="bg-neutral-900 p-6 rounded-xl shadow-xl w-[90%] max-w-md text-white relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* BOTÓN CERRAR */}
        <button
          className="absolute right-4 top-4 text-gray-300 hover:text-red-500 text-xl"
          onClick={() => onClose(false)}
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Editar Perfil</h2>

        {/* INPUT NOMBRE */}
        <input
          type="text"
          value={name}
          placeholder="Nombre del perfil"
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded bg-neutral-700 mb-4 focus:outline-none focus:ring-2 focus:ring-red-600"
        />

        {/* AVATARES */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          {avatars.map((avatar, i) => (
            <img
              key={i}
              src={avatar}
              onClick={() => setSelectedAvatar(avatar)}
              className={`w-16 h-16 rounded-full cursor-pointer object-cover border-4 transition 
 ${selectedAvatar === avatar
                  ? "border-red-600 scale-105"
                  : "border-transparent"
                }
 `}
            />
          ))}
        </div>

        {/* BOTONES */}
        <div className="flex mt-4 justify-center ">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 font-semibold hover:bg-blue-700 rounded mr-4 transition"
          >
            Guardar
          </button>

          <button
            // 🛑 CLAVE: Al cancelar, cerramos sin indicar guardado (false)
            onClick={() => onClose(false)}
            className="px-4 py-2 bg-gray-600 font-semibold hover:bg-gray-700 rounded transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditProfile;