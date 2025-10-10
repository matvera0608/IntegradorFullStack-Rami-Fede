import { authMiddleware } from '../middleware/auth.middleware.js';
import { Router } from 'express';
import { createReservation, getReservations, updateReservation, deleteReservation } from '../controllers/reservations.controller.js';
import { validateCreateReservation, validateReservationId } from '../middleware/reservations.middleware.js';

const router = Router();

// POST /reservations → Crear reserva
router.post('/booking', authMiddleware, validateCreateReservation, createReservation);

// GET /reservations → Listar reservas del usuario
router.get('/booking', authMiddleware, getReservations);

// PUT /reservations/:id → Modificar reserva
router.put('/booking/:id', authMiddleware, validateReservationId, updateReservation);

// DELETE /reservations/:id → Cancelar reserva
router.delete('/booking/:id', authMiddleware, validateReservationId, deleteReservation);

export default router;
