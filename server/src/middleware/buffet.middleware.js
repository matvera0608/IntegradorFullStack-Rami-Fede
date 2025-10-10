// middlewares/buffet.middlewares.js
import { check, validationResult } from 'express-validator';

// Middleware para validar datos de buffet al crear o actualizar
export const validarBuffet = [
  check('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 100 }).withMessage('El nombre debe tener máximo 100 caracteres'),

  check('descripcion')
    .notEmpty().withMessage('La descripción es obligatoria'),

  check('categoria')
    .notEmpty().withMessage('La categoría es obligatoria')
    .isLength({ max: 30 }).withMessage('La categoría debe tener máximo 30 caracteres'),

  check('disponibilidad')
    .notEmpty().withMessage('La disponibilidad es obligatoria')
    .isBoolean().withMessage('La disponibilidad debe ser true o false'),

  check('precio')
    .notEmpty().withMessage('El precio es obligatorio')
    .isDecimal({ decimal_digits: '0,2' }).withMessage('El precio debe ser un número decimal'),

  // Middleware para manejar errores
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
