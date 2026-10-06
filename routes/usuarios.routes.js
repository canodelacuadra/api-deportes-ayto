import express from 'express';
import { getUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario } from '../controllers/usuarios.controller.js';
import { verificarToken, esAdmin } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.get('/', verificarToken, esAdmin,getUsuarios);
router.get('/:id',verificarToken, esAdmin, getUsuarioById);
router.post('/', createUsuario);
router.put('/:id',verificarToken,  updateUsuario);
router.delete('/:id',verificarToken, esAdmin, deleteUsuario);

export default router;

