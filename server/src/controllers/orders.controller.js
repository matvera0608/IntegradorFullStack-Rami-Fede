import { insertOrder, findOrdersByUser, findOrderById, allOrders, updateOrder } from '../models/orders.model.js';
import { insertDetallePedido, findDetallesByPedido } from '../models/detallePedido.model.js';
import { findBuffetById } from '../models/buffet.model.js';

export const createOrder = async (req, res) => {
  try {
    const { IDHabitacion, fechaPedido, items = [], estado = "pendiente" } = req.body;
    const IDUsuario = req.user?.id;

    if (!IDUsuario) {
      return res.status(400).json({ message: "No se pudo identificar al usuario" });
    }

    if (!IDHabitacion || !fechaPedido) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "El pedido debe contener al menos un item" });
    }

    const newOrderId = await insertOrder(IDUsuario, IDHabitacion, fechaPedido, estado);

    for (const item of items) {
      await insertDetallePedido(newOrderId, item.IDBuffet, item.cantidad, item.subtotal);
    }

    res.status(201).json({ message: "Pedido creado exitosamente", orderId: newOrderId });
  } catch (error) {
    console.error('❌ Error en createOrder:', error);
    res.status(500).json({ message: "Error al crear el pedido" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const IDUsuario = req.user.id;
    const orders = await findOrdersByUser(IDUsuario);
    
    const ordersWithDetails = [];
    for (const order of orders) {
      const detalles = await findDetallesByPedido(order.ID);

      const detallesConProductos = await Promise.all(
        detalles.map(async (detalle) => {
          const producto = await findBuffetById(detalle.IDBuffet);
          return { ...detalle, producto: producto || null };
        })
      );

      ordersWithDetails.push({ ...order, detalles: detallesConProductos });
    }

    res.status(200).json(ordersWithDetails);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener pedidos", error: error.message });
  }
};

export const getOrderStatus = async (req, res) => {
  try {
    const IDUsuario = req.user.id;
    const { id } = req.params;

    const order = await findOrderById(id, IDUsuario);
    if (!order) return res.status(404).json({ message: "Pedido no encontrado" });

    res.status(200).json({ estado: order.estado });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener estado del pedido", error: error.message });
  }
};

// ⬇️ CORREGIR ESTE MÉTODO
export const getAllOrders = async (req, res) => {
  try {
    const orders = await allOrders();
    
    // Enriquecer con detalles y productos
    const ordersWithDetails = [];
    for (const order of orders) {
      const detalles = await findDetallesByPedido(order.ID);

      const detallesConProductos = await Promise.all(
        detalles.map(async (detalle) => {
          const producto = await findBuffetById(detalle.IDBuffet);
          return { ...detalle, producto: producto || null };
        })
      );

      ordersWithDetails.push({ ...order, detalles: detallesConProductos });
    }

    res.status(200).json(ordersWithDetails);
  } catch (error) {
    console.error('❌ Error al obtener los pedidos:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos' });
  }
};

// ⬇️ AGREGAR ESTE MÉTODO NUEVO
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    // Validar estados permitidos
    const estadosPermitidos = ['pendiente', 'en preparación', 'en camino', 'entregado', 'cancelado'];
    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({ message: "Estado no válido" });
    }

    const result = await updateOrder(id, estado);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    res.status(200).json({ message: "Estado actualizado correctamente", estado });
  } catch (error) {
    console.error('❌ Error al actualizar estado:', error);
    res.status(500).json({ message: "Error al actualizar estado del pedido" });
  }
};