import express from 'express';
import { 
    getCart, 
    addItemToCart, 
    updateCartItem, 
    removeItemFromCart, 
    removeCartItem, 
    clearCart, 
    checkout 
} from '../controllers/cartController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Middleware para proteger las rutas
router.use(auth);

// Rutas del carrito
router.get('/', getCart);
router.post('/items', addItemToCart);
router.put('/items/:productId', updateCartItem);
router.delete('/items/:productId', removeItemFromCart);
router.delete('/items', removeCartItem);
router.delete('/', clearCart);
router.post('/checkout', checkout); // Ruta de checkout

export default router;