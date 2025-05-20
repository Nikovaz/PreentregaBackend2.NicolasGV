import cartRepository from '../models/repositories/cartRepository.js';
import productRepository from '../models/repositories/productRepository.js';
import ticketRepository from '../models/repositories/ticketRepository.js';
import userRepository from '../models/repositories/userRepository.js';

class CartService {
    async getCart(userId) {
        try {
            try {
                // Try to get the existing cart
                return await cartRepository.getCartByUser(userId);
            } catch (error) {
                // If cart not found, create a new one
                if (error.message.includes('Cart not found')) {
                    console.log(`Creating new cart for user ${userId}`);
                    return await cartRepository.createCart(userId);
                }
                throw error; // Re-throw other errors
            }
        } catch (error) {
            throw new Error(`Error fetching cart: ${error.message}`);
        }
    }

    async addItemToCart(userId, productId, quantity) {
        try {
            // Get product details to check stock
            const product = await productRepository.getProductById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            // Check if there's enough stock
            if (product.stock < quantity) {
                throw new Error(`Not enough stock. Available: ${product.stock}`);
            }

            // Add to cart
            return await cartRepository.addItemToCart(userId, productId, quantity);
        } catch (error) {
            throw new Error(`Error adding item to cart: ${error.message}`);
        }
    }

    async updateCartItem(userId, productId, quantity) {
        try {
            // Get product details to check stock
            const product = await productRepository.getProductById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            // Check if there's enough stock
            if (product.stock < quantity) {
                throw new Error(`Not enough stock. Available: ${product.stock}`);
            }

            return await cartRepository.updateCartItem(userId, productId, quantity);
        } catch (error) {
            throw new Error(`Error updating cart item: ${error.message}`);
        }
    }

    async removeCartItem(userId, productId) {
        try {
            return await cartRepository.removeCartItem(userId, productId);
        } catch (error) {
            throw new Error(`Error removing cart item: ${error.message}`);
        }
    }

    async clearCart(userId) {
        try {
            return await cartRepository.clearCart(userId);
        } catch (error) {
            throw new Error(`Error clearing cart: ${error.message}`);
        }
    }

    async checkout(userId) {
        try {
            // Get user and cart
            const user = await userRepository.getUserById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            const cart = await cartRepository.getCartByUser(userId);
            if (!cart || cart.items.length === 0) {
                throw new Error('Cart is empty');
            }

            // Process items and check stock
            const processedItems = [];
            const unprocessedItems = [];
            let totalAmount = 0;

            for (const item of cart.items) {
                const product = await productRepository.getProductById(item.product);
                
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
                purchaser: userId,
                purchaser_email: user.email,
                items: processedItems,
                amount: totalAmount,
                status: unprocessedItems.length > 0 ? 'partial' : 'completed',
                unprocessed_items: unprocessedItems
            };

            const ticket = await ticketRepository.createTicket(ticketData);

            // Clear cart or remove processed items
            if (unprocessedItems.length === 0) {
                await cartRepository.clearCart(userId);
            } else {
                // Keep only unprocessed items in cart
                const remainingItems = unprocessedItems.map(item => ({
                    product: item.product,
                    quantity: item.quantity
                }));

                await cartRepository.updateCartItems(userId, remainingItems);
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