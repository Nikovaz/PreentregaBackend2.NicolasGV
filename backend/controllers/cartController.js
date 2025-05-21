import cartService from '../services/cartService.js';
import mongoose from 'mongoose';
import productRepository from '../repositories/productRepository.js';
import ticketRepository from '../repositories/ticketRepository.js';
import cartRepository from '../repositories/cartRepository.js';

export const getCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cart = await cartService.getCart(userId);
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        next(error);
    }
};

export const addItemToCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        
        // Verificar si el producto existe
        const product = await productRepository.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Verificar si hay suficiente stock
        if (product.stock < quantity) {
            return res.status(400).json({ error: 'Not enough stock' });
        }

        const result = await cartService.addItemToCart(userId, productId, quantity);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error adding item to cart:', error);
        next(error);
    }
};

export const updateCartItem = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const { quantity } = req.body;

        // Verificar si el producto existe
        const product = await productRepository.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Verificar si hay suficiente stock
        if (product.stock < quantity) {
            return res.status(400).json({ error: 'Not enough stock' });
        }

        const result = await cartService.updateCartItem(userId, productId, quantity);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error updating cart item:', error);
        next(error);
    }
};

export const removeItemFromCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const result = await cartService.removeItemFromCart(userId, productId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error removing item from cart:', error);
        next(error);
    }
};

export const removeCartItem = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;
        const result = await cartService.removeItemFromCart(userId, productId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error removing cart item:', error);
        next(error);
    }
};

export const clearCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await cartService.clearCart(userId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error clearing cart:', error);
        next(error);
    }
};

export const checkout = async (req, res, next) => {
    try {
        // Verificar si el usuario está autenticado
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Obtener el carrito del usuario
        const cart = await cartService.getCart(req.user.id);
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Verificar stock de productos
        const unprocessedItems = [];
        const processedItems = [];
        
        for (const item of cart.items) {
            try {
                const product = await productRepository.getProductById(item.productId);
                if (!product) {
                    unprocessedItems.push(item);
                    continue;
                }

                if (product.stock < item.quantity) {
                    unprocessedItems.push(item);
                    continue;
                }

                // Actualizar stock
                product.stock -= item.quantity;
                await productRepository.updateProduct(product._id, { stock: product.stock });
                processedItems.push(item);
            } catch (error) {
                console.error('Error processing item:', error);
                unprocessedItems.push(item);
            }
        }

        // Crear ticket
        const ticketData = {
            purchaser: req.user.id,
            purchaser_email: req.user.email,
            items: processedItems.map(item => ({
                product: item.productId,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.subtotal
            })),
            amount: processedItems.reduce((sum, item) => sum + item.subtotal, 0),
            purchase_datetime: new Date()
        };

        // Crear ticket en la base de datos
        const ticket = await ticketRepository.createTicket(ticketData);

        // Limpiar carrito o mantener items no procesados
        if (unprocessedItems.length === 0) {
            await cartRepository.clearCart(req.user.id);
        } else {
            await cartRepository.updateCartItems(req.user.id, unprocessedItems);
        }

        res.status(200).json({
            ticket,
            unprocessedItems
        });
    } catch (error) {
        console.error('Error in checkout:', error);
        next(error);
    }
};