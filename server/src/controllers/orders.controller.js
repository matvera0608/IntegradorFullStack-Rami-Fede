// controllers/orders.controller.js
import { insertOrder, findOrdersByUser, findOrderById } from '../models/orders.model.js';
import { insertDetallePedido, findDetallesByPedido } from '../models/detallePedido.model.js';

export const createOrder = async (req, res) => {
  try {
    const { IDHabitacion, fechaPedido, items = [], estado = "pendiente" } = req.body;
    const IDUsuario = req.user.ID;

    const newOrderId = await insertOrder(IDUsuario, IDHabitacion, fechaPedido, estado);

    // Insertar detalles si existen
    for (const item of items) {
      await insertDetallePedido(newOrderId, item.IDBuffet, item.cantidad, item.subtotal);
    }

    res.status(201).json({ message: "Pedido creado", orderId: newOrderId });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el pedido", error: error.message });
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
