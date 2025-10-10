
import { getAllUsuarios } from '../controllers/usuarios.controller.js';
import {getUsuarioById} from '../controllers/usuarios.controller.js';
import { actualizarUsuario } from '../controllers/usuarios.controller.js';
import { eliminarUsuario } from '../controllers/usuarios.controller.js';
import {validateUpdateUsuario} from '../middleware/usuarios.middleware.js'
import{authMiddleware} from '../middleware/auth.middleware.js';
import { Router } from 'express';
const router = Router();
router.get('/users/me', authMiddleware,getUsuarioById);
router.put('/users/me', authMiddleware,validateUpdateUsuario, actualizarUsuario);
router.delete('/users/me',authMiddleware,eliminarUsuario);

export default router;
