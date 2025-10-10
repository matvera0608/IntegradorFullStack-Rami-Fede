import { check, validationResult } from "express-validator";
import 'dotenv/config';
export const validateUpdateUsuario= [
        check('nombre')
            .optional()
            .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
            
        check('correo')
            .optional()
            .isEmail().withMessage('Debe ser un correo electrónico válido'),
            
        check('telefono')
            .optional()
            .isMobilePhone().withMessage('Debe ser un número de teléfono válido'),
            
        check('contrasena')
            .optional()
            .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
            
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ]


