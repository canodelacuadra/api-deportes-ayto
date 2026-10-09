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
/**
* @swagger
* /api/auth/login:
*   post:
*     summary: Iniciar sesión en el sistema
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - email
*               - password
*             properties:
*               email:
*                 type: string
*                 description: Email del usuario
*               password:
*                 type: string
*                 description: Contraseña del usuario
*     responses:
*       200:
*         description: Login exitoso, devuelve el Token JWT
*       401:
*         description: Contraseña incorrecta
*       404:
*         description: Usuario no encontrado
*/
// Solo necesitamos POST para login
router.post('/login',loginLimiter, login);

export default router;