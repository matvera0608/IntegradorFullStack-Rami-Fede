// middleware/orders.middleware.js
import { check, param, validationResult } from "express-validator";

// Validar creación de pedido
export const validateCreateOrder = [
  check("IDHabitacion")
    .notEmpty().withMessage("El ID de habitación es obligatorio")
    .isInt({ gt: 0 }).withMessage("El ID de habitación debe ser un número positivo"),

  check("fechaPedido")
    .notEmpty().withMessage("La fecha de pedido es obligatoria")
    .isISO8601().withMessage("La fecha debe tener formato YYYY-MM-DD"),

  check("estado")
    .optional()
    .isIn(["pendiente", "en preparación", "en camino", "entregado", "cancelado"])
    .withMessage("Estado inválido"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validar ID de pedido
export const validateOrderId = [
  param("id")
    .notEmpty().withMessage("El ID de pedido es obligatorio")
    .isInt({ gt: 0 }).withMessage("El ID de pedido debe ser un número positivo"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
