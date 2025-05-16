import express from 'express';
import { register, login, getCurrentUser, requestPasswordReset, resetPassword } from '../controllers/authController.js';
import passport from 'passport';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/current', passport.authenticate('jwt', { session: false }), getCurrentUser);

// Rutas para recuperación de contraseña
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);

export default router;