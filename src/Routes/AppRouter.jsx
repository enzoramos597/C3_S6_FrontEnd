import LayoutPrincipal from "../components/Layout/LayoutPrincipal"
import portada from '../assets/Inicio_portada.webp'
import { Route, Routes, Navigate } from 'react-router-dom'
import Main from "../components/PagesPrincipal/Main"
import IniciarSesion from "../components/PagesPrincipal/IniciarSesion";
import CuentaDeshabilitada from "../components/PagesPrincipal/CuentaDeshabilitada";
import RegisterFormUser from "../components/PagesPrincipal/RegisterFormUser";
import { useAuth } from "../contexts/AuthContext";
import LayoutAdmin from "../components/Layout/LayoutAdmin";
import DashboardAdmin from "../components/PagesAdmin/DashboardAdmin";
import PruebaUser from "../components/PagesUser/PruebaUser";
import PruebaAdmin from "../components/PagesAdmin/PruebaAdmin";
import ListaPelicula from "../components/PagesMovies/ListaPelicula";
import MovieDetail from "../components/PagesMovies/MovieDetail";

const AppRouter = () => {

    const {user} = useAuth();
    console.log("Usuario actual en AppRouter:", user?.role);
    const isAdmin = user && user.role === '69366436d9ae941a18015fc0';
    console.log(isAdmin)
    const isUser = user && user.role === '6936638cd9ae941a18015fbb'
    console.log(isUser)

  return (
    <div
      className="min-h-screen text-neutral-100 bg-black/50"
      style={{
        backgroundImage: `url(${portada})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Routes>
        {/* 🟢 RUTAS PÚBLICAS */}
        {!user && (
        <Route element={<LayoutPrincipal />}>
          <Route index element={<Main />} />
          <Route path="iniciar-sesion" element={<IniciarSesion/>} />
          <Route path="/cuenta-deshabilitada" element={<CuentaDeshabilitada/>} />
          <Route path="/registrar-usuario" element={<RegisterFormUser/>} />
        </Route>
        )}

        {/* 🛑 LÓGICA DE REDIRECCIÓN A DASHBOARD PRINCIPAL (Para evitar conflictos con path="*") */}
        {/* Si el usuario está logueado y accede a la raíz (/), lo enviamos a su dashboard */}
        {user && isAdmin && <Route path="/" element={<Navigate to="/admin" replace />} />}
        {user && isUser && <Route path="/" element={<Navigate to="/user" replace />} />}

        {/* 🔵 RUTAS USUARIO */}
        {isUser && (
          <Route path="/user" element={<LayoutUser />}>     
            
            {/*<Route index element= {<PruebaUser />} />*/}
            <Route path="*" element={<Navigate to="/user" replace />} />
          </Route>
        )}
         {/* 🔴 RUTAS ADMIN */}
        {isAdmin && (
          <Route path="/admin" element={<LayoutAdmin />}>
            <Route index element={<DashboardAdmin />} />
            <Route path="peliculas" element= {<ListaPelicula />} />
            <Route path="peliculas/:id" element={<MovieDetail />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
            {/*<Route index element= {<PruebaAdmin />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />*/}
          </Route>
        )}
         {/* ❌ CUALQUIER OTRO CAMINO → HOME */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default AppRouter;
