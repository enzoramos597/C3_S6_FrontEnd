import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import cargarpelicula from "../../assets/CargarPelicula.jpg"
import verpeliculas from "../../assets/verpeliculas.jpg"
import gestionusuarios from "../../assets/gestiondeusuarios.png"

export default function DashboardAdmin() {
  return (
    <div className="min-h-[82vh] bg-black/80 text-white p-8">
      {/* HEADER ESTILO NETFLIX */}
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold tracking-wide text-red-600 mt-10">PELIFLIX ADMIN</h1>
        
      </header>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {/* CARD 1 */}
        <div          
          className="relative h-60 rounded-2xl overflow-hidden cursor-pointer group bg-gray-900 hover:scale-105"
        >
          <Link to="/uploadmovie" className="w-full h-full block">
            <img
              src={cargarpelicula}
              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent flex items-end p-4">
              <p className="text-2xl font-bold">Cargar Película</p>
            </div>
          </Link>
        </div>

        {/* CARD 2 */}
        <div
          //whileHover={{ scale: 1.05 }}
          className="relative h-60 rounded-2xl overflow-hidden cursor-pointer group bg-gray-900 hover:scale-105"
        >
          <Link to="peliculas" className="w-full h-full block">
            <img
              src={verpeliculas}
              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent flex items-end p-4">
              <p className="text-2xl font-bold">Ver Películas</p>
            </div>
          </Link>
        </div>

        {/* CARD 3 */}
        <div
          //whileHover={{ scale: 1.05 }}
          className="relative h-60 rounded-2xl overflow-hidden cursor-pointer group bg-gray-900 hover:scale-105"
        >
          <Link to="/gestion-usuarios" className="w-full h-full block">
            <img
              src={gestionusuarios}
              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent flex items-end p-4">
              <p className="text-2xl font-bold">Gestión de Usuarios</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
