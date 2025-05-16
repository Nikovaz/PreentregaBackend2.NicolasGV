import Cart from '../Cart.js';
import CartDTO from '../dtos/cartDTO.js';

class CartRepository {
    async findById(id) {
        return await Cart.findById(id).populate('items.product');
    }

    async getCartByUser(userId) {
        try {
            const cart = await Cart.findOne({ user: userId }).populate('items.product');
            if (!cart) {
                throw new Error('Cart not found');
            }
            return new CartDTO(cart);
        } catch (error) {
            throw new Error(`Error fetching cart: ${error.message}`);
        }
    }

    async createCart(userId) {
        try {
            const cart = new Cart({
                user: userId,
                items: [],
                total: 0
            });
            
            const savedCart = await cart.save();
            return new CartDTO(savedCart);
        } catch (error) {
            throw new Error(`Error creating cart: ${error.message}`);
        }
    }

    async addItemToCart(userId, productId, quantity = 1) {
        try {
            let cart = await Cart.findOne({ user: userId });
            
            if (!cart) {
                // Create new cart if it doesn't exist
                cart = new Cart({
                    user: userId,
                    items: [{
                        product: productId,
                        quantity
                    }],
                    total: 0 // Will be calculated after populating product data
                });
            } else {
                // Check if product is already in cart
                const itemIndex = cart.items.findIndex(
                    item => item.product.toString() === productId.toString()
                );

                if (itemIndex > -1) {
                    // Update quantity if product already exists
                    cart.items[itemIndex].quantity += quantity;
                } else {
                    // Add new product to cart
                    cart.items.push({
                        product: productId,
                        quantity
                    });
                }
            }

            // Populate product data to calculate total
            await cart.populate('items.product');
            
            // Calculate total
            cart.total = cart.items.reduce(
                (sum, item) => sum + (item.product.price * item.quantity),
                0
            );

            const savedCart = await cart.save();
            await savedCart.populate('items.product');
            
            return new CartDTO(savedCart);
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

            const itemIndex = cart.items.findIndex(
                item => item.product.toString() === productId.toString()
            );

            if (itemIndex === -1) {
                throw new Error('Product not found in cart');
            }

            // Update quantity
            cart.items[itemIndex].quantity = quantity;

            // Recalculate total
            await cart.populate('items.product');
            cart.total = cart.items.reduce(
                (sum, item) => sum + (item.product.price * item.quantity),
                0
            );

            const savedCart = await cart.save();
            await savedCart.populate('items.product');
            
            return new CartDTO(savedCart);
        } catch (error) {
            throw new Error(`Error updating cart item: ${error.message}`);
        }
    }

    async removeCartItem(userId, productId) {
        try {
            const cart = await Cart.findOne({ user: userId });
            
            if (!cart) {
                throw new Error('Cart not found');
            }

            // Remove product from cart
            cart.items = cart.items.filter(
                item => item.product.toString() !== productId.toString()
            );

            // Recalculate total
            await cart.populate('items.product');
            cart.total = cart.items.reduce(
                (sum, item) => sum + (item.product.price * item.quantity),
                0
            );

            const savedCart = await cart.save();
            await savedCart.populate('items.product');
            
            return new CartDTO(savedCart);
        } catch (error) {
            throw new Error(`Error removing cart item: ${error.message}`);
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

            const savedCart = await cart.save();
            return new CartDTO(savedCart);
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
            
            // Recalculate total
            await cart.populate('items.product');
            cart.total = cart.items.reduce(
                (sum, item) => sum + (item.product.price * item.quantity),
                0
            );

            const savedCart = await cart.save();
            await savedCart.populate('items.product');
            
            return new CartDTO(savedCart);
        } catch (error) {
            throw new Error(`Error updating cart items: ${error.message}`);
        }
    }
}

export default new CartRepository();