import { AllRooms } from "../models/room.model.js";
import {
  insertReservation,
  getAllReservations,
  updateReservationByIds,
  cancelReservationByIds,getActiveReservations,
} from "../models/reservations.model.js";

/// Crear reserva
export const createReservation = async (req, res) => {
  try {
    console.log('🔍 Iniciando createReservation');
    console.log('📦 Body completo:', req.body);
    console.log('👤 Usuario del token:', req.user);

    const { fechaIngreso, fechaEgreso, estado, IDHabitacion, precio } = req.body;
    const IDUsuario = req.user.IDUsuario || req.user.id; // Intenta con ambos

    console.log('📊 Datos extraídos:', {
      fechaIngreso,
      fechaEgreso,
      estado,
      IDHabitacion,
      precio,
      IDUsuario
    });

    // Validación de datos obligatorios
    if (!fechaIngreso || !fechaEgreso || !estado || !IDHabitacion || !precio) {
      console.log('❌ Faltan datos obligatorios');
      return res.status(400).json({ 
        message: "Faltan datos obligatorios",
        datosRecibidos: req.body,
        datosRequeridos: ['fechaIngreso', 'fechaEgreso', 'estado', 'IDHabitacion', 'precio']
      });
    }

    if (!IDUsuario) {
      console.log('❌ Usuario no autenticado');
      return res.status(401).json({ 
        message: "Usuario no autenticado",
        user: req.user 
      });
    }

    console.log('🚀 Llamando a insertReservation...');
    const result = await insertReservation(fechaIngreso, fechaEgreso, estado, IDUsuario, IDHabitacion, precio);

    console.log('✅ Reserva creada exitosamente');
    res.status(201).json({
      message: "Reserva creada con éxito",
      insertId: result.insertId,
      reserva: {
        fechaIngreso,
        fechaEgreso,
        estado,
        IDUsuario,
        IDHabitacion,
        precio
      }
    });
  } catch (error) {
    console.error('💥 Error en createReservation:', error);
    res.status(500).json({
      message: "Error al crear la reserva",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
// Obtener reservas (solo las del usuario logueado)
export const getReservations = async (req, res) => {
  try {
    const IDUsuario = req.user.IDUsuario;
    const reservas = await getAllReservations(IDUsuario);
    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener reservas",
      error: error.message
    });
  }
};

// Actualizar reserva
export const updateReservation = async (req, res) => {
  try {
    const { fechaIngreso, fechaEgreso, estado } = req.body;
    const { IDHabitacion } = req.params;
    const IDUsuario = req.user.IDUsuario;

    const result = await updateReservationByIds(fechaIngreso, fechaEgreso, estado, IDUsuario, IDHabitacion);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    res.status(200).json({ message: "Reserva actualizada con éxito" });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la reserva",
      error: error.message
    });
  }
};

// Cancelar reserva
export const deleteReservation = async (req, res) => {
  try {
    const { IDHabitacion } = req.params;
    const IDUsuario = req.user.IDUsuario;

    const result = await cancelReservationByIds(IDUsuario, IDHabitacion);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    res.status(200).json({ message: "Reserva cancelada con éxito" });
  } catch (error) {
    res.status(500).json({
      message: "Error al cancelar la reserva",
      error: error.message
    });
  }
};

export const getActiveReservationsController = async (req, res) => {
    console.log('🔵 GET /api/reservations/active - Obteniendo reservas activas');
    try {
        const reservations = await getActiveReservations();
        console.log('📊 Reservas activas encontradas:', reservations.length);
        
        if (reservations.length > 0) {
            console.log('📋 Ejemplo de reserva:', reservations[0]);
        }
        
        // Formatear la respuesta según el formato requerido por el frontend
        const response = {
            reservas: reservations.map(reserva => ({
                IDReserva: reserva.id,
                fechaIngreso: reserva.fechaIngreso,
                fechaEgreso: reserva.fechaEgreso,
                estado: reserva.estado,
                precio: reserva.precio,
                IDHabitacion: reserva.IDHabitacion,
                IDUsuario: reserva.IDUsuario
            }))
        };
        
        res.json(response);
    } catch (error) {
        console.error('❌ Error en getActiveReservationsController:', error);
        res.status(500).json({ 
            message: "Error al obtener reservas activas", 
            error: error.message 
        });
    }
};