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
export const updateReservationById = async (fechaIngreso, fechaEgreso, estado, IDReserva) => {
  try {
    const sql = `
      UPDATE reservas
      SET fechaIngreso = ?, fechaEgreso = ?, estado = ?
      WHERE IDReserva= ?
    `;
    const values = [fechaIngreso, fechaEgreso, estado,IDReserva];
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
/**
 * Obtiene una habitación libre del tipo indicado.
 */
export const findAvailableRoomNumber = async (idHabitacion) => {
  const [rows] = await db.query(`
    SELECT hn.idNumero 
    FROM habitacion_numero hn
    LEFT JOIN reservas r ON r.IDHabitacion = hn.idNumero 
      AND r.estado IN ('activo', 'autorizado')
    WHERE hn.idHabitacion = ?
      AND r.IDReserva IS NULL
    LIMIT 1
  `, [idHabitacion]);
  return rows.length ? rows[0].idNumero : null;
};

/**
 * Resta una unidad al campo available del tipo de habitación.
 */
export const decreaseAvailableCount = async (idHabitacion) => {
  await db.query(`
    UPDATE habitacion 
    SET available = GREATEST(available - 1, 0)
    WHERE id = ?
  `, [idHabitacion]);
};

/**
 * Suma una unidad al campo available del tipo de habitación.
 */
export const increaseAvailableCount = async (idHabitacion) => {
  await db.query(`
    UPDATE habitacion 
    SET available = available + 1
    WHERE id = ?
  `, [idHabitacion]);
};

/**
 * Marca la habitación de la reserva como liberada (al finalizar o cancelar).
 */
export const releaseRoomNumber = async (idReserva) => {
  const [[reserva]] = await db.query(`
    SELECT hn.idHabitacion
    FROM reservas r
    JOIN habitacion_numero hn ON hn.idNumero = r.IDHabitacion
    WHERE r.IDReserva = ?
  `, [idReserva]);

  if (reserva) {
    await increaseAvailableCount(reserva.idHabitacion);
  }
};