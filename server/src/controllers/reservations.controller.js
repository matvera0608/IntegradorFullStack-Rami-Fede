import { AllRooms } from "../models/room.model.js";
import {
  updateStatusBooking,
  insertReservation,
  getBookingId,
  getAllReservations,
  updateReservationById,
  cancelReservationByIds,getActiveReservations,syncReservationsModel,findAvailableRoomNumber,
  decreaseAvailableCount,
  releaseRoomNumber
} from "../models/reservations.model.js";


export const createReservation = async (req, res) => {
  try {
    console.log("🚀 Iniciando creación de reserva inteligente");

    const { fechaIngreso, fechaEgreso, estado, IDHabitacion, precio } = req.body;
    const IDUsuario = req.user.IDUsuario || req.user.id;

    // Validación básica
    if (!fechaIngreso || !fechaEgreso || !estado || !IDHabitacion || !precio) {
      return res.status(400).json({
        message: "Faltan datos obligatorios",
        datosRequeridos: ["fechaIngreso", "fechaEgreso", "estado", "IDHabitacion", "precio"],
      });
    }

    if (!IDUsuario) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    // 1️⃣ Buscar una habitación disponible del tipo solicitado
    const idNumero = await findAvailableRoomNumber(IDHabitacion);

    if (!idNumero) {
      console.warn(`⚠️ No hay habitaciones disponibles para tipo ${IDHabitacion}`);
      return res.status(409).json({ message: "No hay habitaciones disponibles de este tipo" });
    }

    // 2️⃣ Registrar la reserva con el idNumero asignado
    const result = await insertReservation(
      fechaIngreso,
      fechaEgreso,
      estado,
      IDUsuario,
      idNumero, // 👈 aquí va la habitación asignada
      precio
    );

    // 3️⃣ Reducir en 1 la disponibilidad del tipo de habitación
    await decreaseAvailableCount(IDHabitacion);

    console.log(`✅ Reserva creada exitosamente con habitación ${idNumero}`);
    res.status(201).json({
      message: "Reserva creada con éxito",
      insertId: result.insertId,
      reserva: {
        IDReserva: result.insertId,
        fechaIngreso,
        fechaEgreso,
        estado,
        IDUsuario,
        IDHabitacion,
        idNumeroAsignado: idNumero,
        precio,
      },
    });
  } catch (error) {
    console.error("💥 Error en createReservation:", error);
    res.status(500).json({
      message: "Error al crear la reserva",
      error: error.message,
    });
  }
};// Obtener reservas (solo las del usuario logueado)
export const getReservations = async (req, res) => {
  try {
    const IDUsuario = req.user.id;
    const reservas = await getBookingId(IDUsuario);
    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener reservas",
      error: error.message
    });
  }
};

// Actualizar reserva
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    console.log("🔹 updateStatus id:", id, "estado:", estado);

    const result = await updateStatusBooking(id, estado);
    console.log("🔹 Resultado updateStatusBooking:", result);

    res.status(200).json({ message: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error("❌ Error en updateStatus:", error);
    res.status(500).json({ error: 'Error al actualizar reserva' });
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
export const allReservation = async(req, res) =>{
  try {
        const reservations = await getAllReservations();
        console.log('Reservas encontradas:', reservations.length);
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
        console.error('Error al obtener todas las reservas:', error);
        res.status(500).json({ 
            message: "Error al obtener reservas activas", 
            error: error.message 
        });
    }
}
export const syncReservation = async (req, res) => {
  try {
    await syncReservationsModel();
    res.status(200).json({ message: 'Reservas sincronizadas correctamente.' });
  } catch (error) {
    console.error('Error sincronizando reservas:', error);
    res.status(500).json({ error: 'Error al sincronizar reservas.' });
  }
};

export const updateStatusAuto = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    // Actualizamos el estado de la reserva
    await updateStatusBooking(id, estado);

    // Solo liberamos la habitación si la reserva finalizó o se canceló
    if (estado === "finalizado" || estado === "cancelado") {
      await releaseRoomNumber(id);
      console.log(`🟢 Habitación liberada automáticamente para reserva ${id}`);
    }

    res.status(200).json({ message: "Estado actualizado automáticamente correctamente" });
  } catch (error) {
    console.error("❌ Error en updateStatusAuto:", error);
    res.status(500).json({ error: "Error al actualizar estado automáticamente" });
  }
};

export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params; // IDReserva
    const { fechaIngreso, fechaEgreso, estado } = req.body;

    if (!fechaIngreso || !fechaEgreso || !estado) {
      return res.status(400).json({ message: "Faltan datos obligatorios para actualizar la reserva" });
    }
    console.log("IDReserva:", id);
    console.log("Body recibido:", req.body);

    const result = await updateReservationById(fechaIngreso, fechaEgreso, estado, id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    res.status(200).json({ message: "Reserva actualizada correctamente" });
  } catch (error) {
    console.error("❌ Error en updateReservation:", error);
    res.status(500).json({ message: "Error al actualizar la reserva", error: error.message });
  }
};
