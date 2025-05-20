import Cart from '../Cart.js';
import mongoose from 'mongoose';
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
                console.log(`Creating new cart for user ${userId}`);
                cart = new Cart({
                    user: userId,
                    items: [{
                        product: productId,
                        quantity
                    }],
                    total: 0 // Will be calculated after populating product data
                });
                
                try {
                    // Update user reference to this cart if User model has cart field
                    const User = mongoose.model('User');
                    await User.findByIdAndUpdate(userId, { cart: cart._id });
                } catch (userErr) {
                    console.log(`Note: Could not update user with cart reference: ${userErr.message}`);
                    // Continue anyway - the cart still works without user reference
                }
            } else {
                // Check if product is already in cart
                const itemIndex = cart.items.findIndex(item => {
                    const itemProductId = item.product._id || item.product;
                    return itemProductId.toString() === productId.toString();
                });

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

            try {
                // Populate product data to calculate total
                await cart.populate('items.product');
                
                // Calculate total with safety checks for product price
                cart.total = cart.items.reduce((sum, item) => {
                    const price = item.product && item.product.price ? item.product.price : 0;
                    return sum + (price * item.quantity);
                }, 0);
            } catch (populateErr) {
                console.error(`Warning: Error populating product data: ${populateErr.message}`);
                // Set default total if we can't calculate it
                cart.total = 0;
            }

            const savedCart = await cart.save();
            
            try {
                await savedCart.populate('items.product');
            } catch (finalPopulateErr) {
                console.error(`Warning: Error populating final cart data: ${finalPopulateErr.message}`);
            }
            
            return new CartDTO(savedCart);
        } catch (error) {
            throw new Error(`Error adding item to cart: ${error.message}`);
        }
    }

    async updateCartItem(userId, productId, quantity) {
        try {
            let cart = await Cart.findOne({ user: userId });
            
            if (!cart) {
                // Create cart if it doesn't exist
                console.log(`Creating new cart for user ${userId} during update`);
                cart = await this.createCart(userId);
                // Add the item since cart was just created
                return await this.addItemToCart(userId, productId, quantity);
            }

            const itemIndex = cart.items.findIndex(item => {
                const itemProductId = item.product._id || item.product;
                return itemProductId.toString() === productId.toString();
            });

            if (itemIndex === -1) {
                // If product not in cart, add it instead of throwing error
                return await this.addItemToCart(userId, productId, quantity);
            }

            // Update quantity
            cart.items[itemIndex].quantity = quantity;

            try {
                // Recalculate total
                await cart.populate('items.product');
                cart.total = cart.items.reduce((sum, item) => {
                    const price = item.product && item.product.price ? item.product.price : 0;
                    return sum + (price * item.quantity);
                }, 0);
            } catch (populateErr) {
                console.error(`Warning: Error populating product data: ${populateErr.message}`);
                // Set default total if we can't calculate it
                cart.total = 0;
            }

            const savedCart = await cart.save();
            
            try {
                await savedCart.populate('items.product');
            } catch (finalPopulateErr) {
                console.error(`Warning: Error populating final cart data: ${finalPopulateErr.message}`);
            }
            
            return new CartDTO(savedCart);
        } catch (error) {
            throw new Error(`Error updating cart item: ${error.message}`);
        }
    }

    async removeCartItem(userId, productId) {
        try {
            const cart = await Cart.findOne({ user: userId });
            
            if (!cart) {
                // Just return an empty cart if cart doesn't exist
                console.log(`No cart found for user ${userId} during item removal`);
                return await this.createCart(userId);
            }

            // Remove product from cart with safer comparison
            cart.items = cart.items.filter(item => {
                const itemProductId = item.product._id || item.product;
                return itemProductId.toString() !== productId.toString();
            });

            try {
                // Recalculate total
                await cart.populate('items.product');
                cart.total = cart.items.reduce((sum, item) => {
                    const price = item.product && item.product.price ? item.product.price : 0;
                    return sum + (price * item.quantity);
                }, 0);
            } catch (populateErr) {
                console.error(`Warning: Error populating product data: ${populateErr.message}`);
                // Set default total if we can't calculate it
                cart.total = 0;
            }

            const savedCart = await cart.save();
            
            try {
                await savedCart.populate('items.product');
            } catch (finalPopulateErr) {
                console.error(`Warning: Error populating final cart data: ${finalPopulateErr.message}`);
            }
            
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