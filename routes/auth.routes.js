import express from 'express';
import rateLimit from 'express-rate-limit';
import { login } from '../controllers/auth.controller.js';

const router = express.Router();
// Configuramos el "guardián de velocidad"
const loginLimiter = rateLimit({
   windowMs: 15 * 60 * 1000, // 15 minutos (en milisegundos)
   max: 5, // Máximo 5 intentos por IP en ese tiempo
   message: { error: 'Demasiados intentos de login. Por favor, inténtalo de nuevo en 15 minutos.' }
});
// Solo necesitamos POST para login
router.post('/login',loginLimiter, login);

export default router;