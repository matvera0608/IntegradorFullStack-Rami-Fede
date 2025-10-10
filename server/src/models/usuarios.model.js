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



