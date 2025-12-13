// services/api.js 

// 💡 Endpoint para LOGIN
export const API_LOGIN = `${import.meta.env.VITE_API_BASEURL}/api/auth/login`

// 💡 Endpoint para OBTENER TODOS los usuarios
export const API_USERS = `${import.meta.env.VITE_API_BASEURL}/api/mostrarUsuarios`;
export const API_USERSINTOKEN = `${import.meta.env.VITE_API_BASEURL}/api/recorrerUsuariosintoken`
export const API_REGISTERUSER = `${import.meta.env.VITE_API_BASEURL}/api/agregarUsuario`
export const API_USER_CRUD = `${import.meta.env.VITE_API_BASEURL}/api/modificarUsuario`
export const API_USER_MODIFICARUNUSUARIO = `${import.meta.env.VITE_API_BASEURL}/api/modificarUsuarioUser` 
export const API_USERID = `${import.meta.env.VITE_API_BASEURL}/api/usuarioadmin`
export const API_TRAERUNUSUARIO = `${import.meta.env.VITE_API_BASEURL}/api/traerunusuario`
//Endpoint para Obtener Peliculas
export const API_MOVIEEDIT = `${import.meta.env.VITE_API_BASEURL}/api/modificarPelicula`
export const API_MOVIES = `${import.meta.env.VITE_API_BASEURL}/api/mostrarPelicula`
export const API_OBTENERIDMOVIE = `${import.meta.env.VITE_API_BASEURL}/api/peliculas`
export const API_OBTENERIDMOVIEUSER = `${import.meta.env.VITE_API_BASEURL}/api/peliculasuser`
export const API_IDMOVIES = `${import.meta.env.VITE_API_BASEURL}/api/peliculas`

export const API_AGREGARPELICULA = `${import.meta.env.VITE_API_BASEURL}/api/agregarPelicula`

//Perfiles
export const API_PERFILES = `${import.meta.env.VITE_API_BASEURL}/api/usuario`

//Roles
export const API_SHOW_ROLES = `${import.meta.env.VITE_API_BASEURL}/api/mostrarRoles`

