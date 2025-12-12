import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { API_MOVIEEDIT, API_OBTENERIDMOVIE } from "../../services/api";

const UpdateMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [peli, setPeli] = useState(null);

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await axios.get(`${API_OBTENERIDMOVIE}/${id}`, config);

        // 👇 EL BACKEND DEVUELVE { pelicula: { ... } }
        const p = res.data.pelicula;

        setPeli({
          _id: p._id,
          original_title: p.original_title || "",
          detalle: p.detalle || "",
          actores: p.actores?.join(", ") || "",
          poster: p.poster || "",
          genero: p.genero?.join(", ") || "",
          Director: p.Director?.join(", ") || "",
          type: p.type?.join(", ") || "",
          link: p.link || "",
          anio: p.anio || "",
          estado: p.estado || "activo",
        });

      } catch (err) {
        console.log(err);
        toast.error("Error al cargar la película");
      }
    };

    cargarDatos();
  }, [id]);

  const validarCampos = () => {
    if (!peli.original_title.trim()) return "El título es obligatorio";
    if (!peli.detalle.trim()) return "El detalle es obligatorio";
    if (!peli.poster.trim()) return "El poster es obligatorio";
    return null;
  };

  const handleChange = (e) => {
    setPeli({
      ...peli,
      [e.target.name]: e.target.value,
    });
  };

  const guardarCambios = async () => {
    const msg = validarCampos();
    if (msg) return toast.error(msg);

    const confirm = await Swal.fire({
      title: "¿Está seguro?",
      text: "Va a modificar esta película.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e50914",
      cancelButtonColor: "#555",
      confirmButtonText: "Sí, modificar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      const updated = {
        original_title: peli.original_title,
        detalle: peli.detalle,
        actores: peli.actores.split(",").map((a) => a.trim()),
        poster: peli.poster,
        genero: peli.genero.split(",").map((g) => g.trim()),
        Director: peli.Director.split(",").map((d) => d.trim()),
        type: peli.type.split(",").map((t) => t.trim()),
        link: peli.link,
        anio: Number(peli.anio),
        estado: peli.estado,
      };

      await axios.put(`${API_MOVIEEDIT}/${id}`, updated, config);

      await Swal.fire({
        title: "Película actualizada ✔",
        text: "Los datos fueron modificados",
        icon: "success",
        confirmButtonColor: "#e50914",
      });

      navigate("/peliculas");

    } catch (error) {
      console.log(error);
      toast.error("Error al actualizar la película");
    }
  };

  if (!peli)
    return <p className="text-white text-center mt-10">Cargando película...</p>;

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 bg-black/90">
      <div className="bg-black/80 text-white p-8 rounded-xl shadow-xl w-full max-w-lg border border-red-700 relative">

        <Link
          to="/peliculas"
          className="absolute top-3 right-4 text-gray-400 hover:text-red-600 text-3xl"
        >
          &times;
        </Link>

        <h2 className="text-3xl font-bold text-center mb-6">Editar Película</h2>

        <div className="flex justify-center mb-4">
          <img
            src={peli.poster || "/default-poster.png"}
            className="w-32 h-44 rounded border-2 border-red-600 object-cover"
            onError={(e) => { e.target.src = "/default-poster.png"; }}
          />
        </div>

        {[
          ["original_title", "Título"],
          ["detalle", "Detalle"],
          ["actores", "Actores (coma)"],
          ["poster", "Poster (URL)"],
          ["genero", "Géneros (coma)"],
          ["Director", "Director(es)"],
          ["type", "Tipo(s)"],
          ["link", "Link Trailer"],
          ["anio", "Año"],
        ].map(([name, label]) => (
          <div key={name}>
            <label className="text-gray-300 text-sm">{label}</label>
            <input
              type="text"
              name={name}
              value={peli[name]}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-white mb-4"
            />
          </div>
        ))}

        <label className="text-gray-300 text-sm">Estado</label>
        <select
          name="estado"
          value={peli.estado}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white mb-4"
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>

        <div className="flex gap-4 mt-4">
          <button
            onClick={guardarCambios}
            className="bg-red-600 hover:bg-red-700 w-1/2 p-3 rounded-lg text-lg font-semibold transition"
          >
            Guardar Cambios
          </button>

          <button
            onClick={() => navigate("/peliculas")}
            className="bg-gray-600 hover:bg-gray-700 w-1/2 p-3 rounded-lg text-lg font-semibold transition"
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
};

export default UpdateMovie;
