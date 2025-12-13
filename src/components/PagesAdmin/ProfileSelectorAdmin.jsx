import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../contexts/AuthContext"
import { API_USERS } from "../../services/api"
import ProfileCardAdmin from "../PagesAdmin/ProfileCardAdmin"
import { useNavigate } from "react-router-dom"

const ProfileSelectorAdmin = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [usuarios, setUsuarios] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                if (!user?.token) {
                    console.error("❌ No hay token — no se puede obtener usuarios")
                    return
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }

                const res = await axios.get(API_USERS, config)

                // Asegurarse de que la respuesta es un array
                const lista =
                    Array.isArray(res.data.usuarios)
                        ? res.data.usuarios
                        : [];

                setUsuarios(lista);

            } catch (error) {
                console.error("❌ Error obteniendo usuarios:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUsuarios()
    }, [user])

    if (loading) return <p className="text-white text-center mt-10">Cargando usuarios...</p>

    return (
        <div className='min-h-screen flex flex-col items-center bg-black/90 text-white pt-20 pb-10'>
            <h1 className='text-4xl font-bold mb-6'>Usuarios del sistema</h1>

            <div className='flex flex-wrap justify-center gap-8 mx-10'>
                {usuarios.map((u) => (
                    <ProfileCardAdmin
                        key={u._id}
                        name={u.nombre || u.name || "Sin nombre"}
                        avatar={u.avatar || "/default-avatar.png"}
                        onClick={() => navigate(`/admin/gestion-usuarios/usuarios/${u._id}`)}
                    />
                ))}
            </div>

            <button
                onClick={() => navigate(`/`)}
                className='mt-8 px-6 py-2 font-semibold bg-red-700 hover:bg-red-500 text-white rounded-lg'
            >
                Home
            </button>
        </div>
    );
}

export default ProfileSelectorAdmin;
