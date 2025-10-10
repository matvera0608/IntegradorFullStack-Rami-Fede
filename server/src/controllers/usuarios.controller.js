import { findUsuarioById } from '../models/usuarios.model.js';
import { allUsuario } from '../models/usuarios.model.js';
import { updateUsuario } from '../models/usuarios.model.js';
import { deleteUsuario } from '../models/usuarios.model.js';

// Obtener todos los usuarios (solo admin o propósitos específicos)
export const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await allUsuario();
    res.json({
      mensaje: "Todos los usuarios",
      data: usuarios
    });
  } catch (error) {
    console.error('Error en getAllUsuarios:', error);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
};

// Obtener el usuario logueado
export const getUsuarioById = async (req, res) => {
  try {
    const id = req.user.id; // Extraer el ID del req es posible gracias al middleware
    const usuario = await findUsuarioById(id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error en getUsuarioById:', error);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
};

// Actualizar el usuario logueado
export const actualizarUsuario = async (req, res) => {
  try {
    const id_usuario = req.user.id; // del middleware
    const { nombre, correo, telefono, contrasena } = req.body;

    const result = await updateUsuario(id_usuario, nombre, correo, telefono, contrasena);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado para actualizar." });
    }

    res.json({ mensaje: "Datos del Usuario actualizados correctamente." });
  } catch (error) {
    console.error("Error al actualizar el Usuario:", error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

// Eliminar el usuario logueado
export const eliminarUsuario = async (req, res) => {
  try {
    const id = req.user.id; // del middleware
    const result = await deleteUsuario(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar Usuario:', error);
    res.status(500).json({ mensaje: 'Error al eliminar el Usuario' });
  }
};
