import express from 'express';
import { createUser, getUser, updateUser, deleteUser } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

// Ruta para crear un nuevo usuario
router.post('/', createUser);

// Ruta para obtener un usuario por ID
router.get('/:id', authMiddleware, getUser);

// Ruta para actualizar un usuario por ID
router.put('/:id', authMiddleware, updateUser);

// Ruta para eliminar un usuario por ID
router.delete('/:id', authMiddleware, deleteUser);

export default router;