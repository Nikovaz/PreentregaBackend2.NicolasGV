import express from 'express';
import { createUser, getUser, updateUser, deleteUser, getCurrentUser } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import passport from 'passport';
import User from '../models/User.js';
import UserDTO from '../models/dtos/userDTO.js';
import bcrypt from 'bcrypt';
const router = express.Router();

// Ruta para crear un nuevo usuario
router.post('/', createUser);

// Ruta para obtener el usuario actual (debe ir ANTES de la ruta con parámetro :id)
router.get('/me', passport.authenticate('jwt', { session: false }), getCurrentUser);

// Ruta para actualizar el perfil del usuario actual
router.put('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const userDTO = UserDTO.fromUser(updatedUser);
    res.status(200).json({ message: 'Perfil actualizado exitosamente', user: userDTO });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

// Ruta para cambiar la contraseña del usuario actual
router.post('/change-password', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validaciones básicas
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres' });
    }
    
    // Obtener el usuario actual
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Verificar la contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
    }
    
    // Verificar que la nueva contraseña sea diferente a la actual
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: 'La nueva contraseña debe ser diferente a la actual' });
    }
    
    // Actualizar la contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    
    res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

// Ruta para obtener un usuario por ID
router.get('/:id', passport.authenticate('jwt', { session: false }), getUser);

// Ruta para actualizar un usuario por ID
router.put('/:id', passport.authenticate('jwt', { session: false }), updateUser);

// Ruta para eliminar un usuario por ID
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteUser);

export default router;