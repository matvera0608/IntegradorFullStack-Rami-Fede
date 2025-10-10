// middlewares/habitacion.middlewares.js
import { check, validationResult } from "express-validator";

// Validación para crear o actualizar habitación
export const validarHabitacion = [
  check('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 100 }).withMessage('El nombre debe tener máximo 100 caracteres'),
    
  check('descripcion')
    .notEmpty().withMessage('La descripción es obligatoria'),

  check('cantidadCamas')
    .notEmpty().withMessage('La cantidad de camas es obligatoria')
    .isInt({ min: 1 }).withMessage('Debe ser un número entero mayor a 0'),

  check('precio')
    .notEmpty().withMessage('El precio es obligatorio')
    .isDecimal({ decimal_digits: '0,2' }).withMessage('El precio debe ser un número decimal'),

  check('tipo')
    .notEmpty().withMessage('El tipo de habitación es obligatorio')
    .isIn(['simple','suite','Familiar','individual','doble']).withMessage('Tipo inválido'),

  // Middleware para enviar errores si hay alguno
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
