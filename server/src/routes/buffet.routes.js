import { authMiddleware } from '../middleware/auth.middleware.js';
import {getCatalog, getCatalogByID, createCatalog, updateCatalog, deleteCatalog} from '../controllers/buffet.controller.js';
import {validarBuffet} from '../middleware/buffet.middleware.js';
import { Router } from 'express';
const router = Router();
   
//Publico
//GET /buffet → Catálogo completo.
router.get('/buffet', getCatalog);
//GET /buffet/:id → Detalles de un ítem.
router.get('/buffet/:id', getCatalogByID);
//Privado    
//POST /buffet → Agregar plato/bebida.
router.post('/buffet', authMiddleware,validarBuffet,createCatalog);
//PUT /buffet/:id → Editar plato/bebida.
router.put('/buffet/:id',authMiddleware,validarBuffet, updateCatalog);
//DELETE /buffet/:id → Eliminar plato/bebida.
router.delete('buffet/:id',authMiddleware,deleteCatalog )
export default router;

