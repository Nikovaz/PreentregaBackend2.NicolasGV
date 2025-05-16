import express from 'express';
import { createUser, getUser, updateUser, deleteUser, getCurrentUser } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import passport from 'passport';
const router = express.Router();

// Ruta para crear un nuevo usuario
router.post('/', createUser);

// Ruta para obtener el usuario actual (debe ir ANTES de la ruta con parámetro :id)
router.get('/me', passport.authenticate('jwt', { session: false }), getCurrentUser);

// Ruta para obtener un usuario por ID
router.get('/:id', passport.authenticate('jwt', { session: false }), getUser);

// Ruta para actualizar un usuario por ID
router.put('/:id', passport.authenticate('jwt', { session: false }), updateUser);

// Ruta para eliminar un usuario por ID
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteUser);

export default router;