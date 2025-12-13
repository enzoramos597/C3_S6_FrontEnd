import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
//import { API_PELICULAS } from "../../services/api"
import { API_MOVIES } from "../../services/api"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const ListaPelicula = () => {
  const [peliculas, setPeliculas] = useState([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user && user.role === '69366436d9ae941a18015fc0'
  const token = user?.token
  //console.log('Token en Peliculas', token)
  //const isAdmin = user?.type === "Administrador"

  const moviesPerPage = 12
  const toastShownRef = useRef(false)

  // 🟢 Cargar películas
  useEffect(() => {
    const fetchPeliculas = async () => {
      // 🚨 Verificar si el token existe antes de hacer la solicitud
      if (!token) {
        console.error("No hay token de usuario disponible.")
        return
      }

      // ✅ Agregar el encabezado de autorización a la solicitud
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      try {
        const res = await axios.get(API_MOVIES, config)

        // 🛑 CORRECCIÓN: Acceder a la propiedad 'peliculas' de res.data, que es el array
        const listaDePeliculas = res.data.peliculas || [] // Usamos [] como fallback por seguridad

        const activas = listaDePeliculas.filter( // <-- Filtramos el array, no el objeto
          (p) => p.estado?.toLowerCase() === "activo"
        );
        setPeliculas(activas)

      } catch (error) {
        // Manejo de errores específico (ej: si el token expiró)
        console.error("Error al cargar películas:", error)
        if (error.response && error.response.status === 401) {
          toast.error("Tu sesión expiró. Por favor, vuelve a iniciar sesión. 🔒")
          navigate('/iniciar-sesion') // Redirigir si el token es inválido/expirado
        }
      }
    }

    // Llamar a la función solo si hay un token
    fetchPeliculas()
    // El useEffect debe depender del token y del navigate si lo usas
  }, [token, navigate])

  // 🔍 Filtro de búsqueda
  const filteredMovies = peliculas.filter((peli) => {
    const texto = search.toLowerCase();
    return (
      peli.original_title?.toLowerCase().includes(texto) ||
      peli.actores?.join(" ").toLowerCase().includes(texto) || // Nota: Corregí "Actores" a "actores" (minúscula) si quieres mantener la consistencia con la respuesta del backend
      peli.genero?.join(" ").toLowerCase().includes(texto) ||
      peli.Director?.join(" ").toLowerCase().includes(texto)
    )
  })

  // ⚠ Toast cuando no encuentra resultados
  useEffect(() => {
    if (search.trim() !== "" && filteredMovies.length === 0) {
      if (!toastShownRef.current) {
        toast.error("❌ No se encontró la película que estabas buscando.", {
          position: "top-right",
          autoClose: 2000,
        });
        toastShownRef.current = true
      }
    } else {
      toastShownRef.current = false
    }
  }, [search, filteredMovies.length])

  const totalPages =
    filteredMovies.length === 0
      ? 1
      : Math.ceil(filteredMovies.length / moviesPerPage)

  const startIndex = (page - 1) * moviesPerPage
  const currentMovies = filteredMovies.slice(
    startIndex,
    startIndex + moviesPerPage
  );
  const noResults = filteredMovies.length === 0;

  return (
    <div className="min-h-screen bg-black/60 backdrop-blur-sm p-8 ">
      <ToastContainer />

      <h2 className="text-3xl font-bold mb-4 text-white text-center drop-shadow-lg">
        ¿Qué Películas te gustaría ver?
      </h2>

      {/* Buscador */}
      <div className="max-w-xl mx-auto mb-6 mt-5">
        <input
          type="text"
          placeholder="Buscar películas..."
          value={search}
          onChange={(e) => {
            setPage(1)
            setSearch(e.target.value)
          }}
          className="w-full p-3 rounded-lg bg-neutral-900 text-white border border-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 mt-2 mb-4"
        />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
        {currentMovies.map((peli) => {
          // Usamos peli.anio del objeto
          const year = peli.anio || "-";

          return (
            <div
              key={peli._id} // Usamos _id, ya que no vimos un campo 'id' en la respuesta del backend
              className="relative rounded-lg cursor-pointer hover:scale-105 transition shadow-xl"
            >
              <div
                onClick={() => navigate(`/admin/peliculas/${peli._id}`)} // Usamos _id para la navegación
                className="relative group overflow-hidden rounded-lg flex justify-center items-center"
              >
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                  {year}
                </span>

                <img
                  src={peli.poster}
                  alt={peli.original_title}
                  className="w-64 h-64 object-contain rounded-lg"
                />

                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition flex flex-col justify-center items-center p-3">
                  <h3 className="text-lg font-bold text-white text-center drop-shadow-lg">
                    {peli.original_title}
                  </h3>
                  <p className="text-sm mt-1 text-gray-300">
                    Director: {peli.Director?.join(", ") || "Sin información"}
                  </p>
                </div>
              </div>

              <div className="mt-2 px-1 text-center">
                <h3 className="text-white font-semibold truncate">
                  {peli.original_title}
                </h3>
                <p className="text-gray-400 text-sm truncate">
                  {peli.genero?.join(", ") || "Sin género"}
                </p>
              </div>

              {/* Botón solo Admin */}
              {isAdmin && (
                <button
                  onClick={() => navigate(`/admin/updatemovie/${peli._id}`)} // Usamos _id para la edición
                  className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs shadow-lg hover:bg-blue-500 transition"
                >
                  Editar
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Paginación */}
      <div className="flex justify-center gap-4 mt-6 text-white">
        <button
          disabled={page === 1 || noResults}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-red-600 rounded disabled:bg-gray-600"
        >
          ◀ Anterior
        </button>

        <span>
          Página {page} de {totalPages}
        </span>

        <button
          disabled={page === totalPages || noResults}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-red-600 rounded disabled:bg-gray-600"
        >
          Siguiente ▶
        </button>
      </div>
    </div>
  );
};

export default ListaPelicula;