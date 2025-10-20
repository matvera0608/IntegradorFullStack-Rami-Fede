import db from '../config/db.js';

export const insertOrder = async (IDUsuario, IDHabitacion, fechaPedido, estado) => {
  const [result] = await db.query(
    `INSERT INTO pedido (IDUsuario, IDHabitacion, fechaPedido, estado)
     VALUES (?, ?, ?, ?)`,
    [IDUsuario, IDHabitacion, fechaPedido, estado]
  );
  return result.insertId;
};

export const findOrdersByUser = async (IDUsuario) => {
  const [rows] = await db.query(
    `SELECT * FROM pedido WHERE IDUsuario = ? ORDER BY fechaPedido DESC`,
    [IDUsuario]
  );
  return rows;
};

export const findOrderById = async (id, IDUsuario) => {
  const [rows] = await db.query(
    `SELECT * FROM pedido WHERE ID = ? AND IDUsuario = ?`,
    [id, IDUsuario]
  );
  return rows[0] || null;
};

export const allOrders = async () => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.ID,
        p.fechaPedido,
        p.estado,
        p.IDUsuario,
        u.nombre AS nombreUsuario,
        p.IDHabitacion,
        h.numeroHabitacion AS numeroHabitacion
      FROM pedido p
      INNER JOIN usuario u ON p.IDUsuario = u.ID
      INNER JOIN habitacion_numero h ON p.IDHabitacion = h.idNumero
      ORDER BY p.fechaPedido DESC
    `);
    return rows;
  } catch (error) {
    console.error('❌ Error al obtener todos los pedidos:', error);
    throw error;
  }
};


// ⬇️ AGREGAR ESTE MÉTODO NUEVO
export const updateOrder = async (id, estado) => {
  try {
    const [result] = await db.query(
      `UPDATE pedido SET estado = ? WHERE ID = ?`,
      [estado, id]
    );
    return result;
  } catch (error) {
    console.error('❌ Error al actualizar pedido:', error);
    throw error;
  }
};