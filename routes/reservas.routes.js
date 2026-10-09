import express from 'express';
import { getReservas, getReservaById, createReserva, updateReserva, deleteReserva,verificarReserva } from '../controllers/reservas.controller.js';
import { verificarToken,esAdmin } from '../middlewares/auth.middleware.js';
const router = express.Router();



router.get('/',  getReservas);
router.get('/verificar/:id', verificarToken, esAdmin, verificarReserva);
router.get('/:id',verificarToken, getReservaById);
router.post('/', verificarToken, createReserva);
router.put('/:id',verificarToken, updateReserva);
router.delete('/:id',verificarToken, deleteReserva);

export default router;

