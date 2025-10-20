import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { 
  createOrder, 
  getOrders, 
  getOrderStatus, 
  getAllOrders,
  updateOrderStatus  // ⬅️ AGREGAR
} from "../controllers/orders.controller.js";
import { validateCreateOrder, validateOrderId } from "../middleware/orders.middleware.js";

const router = Router();

router.post("/order", authMiddleware, validateCreateOrder, createOrder);
router.get("/order", authMiddleware, getOrders);
router.get("/order/:id", authMiddleware, validateOrderId, getOrderStatus);
router.get("/all", authMiddleware, getAllOrders); // ⬅️ AGREGAR / y authMiddleware
router.put("/:id/status", authMiddleware, updateOrderStatus); // ⬅️ AGREGAR

export default router;