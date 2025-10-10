import db from '../config/db.js';

// Traer todo el catálogo
export const AllBuffet = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM buffet');
        return rows;
    } catch (error) {
        console.error("Error al obtener todo el catálogo:", error);
        throw error;
    }
};

// Traer un item del catálogo por ID
export const obtenerBuffetByID = async (id) => {
    try {
        const [rows] = await db.query('SELECT * FROM buffet WHERE ID = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error(`Error al obtener el item del catálogo con ID ${id}:`, error);
        throw error;
    }
};

// Crear un nuevo item del catálogo
export const crearBuffet = async ({ nombre, descripcion, categoria, disponibilidad, precio }) => {
    try {
        const [result] = await db.query(
            'INSERT INTO buffet (nombre, descripcion, categoria, disponibilidad, precio) VALUES (?, ?, ?, ?, ?)',
            [nombre, descripcion, categoria, disponibilidad, precio]
        );
        return result.insertId;
    } catch (error) {
        console.error("Error al crear un item del catálogo:", error);
        throw error;
    }
};

// Actualizar un item del catálogo
export const actualizarBuffet = async (id, { nombre, descripcion, categoria, disponibilidad, precio }) => {
    try {
        const [result] = await db.query(
            'UPDATE buffet SET nombre = ?, descripcion = ?, categoria = ?, disponibilidad = ?, precio = ? WHERE ID = ?',
            [nombre, descripcion, categoria, disponibilidad, precio, id]
        );
        return result.affectedRows;
    } catch (error) {
        console.error(`Error al actualizar el item del catálogo con ID ${id}:`, error);
        throw error;
    }
};

// Eliminar un item del catálogo
export const eliminarBuffet = async (id) => {
    try {
        const [result] = await db.query('DELETE FROM buffet WHERE ID = ?', [id]);
        return result.affectedRows;
    } catch (error) {
        console.error(`Error al eliminar el item del catálogo con ID ${id}:`, error);
        throw error;
    }
};
