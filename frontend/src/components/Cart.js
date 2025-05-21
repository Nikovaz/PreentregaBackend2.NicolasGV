import React from 'react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';

const Cart = () => {
    const { cart, loading, error, updateCartItem, removeFromCart, clearCart, checkout } = useCart();

    if (loading) {
        return <div className="cart-loading">Loading cart...</div>;
    }

    if (error) {
        return <div className="cart-error">Error: {error}</div>;
    }

    if (!cart || cart.items.length === 0) {
        return <div className="cart-empty">Your cart is empty.</div>;
    }

    const handleQuantityChange = async (productId, newQuantity) => {
        try {
            if (newQuantity < 1) {
                return;
            }
            await updateCartItem(productId, newQuantity);
        } catch (err) {
            console.error('Error updating quantity:', err);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await removeFromCart(productId);
        } catch (err) {
            console.error('Error removing item:', err);
        }
    };

    const handleClearCart = async () => {
        try {
            await clearCart();
        } catch (err) {
            console.error('Error clearing cart:', err);
        }
    };

    const handleCheckout = async () => {
        try {
            const result = await checkout();
            // Mostrar resultados de la compra (aquí se podría redirigir a una página de confirmación)
            alert(`Checkout successful. Order ID: ${result.ticket._id}`);
            
            // Si hay items no procesados, mostrar un mensaje
            if (result.unprocessedItems && result.unprocessedItems.length > 0) {
                alert('Some items could not be processed due to stock issues.');
            }
        } catch (err) {
            console.error('Error during checkout:', err);
            alert(`Checkout failed: ${err.message}`);
        }
    };

    return (
        <div className="cart">
            <h2>Your Cart</h2>
            
            <div className="cart-items">
                {cart.items.map((item) => (
                    <div key={item.productId} className="cart-item">
                        <div className="cart-item-info">
                            <h3>{item.name}</h3>
                            <p>{formatCurrency(item.price)} per unit</p>
                            <p className="cart-item-description">{item.description}</p>
                        </div>
                        
                        <div className="cart-item-quantity">
                            <button 
                                onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                            >
                                -
                            </button>
                            <span>{item.quantity}</span>
                            <button 
                                onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                disabled={item.quantity >= item.stock}
                            >
                                +
                            </button>
                        </div>
                        
                        <div className="cart-item-subtotal">
                            {formatCurrency(item.subtotal)}
                        </div>
                        
                        <button 
                            className="cart-item-remove"
                            onClick={() => handleRemoveItem(item.productId)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="cart-total">
                <h3>Total: {formatCurrency(cart.total)}</h3>
            </div>

            <div className="cart-actions">
                <button 
                    className="cart-clear"
                    onClick={handleClearCart}
                >
                    Clear Cart
                </button>
                <button 
                    className="cart-checkout"
                    onClick={handleCheckout}
                >
                    Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;