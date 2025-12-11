import { useEffect, useState, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import { useAuth } from "../../contexts/AuthContext"
import { API_IDMOVIES } from "../../services/api"
import "react-toastify/dist/ReactToastify.css"
import { set } from "react-hook-form"

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(false)

  const { user, updateUserFavoritos } = useAuth()
  const navigate = useNavigate()
  // 🛑 OBTENER TOKEN
  const token = user?.token;
  // 1) Cargar película
  useEffect(() => {
    const loadMovie = async () => {
      // ✅ VERIFICAR TOKEN ANTES DE LLAMAR
      if (!token) {
        toast.error("Debes iniciar sesión para ver los detalles.");
        // Opcionalmente: navigate('/iniciar-sesion');
        setLoading(false);
        return;
      }

      // ✅ CONFIGURACIÓN DEL TOKEN
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      try {
        setLoading(true);
        // ✅ PASAR LA CONFIGURACIÓN DEL TOKEN
        const res = await axios.get(`${API_IDMOVIES}/${id}`, config)

        // 🛑 CORRECCIÓN CLAVE: Acceder a la propiedad 'pelicula' si el backend la devuelve así
        setMovie(res.data.pelicula || res.data) // Intenta con .pelicula, si no, usa res.data

      } catch (err) {
        console.error("Error al cargar detalles de la película:", err)
        // Revisar si fue un 404/401
        if (err.response?.status === 404) {
          toast.error("Película no encontrada.");
        } else if (err.response?.status === 401) {
          toast.error("Sesión expirada o no autorizada.");
          navigate('/iniciar-sesion');
        } else {
          toast.error("Error al obtener la película. Volviendo a inicio.");
        }
        navigate("/") // Redirige al fallo
      } finally {
        setLoading(false)
      }
    };

    if (id) { // Solo si el ID existe en la URL
      loadMovie();
    }
  }, [id, token, navigate]) // ✅ Depender también del token

  // 2) Saber si está en favoritos
  const estaEnFavoritos = useMemo(() => {
    if (!user || !Array.isArray(user.favoritos) || !movie) return false
    return user.favoritos.some((f) => String(f.id) === String(movie.id))
  }, [user, movie])

  // 3) Agregar a favoritos
  const agregarFavorito = async () => {
    if (!user) return toast.error("Debes iniciar sesión")

    try {
      const lista = Array.isArray(user.favoritos) ? user.favoritos : []

      if (lista.some((f) => String(f.id) === String(movie.id))) {
        toast.info("Ya está en favoritos")
        return
      }

      const nuevoFav = {
        id: String(movie.id),
        title: movie.original_title,
        poster: movie.poster,
      };

      await updateUserFavoritos([...lista, nuevoFav])

      toast.success("Película agregada a favoritos ❤️")
    } catch {
      toast.error("Error al agregar favorito")
    }
  }

  // 4) Eliminar de favoritos
  const eliminarFavorito = async () => {
    if (!user) return toast.error("Debes iniciar sesión");

    try {
      const nuevosFav = user.favoritos.filter(
        (f) => String(f.id) !== String(movie.id)
      )

      await updateUserFavoritos(nuevosFav);

      toast.info("Película eliminada de favoritos ❌")
    } catch {
      toast.error("Error al eliminar favorito")
    }
  };

  // 5) Estado cargando / no encontrada
  if (loading) return <p className="text-white p-10">Cargando...</p>
  if (!movie) return <p className="text-white p-10">No se encontró la película.</p>

  // 6) Limpiar y adaptar link de Youtube
  const toEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("embed")) return url;
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/")) return url.replace("youtu.be/", "www.youtube.com/embed/");
    return url
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <ToastContainer />

      <div
        className="absolute inset-0 bg-cover bg-center blur-xl opacity-40"
        style={{ backgroundImage: `url(${movie.poster})` }}
      ></div>

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-8 bg-neutral-900/90 p-6 rounded-2xl">

          {/* POSTER */}
          <div className="md:w-1/3 flex justify-center">
            <img
              src={movie.poster}
              alt={movie.original_title}
              className="w-full rounded-xl shadow-lg"
            />
          </div>

          {/* INFO */}
          <div className="md:w-2/3 flex flex-col gap-5">
            <h1 className="text-5xl font-bold">{movie.original_title}</h1>
            <p className="text-gray-300 text-lg">{movie.detalle}</p>

            <p><span className="text-gray-400">Género:</span> {movie.genero?.join(", ")}</p>
            <p><span className="text-gray-400">Director:</span> {movie.Director?.join(", ")}</p>
            <p><span className="text-gray-400">Actores:</span> {movie.actores?.join(", ")}</p>

            {/* FAVORITOS */}
            <div className="flex justify-center mt-2">
              {estaEnFavoritos ? (
                <button
                  onClick={eliminarFavorito}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
                >
                  <span className="text-xl">🗑️</span>
                  <span>Quitar de Favoritos</span>
                </button>
              ) : (
                <button
                  onClick={agregarFavorito}
                  className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-800 rounded-md"
                >
                  <span className="text-xl">❤️</span>
                  <span>Agregar a Favoritos</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* TRAILER */}
        <div className="mt-10 bg-neutral-900/90 p-6 rounded-2xl">
          <h2 className="text-xl mb-4">Ver trailer</h2>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden">
            <iframe
              src={toEmbedUrl(movie.link)}
              className="w-full h-full"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
