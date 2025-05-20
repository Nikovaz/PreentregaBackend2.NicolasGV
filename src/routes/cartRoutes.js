import express from 'express';
import passport from 'passport';
import { 
    getCart, 
    addItemToCart, 
    updateCartItem, 
    removeCartItem, 
    clearCart, 
    checkout 
} from '../controllers/cartController.js';

const router = express.Router();

// Aplicar autenticación a todas las rutas del carrito
router.use(passport.authenticate('jwt', { session: false }));

// Obtener el carrito del usuario actual
router.get('/', getCart);

// Agregar un producto al carrito
router.post('/items', addItemToCart);

// Actualizar la cantidad de un producto en el carrito
router.put('/items/:productId', updateCartItem);

// Eliminar un producto del carrito
router.delete('/items/:productId', removeCartItem);

// Vaciar el carrito
router.delete('/', clearCart);

// Procesar la compra
router.post('/checkout', checkout);

export default router;