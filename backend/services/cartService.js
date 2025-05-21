import cartRepository from '../repositories/cartRepository.js';
import productRepository from '../repositories/productRepository.js';
import ticketRepository from '../repositories/ticketRepository.js';
import userRepository from '../repositories/userRepository.js';
import mongoose from 'mongoose';

// Helper function to safely convert to ObjectId 
export const toObjectId = (id) => {
    try {
        return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
    } catch (error) {
        return null;
    }
};

export class CartService {
    async getCart(userId) {
        try {
            // Try to get the existing cart
            const userIdObj = toObjectId(userId);
            if (!userIdObj) {
                throw new Error('Invalid ID format');
            }
            const cart = await cartRepository.getCartByUser(userIdObj);
            return cart;
        } catch (error) {
            // If cart not found, create a new one
            if (error.message.includes('Cart not found')) {
                console.log(`Creating new cart for user ${userId}`);
                const newCart = await cartRepository.createCart(userId);
                return newCart;
            }
            // If populate error, try again without populate
            if (error.message.includes('Cannot populate path')) {
                console.log('Retrying cart fetch without populate...');
                const cart = await cartRepository.getCartByUser(userId, false);
                return cart;
            }
            throw new Error(`Error fetching cart: ${error.message}`);
        }
    }

    async addItemToCart(userId, productId, quantity) {
        try {
            // Convertir IDs a ObjectId de manera segura
            const userIdObj = toObjectId(userId);
            const productIdObj = toObjectId(productId);

            if (!userIdObj || !productIdObj) {
                throw new Error('Invalid ID format');
            }

            // Get product details to check stock
            const product = await productRepository.getProductById(productIdObj);
            if (!product) {
                throw new Error('Product not found');
            }

            // Check if there's enough stock
            if (product.stock < quantity) {
                throw new Error(`Not enough stock. Available: ${product.stock}`);
            }

            // Add to cart
            return await cartRepository.addItemToCart(userIdObj, productIdObj, quantity);
        } catch (error) {
            console.error('Error in addItemToCart:', error);
            throw new Error(`Error adding item to cart: ${error.message}`);
        }
    }

    async removeItemFromCart(userId, productId) {
        try {
            // Convert IDs to ObjectId safely
            const userIdObj = toObjectId(userId);
            const productIdObj = toObjectId(productId);

            if (!userIdObj || !productIdObj) {
                throw new Error('Invalid ID format');
            }

            // Remove from cart
            return await cartRepository.removeItemFromCart(userIdObj, productIdObj);
        } catch (error) {
            console.error('Error removing item from cart:', error);
            throw new Error(`Error removing item from cart: ${error.message}`);
        }
    }

    async updateCartItem(userId, productId, quantity) {
        try {
            // Convertir IDs a ObjectId de manera segura
            const userIdObj = toObjectId(userId);
            const productIdObj = toObjectId(productId);

            if (!userIdObj || !productIdObj) {
                throw new Error('Invalid ID format');
            }

            // Get product details to check stock
            const product = await productRepository.getProductById(productIdObj);
            if (!product) {
                throw new Error('Product not found');
            }

            // Verificar si hay suficiente stock
            if (product.stock < quantity) {
                throw new Error(`Not enough stock. Available: ${product.stock}`);
            }

            const result = await cartRepository.updateCartItem(userIdObj, productIdObj, quantity);
            return result;
        } catch (error) {
            throw new Error(`Error updating cart item: ${error.message}`);
        }
    }

    async removeCartItem(userId, productId) {
        try {
            // Convertir IDs a ObjectId de manera segura
            const userIdObj = toObjectId(userId);
            const productIdObj = toObjectId(productId);

            if (!userIdObj || !productIdObj) {
                throw new Error('Invalid ID format');
            }

            return await cartRepository.removeCartItem(userIdObj, productIdObj);
        } catch (error) {
            throw new Error(`Error removing cart item: ${error.message}`);
        }
    }

    async clearCart(userId) {
        try {
            // Convertir ID a ObjectId de manera segura
            const userIdObj = toObjectId(userId);

            if (!userIdObj) {
                throw new Error('Invalid ID format');
            }

            return await cartRepository.clearCart(userIdObj);
        } catch (error) {
            throw new Error(`Error clearing cart: ${error.message}`);
        }
    }

    async checkout(userId) {
        try {
            // Convertir ID a ObjectId de manera segura
            const userIdObj = toObjectId(userId);

            if (!userIdObj) {
                throw new Error('Invalid ID format');
            }

            // Get user and cart
            const user = await userRepository.getUserById(userIdObj);
            if (!user) {
                throw new Error('User not found');
            }

            const cart = await cartRepository.getCartByUser(userIdObj);
            if (!cart || cart.items.length === 0) {
                throw new Error('Cart is empty');
            }

            // Process items and check stock
            const processedItems = [];
            const unprocessedItems = [];
            let totalAmount = 0;

            for (const item of cart.items) {
                const product = await productRepository.getProductById(item.productId);
                
                if (!product) {
                    throw new Error(`Product not found: ${item.productId}`);
                }

                if (product.stock >= item.quantity) {
                    // Process the item
                    processedItems.push({
                        product: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: item.quantity,
                        subtotal: product.price * item.quantity
                    });

                    // Update product stock
                    await productRepository.updateProductStock(
                        product.id,
                        product.stock - item.quantity
                    );

                    totalAmount += product.price * item.quantity;
                } else {
                    // Not enough stock
                    unprocessedItems.push({
                        product: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: item.quantity,
                        reason: `Insufficient stock. Available: ${product.stock}`
                    });
                }
            }

            // If no items were processed
            if (processedItems.length === 0) {
                throw new Error('No items could be processed due to stock issues');
            }

            // Create ticket
            const ticketData = {
                purchaser: userIdObj,
                items: processedItems,
                amount: totalAmount,
                status: unprocessedItems.length > 0 ? 'partial' : 'completed',
                unprocessed_items: unprocessedItems
            };

            const ticket = await ticketRepository.createTicket(ticketData);

            // Clear cart or remove processed items
            if (unprocessedItems.length === 0) {
                await cartRepository.clearCart(userIdObj);
            } else {
                // Keep only unprocessed items in cart
                const remainingItems = unprocessedItems.map(item => ({
                    productId: item.product,
                    quantity: item.quantity
                }));

                await cartRepository.updateCartItems(userIdObj, remainingItems);
            }

            return {
                ticket,
                unprocessedItems: unprocessedItems.length > 0 ? unprocessedItems : []
            };
        } catch (error) {
            throw new Error(`Checkout error: ${error.message}`);
        }
    }
}

export default new CartService();