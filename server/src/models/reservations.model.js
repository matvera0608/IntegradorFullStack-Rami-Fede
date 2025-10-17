import db from '../config/db.js';

// Crear una reserva
export const insertReservation = async (fechaIngreso, fechaEgreso, estado, IDUsuario, IDHabitacion, precio) => {
  try {
    const sql = `
      INSERT INTO reservas (fechaIngreso, fechaEgreso, estado, IDUsuario, IDHabitacion, precio)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [fechaIngreso, fechaEgreso, estado, IDUsuario, IDHabitacion, precio];
    console.log('Ejecutando SQL:', sql);
    console.log('Valores:', values);
    
    const [result] = await db.query(sql, values);
    return result;
  } catch (error) {
    console.error('Error en insertReservation:', error);
    throw error;
  }
};

// Obtener todas las reservas
export const getBookingId = async (IDUsuario) => {
  console.log(IDUsuario);
  try {
    const [rows] = await db.query('SELECT * FROM reservas WHERE IDUsuario = ?', [IDUsuario]);
    console.log(rows);
    return rows;
  } catch (error) {
    throw error;
  }
};


// Actualizar una reserva
export const updateReservationByIds = async (fechaIngreso, fechaEgreso, estado, IDUsuario, IDHabitacion) => {
  try {
    const sql = `
      UPDATE reservas
      SET fechaIngreso = ?, fechaEgreso = ?, estado = ?
      WHERE IDUsuario = ? AND IDHabitacion = ?
    `;
    const values = [fechaIngreso, fechaEgreso, estado, IDUsuario, IDHabitacion];
    const [result] = await db.query(sql, values);
    return result;
  } catch (error) {
    throw error;
  }
};

// Cancelar (eliminar) una reserva → cambiar estado a cancelado
export const cancelReservationByIds = async (IDUsuario, IDHabitacion) => {
  try {
    const sql = `
      UPDATE reservas
      SET estado = 'cancelado'
      WHERE IDUsuario = ? AND IDHabitacion = ?
    `;
    const [result] = await db.query(sql, [IDUsuario, IDHabitacion]);
    return result;
  } catch (error) {
    throw error;
  }
};

// Traer todas las reservas activas
export const getActiveReservations = async () => {
    try {
        const [rows] = await db.query(
            `SELECT 
                IDReserva as id,
                fechaIngreso,
                fechaEgreso,
                estado,
                IDUsuario,
                IDHabitacion,
                precio
             FROM reservas 
             WHERE estado = 'activo'
             AND fechaEgreso >= CURDATE()
             ORDER BY fechaIngreso ASC`
        );
        return rows;
    } catch (error) {
        console.error("Error al obtener reservas activas:", error);
        throw error;
    }
};
export const getAllReservations = async()=>{
      try {
        const [rows] = await db.query(
            `SELECT 
                IDReserva as id,
                fechaIngreso,
                fechaEgreso,
                estado,
                IDUsuario,
                IDHabitacion,
                precio
             FROM reservas`
        );
        return rows;
    } catch (error) {
        console.error("Error al obtener reservas activas:", error);
        throw error;
    }
}
// reservations.model.js

export const syncReservationsModel = async () => {
  try {
    // Actualizar reservas autorizadas -> activas
    await db.query(`
      UPDATE reservas
      SET estado = 'activo'
      WHERE estado = 'autorizado'
        AND CURDATE() BETWEEN fechaIngreso AND fechaEgreso
    `);

    // Actualizar reservas activas -> finalizadas
    await db.query(`
      UPDATE reservas
      SET estado = 'finalizado'
      WHERE estado = 'activo'
        AND fechaEgreso < CURDATE()
    `);

    console.log('✅ Reservas sincronizadas correctamente');
  } catch (error) {
    console.error('❌ Error en syncReservationsModel:', error);
    throw error;
  }
};
export const updateStatusBooking = async (id, estado) => {
  try {
    const sql = 'UPDATE reservas SET estado = ? WHERE IDReserva = ?';
    const [result] = await db.query(sql, [estado, id]); // <-- CORREGIDO
    return result;
  } catch (error) {
    console.error('Error al cambiar estado de la reserva', error);
    throw error;
  }
};
