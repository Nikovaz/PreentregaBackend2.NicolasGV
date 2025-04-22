import express from 'express';
import { register, login } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js'; // Cambiado a authMiddleware

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/current', authMiddleware, (req, res) => { // Usar authMiddleware aquí
    res.json(req.user);
});

export default router;