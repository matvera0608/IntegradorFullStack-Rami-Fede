// models/orders.model.js
import db from '../config/db.js';

// Crear pedido
export const insertOrder = async (IDUsuario, IDHabitacion, fechaPedido, estado) => {
    try {
        const [result] = await db.query(
            `INSERT INTO pedidos_buffet (IDUsuario, IDHabitacion, fechaPedido, estado) VALUES (?, ?, ?, ?)`,
            [IDUsuario, IDHabitacion, fechaPedido, estado]
        );
        return result.insertId;
    } catch (error) {
        console.error(`Error al crear pedido para usuario ${IDUsuario}:`, error);
        throw error;
    }
};

// Listar pedidos de un usuario
export const findOrdersByUser = async (IDUsuario) => {
    try {
        const [rows] = await db.query(
            `SELECT * FROM pedidos_buffet WHERE IDUsuario = ? ORDER BY fechaPedido DESC`,
            [IDUsuario]
        );
        return rows;
    } catch (error) {
        console.error(`Error al obtener pedidos del usuario ${IDUsuario}:`, error);
        throw error;
    }
};

// Obtener un pedido por ID (para ver estado)
export const findOrderById = async (id, IDUsuario) => {
    try {
        const [rows] = await db.query(
            `SELECT * FROM pedidos_buffet WHERE ID = ? AND IDUsuario = ?`,
            [id, IDUsuario]
        );
        return rows[0] || null;
    } catch (error) {
        console.error(`Error al obtener pedido con ID ${id} del usuario ${IDUsuario}:`, error);
        throw error;
    }
};
