// MovieDetail.jsx
import { useEffect, useState, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import { useAuth } from "../../contexts/AuthContext"
import { API_IDMOVIES } from "../../services/api"
import "react-toastify/dist/ReactToastify.css"

// 🛑 CORRECCIÓN: Definimos las constantes para construir la URL absoluta antes de guardar.
const API_BASEURL = import.meta.env.VITE_API_BASEURL;
// Aseguramos que la URL base termine en barra
const BASE_IMG_URL = `${API_BASEURL}/`;

// Helper para obtener el ID real de la película, manejando _id, id, o el param
const getMovieId = (movie, paramsId) => {
    if (movie) {
        // Asegura que el ID sea un string, priorizando _id (Mongo), luego id, y finalmente el de la URL
        return String(movie._id || movie.id || paramsId);
    }
    return String(paramsId);
};

// 🛑 FUNCIÓN CORREGIDA: Construye la URL de la imagen completa
const getAbsoluteImageUrl = (path) => {
    if (!path || path === "") return null;
    // Si ya es una URL absoluta, la devuelve como está
    if (path.startsWith('http')) return path;

    // Si es una ruta relativa, le anteponemos la URL base de tu servidor.
    // Usamos encodeURI para manejar posibles espacios o caracteres especiales en la ruta.
    return `${BASE_IMG_URL}${encodeURI(path.startsWith('/') ? path.substring(1) : path)}`;
};

// 🛑 CONSTANTE: Definimos el límite máximo de favoritos
const MAX_FAVORITOS = 5;

const MovieDetail = () => {
    const { id: paramId } = useParams();
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
                const res = await axios.get(`${API_IDMOVIES}/${paramId}`, config)
                setMovie(res.data.pelicula || res.data)

            } catch (err) {
                console.error("Error al cargar detalles de la película:", err)
                if (err.response?.status === 404) {
                    toast.error("Película no encontrada.");
                } else if (err.response?.status === 401) {
                    toast.error("Sesión expirada o no autorizada.");
                    navigate('/iniciar-sesion');
                } else {
                    toast.error("Error al obtener la película. Volviendo a inicio.");
                }
                navigate("/")
            } finally {
                setLoading(false)
            }
        };

        if (paramId) {
            loadMovie();
        }
    }, [paramId, token, navigate])

    // 2) Saber si está en favoritos
    const estaEnFavoritos = useMemo(() => {
        if (!user || !Array.isArray(user.favoritos) || !movie) return false
        const currentMovieId = getMovieId(movie, paramId);
        return user.favoritos.some((f) => String(f.id) === currentMovieId)
    }, [user, movie, paramId])

    // 3) Agregar a favoritos
    const agregarFavorito = async () => {
        if (!user) return toast.error("Debes iniciar sesión")
        if (!movie) return toast.error("Detalles de la película no cargados");

        try {
            const lista = Array.isArray(user.favoritos) ? user.favoritos : []
            const currentMovieId = getMovieId(movie, paramId);

            // Verificación 1: Límite de 5 películas
            if (lista.length >= MAX_FAVORITOS) {
                toast.warn(`Solo puedes tener hasta ${MAX_FAVORITOS} películas en favoritos.`);
                return;
            }

            // Verificación 2: Existencia
            if (lista.some((f) => String(f.id) === currentMovieId)) {
                toast.info("Ya está en favoritos")
                return
            }

            // ✅ CORRECCIÓN CLAVE: Aplicamos la función para obtener la URL absoluta
            const nuevoFav = {
                id: currentMovieId,
                title: String(movie.original_title || movie.title || 'Título Desconocido'),
                // 🛑 ¡AQUÍ ESTÁ EL CAMBIO! Guardamos la URL absoluta.
                poster: getAbsoluteImageUrl(movie.poster) || '',
                detalle: String(movie.detalle || 'Sin descripción disponible'),
            };

            await updateUserFavoritos([...lista, nuevoFav])

            toast.success("Película agregada a favoritos ❤️")
        } catch (error) {
            console.error("Error al agregar favorito:", error.response?.data || error);
            toast.error("Error al agregar favorito");
        }
    }

    // 4) Eliminar de favoritos
    const eliminarFavorito = async () => {
        if (!user) return toast.error("Debes iniciar sesión");

        try {
            const currentMovieId = getMovieId(movie, paramId);

            const nuevosFav = user.favoritos.filter(
                (f) => String(f.id) !== currentMovieId
            )

            await updateUserFavoritos(nuevosFav);

            toast.info("Película eliminada de favoritos ❌")
        } catch (error) {
            console.error("Error al eliminar favorito:", error.response?.data || error);
            toast.error("Error al eliminar favorito");
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