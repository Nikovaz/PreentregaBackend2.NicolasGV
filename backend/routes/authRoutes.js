import express from 'express';
import { register, login, getCurrentUser, requestPasswordReset, resetPassword, verifyResetToken } from '../controllers/authController.js';
import passport from 'passport';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/current', passport.authenticate('jwt', { session: false }), getCurrentUser);

// Rutas para recuperación de contraseña
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-reset-token/:token', verifyResetToken);

// Ruta de prueba para crear un usuario de prueba
router.post('/test-user', async (req, res) => {
    try {
        const testUser = {
            email: 'test@test.com',
            password: 'test123',
            name: 'Test User'
        };
        
        // Llamar a la función de registro con el usuario de prueba
        await register(req, res, testUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;