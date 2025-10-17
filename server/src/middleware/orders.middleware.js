// middleware/orders.middleware.js
import { check, param, validationResult } from "express-validator";

// Validar creación de pedido
export const validateCreateOrder = (req, res, next) => {
  const { IDHabitacion, fechaPedido, items } = req.body;
  
  if (!IDHabitacion) {
    return res.status(400).json({ message: "IDHabitacion es requerido" });
  }
  
  if (!fechaPedido) {
    return res.status(400).json({ message: "fechaPedido es requerido" });
  }
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "items debe ser un array no vacío" });
  }
  
  next(); // ¡IMPORTANTE! No olvides llamar next()
};

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
