import { useEffect, useState, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import { useAuth } from "../../contexts/AuthContext"
import { API_OBTENERIDMOVIEUSER } from "../../services/api"
import "react-toastify/dist/ReactToastify.css"

// 1. CONSTANTES PARA IMÁGENES (Igual que en Admin)
const API_BASEURL = import.meta.env.VITE_API_BASEURL;
const BASE_IMG_URL = `${API_BASEURL}/`;

// 2. HELPER PARA OBTENER URL ABSOLUTA (Igual que en Admin)
const getAbsoluteImageUrl = (path) => {
  if (!path || path === "") return null;
  if (path.startsWith('http')) return path;
  return `${BASE_IMG_URL}${encodeURI(path.startsWith('/') ? path.substring(1) : path)}`;
};

// 3. HELPER PARA OBTENER EL ID SEGURO (La clave para arreglar el error 400)
const getMovieId = (movie, paramsId) => {
    if (movie) {
        // Prioriza _id (Mongo), luego id, y si falla, usa el de la URL
        return String(movie._id || movie.id || paramsId);
    }
    return String(paramsId);
};

const MovieDetailUser = () => {
  const { id } = useParams(); // ID de la URL
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(false)

  const { user, updateUserFavoritos } = useAuth()
  const navigate = useNavigate()
  
  const token = user?.token;

  // 1) Cargar película
  useEffect(() => {
    const loadMovie = async () => {
      if (!token) {
        toast.error("Debes iniciar sesión para ver los detalles.");
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      try {
        setLoading(true);
        const res = await axios.get(`${API_OBTENERIDMOVIEUSER}/${id}`, config)
        setMovie(res.data.pelicula || res.data)
      } catch (err) {
        console.error("Error al cargar detalles:", err)
        if (err.response?.status === 404) {
          toast.error("Película no encontrada.");
        } else if (err.response?.status === 401) {
          toast.error("Sesión expirada.");
          navigate('/iniciar-sesion');
        } else {
          toast.error("Error al obtener la película.");
        }
      } finally {
        setLoading(false)
      }
    };

    if (id) { 
      loadMovie();
    }
  }, [id, token, navigate])

  // 2) Saber si está en favoritos
  const estaEnFavoritos = useMemo(() => {
    if (!user || !Array.isArray(user.favoritos) || !movie) return false;
    
    // USAMOS EL HELPER AQUÍ TAMBIÉN
    const currentId = getMovieId(movie, id);
    return user.favoritos.some((f) => String(f.id) === currentId)
  }, [user, movie, id])

  // 3) Agregar a favoritos
  const agregarFavorito = async () => {
    if (!user) return toast.error("Debes iniciar sesión")
    if (!movie) return toast.error("Espere a que cargue la película");

    try {
      const lista = Array.isArray(user.favoritos) ? user.favoritos : []
      
      // ✅ CORRECCIÓN 1: Obtener ID seguro
      const safeId = getMovieId(movie, id);

      if (lista.some((f) => String(f.id) === safeId)) {
        toast.info("Ya está en favoritos")
        return
      }

      // ✅ CORRECCIÓN 2: Crear el objeto correctamente con el ID seguro y Url Absoluta
      const nuevoFav = {
        id: safeId, // <--- ESTO ARREGLA EL ERROR 400
        title: movie.original_title || movie.title,
        poster: getAbsoluteImageUrl(movie.poster), // <--- ESTO ARREGLA IMÁGENES ROTAS
        detalle: movie.detalle || "Sin descripción"
      };

      await updateUserFavoritos([...lista, nuevoFav])

      toast.success("Película agregada a favoritos ❤️")
    } catch (error) {
      console.error("Error al agregar:", error);
      toast.error("Error al agregar favorito")
    }
  }

  // 4) Eliminar de favoritos
  const eliminarFavorito = async () => {
    if (!user) return toast.error("Debes iniciar sesión");

    try {
      // ✅ Usar ID seguro también para borrar
      const safeId = getMovieId(movie, id);

      const nuevosFav = user.favoritos.filter(
        (f) => String(f.id) !== safeId
      )

      await updateUserFavoritos(nuevosFav);

      toast.info("Película eliminada de favoritos ❌")
    } catch {
      toast.error("Error al eliminar favorito")
    }
  };

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

  // Preparamos la imagen de fondo y poster con la URL absoluta
  const posterUrl = getAbsoluteImageUrl(movie.poster);

  return (
    <div className="min-h-screen bg-black text-white relative">
      <ToastContainer />

      <div
        className="absolute inset-0 bg-cover bg-center blur-xl opacity-40"
        style={{ backgroundImage: `url(${posterUrl})` }}
      ></div>

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-8 bg-neutral-900/90 p-6 rounded-2xl">

          {/* POSTER */}
          <div className="md:w-1/3 flex justify-center">
            <img
              src={posterUrl}
              alt={movie.original_title}
              className="w-full rounded-xl shadow-lg object-cover"
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

export default MovieDetailUser;