
import { userInfo,allUserInfo, getAllUsuarios,getUsuarioById,actualizarUsuario,eliminarUsuario } from '../controllers/usuarios.controller.js'; 
import {validateUpdateUsuario} from '../middleware/usuarios.middleware.js'
import{authMiddleware} from '../middleware/auth.middleware.js';
import { Router } from 'express';
const router = Router();

router.get('/users/:id', authMiddleware,getUsuarioById);
router.put('/users/:id', authMiddleware,validateUpdateUsuario, actualizarUsuario);
router.delete('/users/:id',authMiddleware,eliminarUsuario);
router.get('/infoUser/:id',authMiddleware, userInfo)
router.get('/AllUserInfo', allUserInfo)

export default router;
