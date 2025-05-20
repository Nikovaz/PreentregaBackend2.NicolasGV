import React, { createContext, useState, useEffect, useContext } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

// Crear el contexto del carrito
const CartContext = createContext();

// Hook personalizado para usar el contexto del carrito
export const useCart = () => {
    return useContext(CartContext);
};

// Proveedor del contexto del carrito
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    // Cargar el carrito del usuario cuando está autenticado
    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            // Si el usuario no está autenticado, reiniciar el carrito
            setCart({ items: [], total: 0 });
        }
    }, [isAuthenticated]);

    // Función para obtener el carrito del backend
    const fetchCart = async () => {
        setLoading(true);
        setError(null);
        
        try {
            if (isAuthenticated) {
                const cartData = await cartService.getCart();
                setCart(cartData);
            }
        } catch (err) {
            setError(err.message || 'Error loading cart');
            console.error('Error fetching cart:', err);
        } finally {
            setLoading(false);
        }
    };

    // Función para agregar un producto al carrito
    const addToCart = async (productId, quantity = 1) => {
        setLoading(true);
        setError(null);
        
        try {
            if (!isAuthenticated) {
                setError('You must be logged in to add items to cart');
                return;
            }
            
            console.log('Añadiendo al carrito:', { productId, quantity });
            const updatedCart = await cartService.addToCart(productId, quantity);
            console.log('Carrito actualizado:', updatedCart);
            setCart(updatedCart);
            return updatedCart;
        } catch (err) {
            setError(err.message || 'Error adding item to cart');
            console.error('Error adding to cart:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Función para actualizar la cantidad de un producto en el carrito
    const updateCartItem = async (productId, quantity) => {
        setLoading(true);
        setError(null);
        
        try {
            if (!isAuthenticated) {
                setError('You must be logged in to update cart items');
                return;
            }
            
            const updatedCart = await cartService.updateCartItem(productId, quantity);
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

    // Función para eliminar un producto del carrito
    const removeFromCart = async (productId) => {
        setLoading(true);
        setError(null);
        
        try {
            if (!isAuthenticated) {
                setError('You must be logged in to remove cart items');
                return;
            }
            
            const updatedCart = await cartService.removeCartItem(productId);
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

    // Función para vaciar el carrito
    const clearCart = async () => {
        setLoading(true);
        setError(null);
        
        try {
            if (!isAuthenticated) {
                setError('You must be logged in to clear cart');
                return;
            }
            
            const emptyCart = await cartService.clearCart();
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

    // Función para procesar la compra
    const checkout = async () => {
        setLoading(true);
        setError(null);
        
        try {
            if (!isAuthenticated) {
                setError('You must be logged in to checkout');
                return;
            }
            
            const result = await cartService.checkout();
            // Si la compra fue exitosa (total o parcial), actualizar el carrito
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

    // Valor del contexto que se proporcionará
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