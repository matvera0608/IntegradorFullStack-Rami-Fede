import db from '../config/db.js';

export const registrarUsuario = async (username, email, password) => {
  try {
    const sql = `
      INSERT INTO usuario (nombre, correoElectronico, contrasena, rol, fechaCreacion)
      VALUES (?, ?, ?, 'usuario', NOW())
    `;
    const values = [username, email, password];
    const [result] = await db.query(sql, values);
    return result; 
  } catch (error) {
    throw error;
  }
};

export const findByMail = async (mail) => {
  try {
    const consulta = `SELECT nombre, correoElectronico, contrasena, ID FROM usuario WHERE correoElectronico = ?`;
    const [rows] = await db.execute(consulta, [mail]);

     // Si no hay resultados, devolver null
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (error) {
    throw error;
  }
};