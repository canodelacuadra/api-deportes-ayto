import express from 'express';
import { getEspacios, getEspacioById, createEspacio, updateEspacio, deleteEspacio } from '../controllers/espacios.controller.js';
import { verificarToken, esAdmin } from '../middlewares/auth.middleware.js';
const router = express.Router();

// Definimos las rutas para /api/espacios
/**
* @swagger
* /api/espacios:
*   get:
*     summary: Obtener todos los espacios deportivos
*     tags: [Espacios]
*     responses:
*       200:
*         description: Lista de espacios deportivos
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   id:
*                     type: integer
*                   nombre:
*                     type: string
*                   tipo:
*                     type: string
*/

router.get('/', getEspacios);           // Obtener todos
router.get('/:id', getEspacioById);      // Obtener uno por ID
router.post('/',verificarToken, esAdmin, createEspacio);         // Crear= uno
router.put('/:id', verificarToken, esAdmin,updateEspacio);       // Actualizar uno
router.delete('/:id', verificarToken, esAdmin,deleteEspacio);    // Borrar uno

export default router;

