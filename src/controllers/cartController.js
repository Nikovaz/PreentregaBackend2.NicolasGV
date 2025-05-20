import cartService from '../services/cartService.js';

export const getCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cart = await cartService.getCart(userId);
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

export const addItemToCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        
        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }
        
        const cart = await cartService.addItemToCart(userId, productId, quantity || 1);
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

export const updateCartItem = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const { quantity } = req.body;
        
        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: 'Quantity must be at least 1' });
        }
        
        const cart = await cartService.updateCartItem(userId, productId, quantity);
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

export const removeCartItem = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        
        const cart = await cartService.removeCartItem(userId, productId);
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

export const clearCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cart = await cartService.clearCart(userId);
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

export const checkout = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await cartService.checkout(userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};