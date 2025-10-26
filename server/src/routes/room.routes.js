import { authMiddleware } from '../middleware/auth.middleware.js';
import { 
  getRooms, 
  getRoomsByID, 
  getAvailableRooms, 
  getRoomStatus, 
  getRoomTypeByReserva 
} from '../controllers/room.controller.js';
import { validarHabitacion } from '../middleware/room.middleware.js';
import { Router } from 'express';
const router = Router();

// Público
router.get('/rooms', getRooms);
router.get('/rooms/:id', getRoomsByID);
router.get('/availablerooms', getAvailableRooms);
router.get('/status', getRoomStatus);

router.get('/type/:idHabitacion', getRoomTypeByReserva);


export default router;
