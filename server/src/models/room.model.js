import db from '../config/db.js';

// Traer todas las habitaciones
export const AllRooms = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM habitacion');
        return rows;
    } catch (error) {
        console.error("Error al obtener todas las habitaciones:", error);
        throw error;
    }
};

// Traer una habitación por su ID
export const obtenerRoomByID = async (id) => {
    try {
        const [rows] = await db.query('SELECT * FROM habitacion WHERE id = ?', [id]);
        return rows[0] || null; // Retorna null si no existe
    } catch (error) {
        console.error(`Error al obtener la habitación con ID ${id}:`, error);
        throw error;
    }
};

