import { registrarUsuario, findByMail } from "../models/auth.model.js";
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import jwt from 'jsonwebtoken';

 const createAccount = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validación simple
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    const usuario = await findByMail(email);
    if (usuario) {
      return res.status(409).json({
        message: 'El email ya está registrado',
        email
      });
    }
    const hashedPass = await bcrypt.hash(password, 12);

    // Registrar usuario
    await registrarUsuario(username, email, hashedPass);
    res.status(201).json({
      message: 'Cuenta creada con éxito',
      user: { username, email }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear cuenta',
      error: error.message
    });
  }
};


const login = async (req, res) => {
  try {
   
    const { email, password } = req.body;
    const usuario = await findByMail(email);
    if (usuario){
      const passwordMatch = await bcrypt.compare(password, usuario.contrasena);
      if (!passwordMatch) {
        return res.status(403).json({ message: 'Contraseña incorrecta' });
      }
      const payload = { id: usuario.ID, nombre: usuario.nombre, mail: usuario.mail };
     const token = jwt.sign(payload, process.env.SECRET_KEY, { 
        expiresIn: process.env.TOKEN_EXPIRATION || '24h', 
      });

      return res.status(200).json({
        message: 'Login exitoso',
        datos: payload,
        token
      });
    }else if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
 
  } catch (error) {
      res.status(500).json({
      message: 'Error al iniciar sesión en cuenta',
      error: error
    });
  }};

// Exportar todas agrupadas en un objeto
export const auth = {
  createAccount,
  login
};
