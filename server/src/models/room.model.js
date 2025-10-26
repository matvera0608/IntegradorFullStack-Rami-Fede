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
export const availableRooms= async()=>{
try {
        const [rows] = await db.query('SELECT * FROM habitacion_numero');
        return rows;
    } catch (error) {
        console.error("Error al obtener todas las habitaciones disponibles:", error);
        throw error;
    }    
}

// Obtener el total de habitaciones por tipo
export const getTotalesPorTipo = async () => {
  const [rows] = await db.query(`
    SELECT id AS idHabitacion, available AS total 
    FROM habitacion
  `);
  return rows;
};
// Obtener habitaciones ocupadas por tipo
export const getOcupadasPorTipo = async () => {
  const [rows] = await db.query(`
    SELECT 
      hn.idHabitacion,
      COUNT(r.IDReserva) AS ocupadas
    FROM reservas r
    JOIN habitacion_numero hn ON r.IDHabitacion = hn.idNumero
    WHERE r.estado IN ('activo', 'autorizado')
    GROUP BY hn.idHabitacion
  `);
  return rows;
};
// Obtener el tipo de habitación a partir del IDHabitacion (de reservas)
export const getTipoByReservaHabitacion = async (idHabitacionReserva) => {
  try {
    const [rows] = await db.query(
      `
      SELECT h.type
      FROM habitacion_numero hn
      JOIN habitacion h ON hn.idHabitacion = h.id
      WHERE hn.idNumero = ?
      `,
      [idHabitacionReserva]
    );

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error(`Error al obtener el tipo de habitación para IDHabitacion ${idHabitacionReserva}:`, error);
    throw error;
  }
};