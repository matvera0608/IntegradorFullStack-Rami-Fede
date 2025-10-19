import { authMiddleware } from '../middleware/auth.middleware.js';
import { Router } from 'express';
import { updateStatus, allReservation,createReservation, getReservations, updateReservation, deleteReservation, getActiveReservationsController,syncReservation } from '../controllers/reservations.controller.js';
import { validateCreateReservation, validateReservationId } from '../middleware/reservations.middleware.js';

const router = Router();

// Backend - GET /api/reservations/active
router.get('/active', getActiveReservationsController)

// POST /reservations → Crear reserva
router.post('/booking', authMiddleware, validateCreateReservation, createReservation);

//todas las reservas
router.get('/bookings', allReservation);

//actualizar estados autorizados a activos y activos a finalizados
router.put('/sync', syncReservation);

// GET /reservations → Listar reservas del usuario
router.get('/booking/:id', authMiddleware, getReservations);
//cambiar estado reserva
router.patch('/status/:id', updateStatus);
// PUT /reservations/:id → Modificar reserva
router.put('/booking/:id', authMiddleware, validateReservationId, updateReservation);

// DELETE /reservations/:id → Cancelar reserva
router.delete('/booking/:id', authMiddleware, validateReservationId, deleteReservation);

export default router;
