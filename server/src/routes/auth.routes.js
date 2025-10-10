// auth.routes.js
import { auth } from '../controllers/auth.controller.js';
import { validateRegisterData, validateLoginData } from '../middleware/auth.middleware.js';
import { Router } from 'express';

const router = Router();

router.post('/register', validateRegisterData, auth.createAccount);
router.post('/login', validateLoginData, auth.login);

export default router;