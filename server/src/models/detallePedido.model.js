import db from '../config/db.js';
/*Table: detallepedido
Columns:
cantidad tinyint(4) 
subtotal decimal(4,2) 
IDPedido smallint(6) PK 
IDBuffet smallint(6) PK*/ 
// Crear un detalle de pedido (un item dentro de un pedido)
export const insertDetallePedido = async (IDPedido, IDBuffet, cantidad, subtotal) => {
  try {
    const [result] = await db.query(
      `INSERT INTO detallepedido (IDPedido, IDBuffet, cantidad, subtotal) VALUES (?, ?, ?, ?)`,
      [IDPedido, IDBuffet, cantidad, subtotal]
    );
    return result.insertId;
  } catch (error) {
    console.error(`Error al crear detalle de pedido para pedido ${IDPedido}:`, error);
    throw error;
  }
};

// Obtener todos los detalles de un pedido
export const findDetallesByPedido = async (IDPedido) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM detallepedido WHERE IDPedido = ?`,
      [IDPedido]
    );
    return rows;
  } catch (error) {
    console.error(`Error al obtener detalles del pedido ${IDPedido}:`, error);
    throw error;
  }
};
