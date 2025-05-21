import React, { createContext, useState, useEffect, useContext } from 'react';
import { CartService } from '../services/cartService';
import { useAuth } from './AuthContext';

// Create the cart context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
    return useContext(CartContext);
};

// Cart provider component
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    // Function to fetch cart from backend
    const fetchCart = async () => {
        setLoading(true);
        setError(null);
        
        try {
            if (isAuthenticated) {
                const cartData = await new CartService(process.env.REACT_APP_API_URL).getCart();
                setCart(cartData);
            }
        } catch (err) {
            setError(err.message || 'Error loading cart');
            console.error('Error fetching cart:', err);
        } finally {
            setLoading(false);
        }
    };

    // Function to add a product to cart
    const addToCart = async (productId, quantity = 1) => {
        try {
            if (!isAuthenticated) {
                throw new Error('You must be logged in to add items to cart');
            }

            const cartData = await new CartService(process.env.REACT_APP_API_URL).addToCart(productId, quantity);
            setCart(cartData);
            return cartData;
        } catch (error) {
            console.error('Error adding item to cart:', error);
            throw error;
        }
    };

    // Function to update cart item quantity
    const updateCartItem = async (productId, quantity) => {
        setLoading(true);
        setError(null);
        
        try {
            if (!isAuthenticated) {
                setError('You must be logged in to update cart items');
                return;
            }
            
            const updatedCart = await new CartService(process.env.REACT_APP_API_URL).updateCartItem(productId, quantity);
            setCart(updatedCart);
            return updatedCart;
        } catch (err) {
            setError(err.message || 'Error updating cart item');
            console.error('Error updating cart item:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Function to remove a product from cart
    const removeFromCart = async (productId) => {
        setLoading(true);
        setError(null);
        
        try {
            if (!isAuthenticated) {
                setError('You must be logged in to remove cart items');
                return;
            }
            
            const updatedCart = await new CartService(process.env.REACT_APP_API_URL).removeCartItem(productId);
            setCart(updatedCart);
            return updatedCart;
        } catch (err) {
            setError(err.message || 'Error removing item from cart');
            console.error('Error removing from cart:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Function to clear cart
    const clearCart = async () => {
        setLoading(true);
        setError(null);
        
        try {
            if (!isAuthenticated) {
                setError('You must be logged in to clear cart');
                return;
            }
            
            const emptyCart = await new CartService(process.env.REACT_APP_API_URL).clearCart();
            setCart(emptyCart);
            return emptyCart;
        } catch (err) {
            setError(err.message || 'Error clearing cart');
            console.error('Error clearing cart:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Function to process checkout
    const checkout = async () => {
        setLoading(true);
        setError(null);
        
        try {
            if (!isAuthenticated) {
                setError('You must be logged in to checkout');
                return;
            }
            
            const result = await new CartService(process.env.REACT_APP_API_URL).checkout();
            // If purchase was successful (full or partial), update cart
            await fetchCart();
            return result;
        } catch (err) {
            setError(err.message || 'Error during checkout');
            console.error('Error during checkout:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Load cart when user is authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setCart({ items: [], total: 0 });
        }
    }, [isAuthenticated]);

    // Context value to be provided
    const value = {
        cart,
        loading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        checkout,
        refreshCart: fetchCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;