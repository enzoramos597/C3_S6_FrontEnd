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
import UploadMovie from "../components/PagesMovies/UploadMovie";
import ProfileSelectorAdmin from "../components/PagesAdmin/ProfileSelectorAdmin";
import DetailPerfilAdmin from "../components/PagesAdmin/DetailPerfilAdmin";
import UpdateMovie from "../components/PagesMovies/UpdateMovie";
import ProfileSelectorUser from "../components/PagesUser/ProfileSelectorUser";
import LayoutUser from "../components/Layout/LayoutUser";
import CreateProfileUser from "../components/PagesUser/CreateProfileUser";
import MovieDetailUser from "../components/PagesMovies/MovieDetailUser";
import ManageProfilesUser from "../components/PagesUser/ManageProfilesUser";
import EditProfileUser from "../components/PagesUser/EditProfileUser";
import RegisterFormAdmin from "../components/PagesPrincipal/RegisterFormAdmin";
const AppRouter = () => {

     const {user} = useAuth();
    
    console.log("Usuario en AppRouter:", user);
    console.log("Role del usuario:", user?.role);
    
    // ✅ COMPARAR CON EL ROLE ID (STRING)
    const isAdmin = user && user.role === '69366436d9ae941a18015fc0';
    const isUser = user && user.role === '6936638cd9ae941a18015fbb';
    
    console.log("Es Admin?", isAdmin);
    console.log("Es User?", isUser);

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
          <Route path="/registrar-admin" element={<RegisterFormAdmin/>} />
        </Route>
        )}

        {/* 🛑 LÓGICA DE REDIRECCIÓN A DASHBOARD PRINCIPAL (Para evitar conflictos con path="*") */}
        {/* Si el usuario está logueado y accede a la raíz (/), lo enviamos a su dashboard */}
        {user && isAdmin && <Route path="/" element={<Navigate to="/admin" replace />} />}
        {user && isUser && <Route path="/" element={<Navigate to="/user" replace />} />}

        {/* 🔵 RUTAS USUARIO */}
        {isUser && (
          <Route path="/user" element={<LayoutUser />}>            
            <Route index element= {<ProfileSelectorUser />} />  
            <Route path="peliculas" element= {<ListaPelicula />} />
            <Route path="peliculas/:id" element={< MovieDetailUser />} />
            <Route path="createperfiluser" element={<CreateProfileUser />} />    
            <Route path="manageprofiles" element={<ManageProfilesUser />} /> 
            <Route path="edit-profile/:id" element={<EditProfileUser />} />   
          </Route>
        )}
         {/* 🔴 RUTAS ADMIN */}
        {isAdmin && (
          <Route path="/admin" element={<LayoutAdmin />}>
            <Route index element={<DashboardAdmin />} />
            <Route path="peliculas" element= {<ListaPelicula />} />
            <Route path="peliculas/:id" element={<MovieDetail />} />
            <Route path="uploadmovie" element={<UploadMovie />} />
            <Route path="updatemovie/:id" element={<UpdateMovie />} />
            <Route path="gestion-usuarios" element={<ProfileSelectorAdmin/>} />
            <Route path='gestion-usuarios/usuarios/:id' element={<DetailPerfilAdmin />}/>
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
