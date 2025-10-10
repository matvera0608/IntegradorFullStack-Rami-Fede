import db from '../config/db.js';

// Crear una reserva
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
export const getAllReservations = async (IDUsuario) => {
  try {
    const [rows] = await db.query('SELECT * FROM reservas WHERE IDUsuario = ?', [IDUsuario]);
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
