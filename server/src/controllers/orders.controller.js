// controllers/orders.controller.js
import { insertOrder, findOrdersByUser, findOrderById } from '../models/orders.model.js';
import { insertDetallePedido, findDetallesByPedido } from '../models/detallePedido.model.js';
export const createOrder = async (req, res) => {
  try {
    const { IDHabitacion, fechaPedido, items = [], estado = "pendiente" } = req.body;
    
    // 🔧 SOLUCIÓN: Buscar el ID en cualquier formato
   const IDUsuario = req.user.id; // ← CAMBIO IMPORTANTE
  
    console.log('🔍 DEBUG req.user:', req.user);
    console.log('🔍 DEBUG IDUsuario extraído:', IDUsuario);
    
    if (!IDUsuario) {
      return res.status(400).json({ 
        message: "No se pudo identificar al usuario",
        receivedUser: req.user
      });
    }

    if (!IDHabitacion || !fechaPedido) {
      return res.status(400).json({ 
        message: "Faltan campos obligatorios",
        received: { IDHabitacion, fechaPedido }
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ 
        message: "El pedido debe contener al menos un item" 
      });
    }

    console.log('✅ Intentando crear orden:', { IDUsuario, IDHabitacion, fechaPedido });

    const newOrderId = await insertOrder(IDUsuario, IDHabitacion, fechaPedido, estado);

    for (const item of items) {
      await insertDetallePedido(newOrderId, item.IDBuffet, item.cantidad, item.subtotal);
    }

    return res.status(201).json({ 
      message: "Pedido creado exitosamente", 
      orderId: newOrderId 
    });

  } catch (error) {
    console.error('❌ Error en createOrder:', error.message);
    console.error('Stack completo:', error.stack);
    return res.status(500).json({ 
      message: "Error al crear el pedido", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
export const getOrders = async (req, res) => {
  try {
    const IDUsuario = req.user.ID;
    const orders = await findOrdersByUser(IDUsuario);

    const ordersWithDetails = [];
    for (const order of orders) {
      const detalles = await findDetallesByPedido(order.ID);
      ordersWithDetails.push({ ...order, detalles });
    }

    res.status(200).json(ordersWithDetails);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener pedidos", error: error.message });
  }
};

export const getOrderStatus = async (req, res) => {
  try {
    const IDUsuario = req.user.ID;
    const { id } = req.params;

    const order = await findOrderById(id, IDUsuario);
    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    res.status(200).json({ estado: order.estado });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener estado del pedido", error: error.message });
  }
};
