import { check, validationResult } from "express-validator"
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
export const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token mal formado" });
  }

  try {
    // Verifica el token usando la clave secreta
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Guardamos los datos del token en req.user
    next();
  } catch (err) {
    // Diferenciamos entre expiración y otros errores
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expirado",
        expiredAt: err.expiredAt, // timestamp exacto de expiración
      });
    }
    return res.status(401).json({ message: "Token inválido" });
  }
};

export const validateRegisterData= [
    check('username')
        .notEmpty().withMessage('El nombre de usuario es obligatorio')
        .isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres'),

    check('email')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('El formato de email no es válido'),

    check('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

    // Middleware final para verificar si hubo errores
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array().map(err => err.msg)
            });
        }
        next();
    }
]

export const validateLoginData= [
    check('email')
   .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('El formato de email no es válido'),
    check('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),

    // Middleware final para verificar si hubo errores
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array().map(err => err.msg)
            });
        }
        next();
    }
]    

