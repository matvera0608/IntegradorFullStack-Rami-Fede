import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createOrder, getOrders, getOrderStatus } from "../controllers/orders.controller.js";
import { validateCreateOrder, validateOrderId } from "../middleware/orders.middleware.js";

const router = Router();

// POST /orders → Crear pedido
router.post("/order", authMiddleware, validateCreateOrder, createOrder);

// GET /orders → Listar pedidos del usuario
router.get("/order", authMiddleware, getOrders);

// GET /orders/:id → Estado del pedido
router.get("/order/:id", authMiddleware, validateOrderId, getOrderStatus);


//Recordatorio: hacer un router para el administrador, que permita modificar el estado del pedido.  

export default router;
