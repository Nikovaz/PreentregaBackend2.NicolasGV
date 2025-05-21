import Cart from '../models/Cart.js';
import productRepository from './productRepository.js'; // Assuming productRepository is in the same directory

class CartRepository {
    async createCart(userId) {
        try {
            const cart = new Cart({
                user: userId,
                items: [],
                total: 0
            });
            return await cart.save();
        } catch (error) {
            throw new Error(`Error creating cart: ${error.message}`);
        }
    }

    async getCartByUser(userId) {
        try {
            const cart = await Cart.findOne({ user: userId })
                .populate('items.productId', 'name price stock description category')
                .exec();
            return cart;
        } catch (error) {
            // If cart not found, create a new one
            if (error.message.includes('Cart not found')) {
                return await this.createCart(userId);
            }
            throw new Error(`Error fetching cart: ${error.message}`);
        }
    }

    async addItemToCart(userId, productId, quantity) {
        try {
            // Get or create cart
            let cart = await this.getCartByUser(userId);
            if (!cart) {
                cart = await this.createCart(userId);
            }

            // Get product details
            const product = await productRepository.getProductById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            // Check if product already exists in cart
            const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
            
            if (itemIndex !== -1) {
                // If it exists, update quantity
                cart.items[itemIndex].quantity += quantity;
                cart.items[itemIndex].subtotal = product.price * cart.items[itemIndex].quantity;
            } else {
                // If it doesn't exist, add new item with all required fields
                cart.items.push({
                    productId,
                    name: product.name,
                    price: product.price,
                    quantity,
                    subtotal: product.price * quantity
                });
            }

            // Calculate new total
            cart.total = cart.items.reduce((sum, item) => {
                return sum + item.subtotal;
            }, 0);

            return await cart.save();
        } catch (error) {
            throw new Error(`Error adding item to cart: ${error.message}`);
        }
    }

    async updateCartItem(userId, productId, quantity) {
        try {
            const cart = await Cart.findOne({ user: userId });
            if (!cart) {
                throw new Error('Cart not found');
            }

            // Find the item by productId
            const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
            
            if (itemIndex === -1) {
                throw new Error('Item not found in cart');
            }

            // Update the item
            const product = await productRepository.getProductById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            cart.items[itemIndex].quantity = quantity;
            cart.items[itemIndex].subtotal = product.price * quantity;

            // Calculate new total
            cart.total = cart.items.reduce((sum, item) => {
                return sum + item.subtotal;
            }, 0);

            return await cart.save();
        } catch (error) {
            throw new Error(`Error updating cart item: ${error.message}`);
        }
    }

    async removeItemFromCart(userId, productId) {
        try {
            const cart = await Cart.findOne({ user: userId });
            if (!cart) {
                throw new Error('Cart not found');
            }

            cart.items = cart.items.filter(item => item.productId !== productId);

            // Calculate new total
            cart.total = cart.items.reduce((sum, item) => {
                return sum + item.subtotal;
            }, 0);

            return await cart.save();
        } catch (error) {
            throw new Error(`Error removing item from cart: ${error.message}`);
        }
    }

    async clearCart(userId) {
        try {
            const cart = await Cart.findOne({ user: userId });
            if (!cart) {
                throw new Error('Cart not found');
            }

            cart.items = [];
            cart.total = 0;
            return await cart.save();
        } catch (error) {
            throw new Error(`Error clearing cart: ${error.message}`);
        }
    }

    async updateCartItems(userId, items) {
        try {
            const cart = await Cart.findOne({ user: userId });
            if (!cart) {
                throw new Error('Cart not found');
            }

            cart.items = items;
            
            // Calculate new total
            cart.total = items.reduce((sum, item) => {
                return sum + item.subtotal;
            }, 0);

            return await cart.save();
        } catch (error) {
            throw new Error(`Error updating cart items: ${error.message}`);
        }
    }
}

export default new CartRepository();
