import db from '../config/db.js';

export const allUsuario = async ()=>{
    try {
        const [rows] = await db.query('SELECT * FROM usuario');
        return rows;
    } catch (error) {
        throw error;
    }
}

export const findUsuarioById = async (id) => {
  try {
    const [rows] = await db.query('SELECT * FROM usuario WHERE ID = ?', [id]);
    
    if (rows.length === 0) {
      return null; // No existe usuario
    }

    return rows[0]; // Devolvemos solo el objeto del usuario
  } catch (error) {
    throw error;
  }
};


export const updateUsuario = async (id_usuario, nombre, correo, telefono, contrasena) => {
  try {
    const sql = `
      UPDATE usuario
      SET nombre = ?, correoElectronico = ?, telefono = ?, contrasena = ?
      WHERE ID = ?
    `;
    const [rows] = await db.query(sql, [nombre, correo, telefono, contrasena, id_usuario]);
    return rows;
  } catch (error) {
    throw error;
  }
};
export const deleteUsuario = async (id) => {
  try {
    const sql = `DELETE FROM usuario WHERE ID = ?`;
    const [rows] = await db.query(sql, [id]);
    return rows;
  } catch (error) {
    throw error;
  }
};


export const info = async (IDUsuario) => {
  const query = `
    SELECT 
      u.nombre AS nombreUsuario,
      h.type AS tipoHabitacion
    FROM usuario u
    INNER JOIN reservas r ON u.ID = r.IDUsuario
    INNER JOIN habitacion_numero hn ON r.IDHabitacion = hn.idNumero
    INNER JOIN habitacion h ON hn.idHabitacion = h.id
    WHERE u.ID = ?
  `;
  try {
    const [rows] = await db.query(query, [IDUsuario]);
    return [rows];
  } catch (error) {
    throw error;
  }
};
export const Allinfo = async () => {
  const query = `
    SELECT 
      u.nombre AS nombreUsuario,
      h.type AS tipoHabitacion
    FROM usuario u
    INNER JOIN reservas r ON u.ID = r.IDUsuario
    INNER JOIN habitacion_numero hn ON r.IDHabitacion = hn.idNumero
    INNER JOIN habitacion h ON hn.idHabitacion = h.id
  `;
  try {
    const [rows] = await db.query(query);
    return rows; // ✅ No hace falta envolver en [rows]
  } catch (error) {
    throw error;
  }
};

