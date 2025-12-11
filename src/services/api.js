// services/api.js 

// Si VITE_API_BASEURL = https://c3s6backend-production.up.railway.app
// y necesitas /api en todas tus llamadas, esta es la forma correcta:

export const API_REGISTERUSER = `${import.meta.env.VITE_API_BASEURL}/api/agregarUsuario`;
export const API_LOGIN = `${import.meta.env.VITE_API_BASEURL}/api/auth/login`;

// 💡 Endpoint para OBTENER TODOS los usuarios
export const API_USERS = `${import.meta.env.VITE_API_BASEURL}/api/mostrarUsuarios`; 

export const API_MOVIES = `${import.meta.env.VITE_API_BASEURL}/api/mostrarPelicula`;
export const API_IDMOVIES = `${import.meta.env.VITE_API_BASEURL}/api/peliculas`;
export const API_USER_CRUD = `${import.meta.env.VITE_API_BASEURL}/api/modificarUsuario`;