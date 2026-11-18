/*
 * Login y roles (solo del lado del front).
 *
 * El back no tiene un endpoint de login y no devuelve las contraseñas de los empleados,
 * asi que para la demo los usuarios se definen aca. Es una SIMULACION: cualquiera que lea
 * este archivo ve las contraseñas. En un sistema real el back valida usuario y contraseña
 * (POST /api/auth/login) y devuelve un token; el front solo guarda ese token.
 *
 * Roles (los mismos del enum RolEmpleado del back):
 *   - ADMIN:    ve todas las pantallas, incluida Empleados.
 *   - EMPLEADO: ve todo menos Empleados.
 */

export const USUARIOS_DEMO = [
  { usuario: "admin", password: "admin123", nombre: "Administrador", rol: "ADMIN" },
  { usuario: "empleado", password: "empleado123", nombre: "Empleado", rol: "EMPLEADO" },
];

const CLAVE = "sesion";

/**
 * Busca el usuario y compara la contraseña. Si coinciden devuelve la sesion
 * ({ usuario, nombre, rol }, sin la contraseña) y la guarda; si no, lanza un Error.
 */
export function iniciarSesion(usuario, password) {
  const encontrado = USUARIOS_DEMO.find((u) => u.usuario === usuario.trim() && u.password === password);
  if (!encontrado) throw new Error("Usuario o contraseña incorrectos.");
  const sesion = { usuario: encontrado.usuario, nombre: encontrado.nombre, rol: encontrado.rol };
  // sessionStorage: la sesion sobrevive a recargar la pagina, pero se borra al cerrar la pestaña.
  try {
    sessionStorage.setItem(CLAVE, JSON.stringify(sesion));
  } catch {
    // si el navegador no deja guardar, la sesion dura hasta recargar
  }
  return sesion;
}

/** Sesion guardada, o null si nadie inicio sesion. */
export function obtenerSesion() {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE));
  } catch {
    return null;
  }
}

export function cerrarSesion() {
  try {
    sessionStorage.removeItem(CLAVE);
  } catch {
    // nada que borrar
  }
}

/** true si la sesion tiene alguno de los roles pedidos (sin lista de roles, alcanza con estar logueado). */
export function tienePermiso(sesion, roles) {
  if (!sesion) return false;
  return !roles || roles.includes(sesion.rol);
}
