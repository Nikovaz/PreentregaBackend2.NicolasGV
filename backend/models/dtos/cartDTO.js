class CartDTO {
    constructor(cart) {
        this.id = cart._id;
        this.userId = cart.user;
        this.items = cart.items.map(item => {
            // Handle case where product might not be fully populated
            const product = item.product || {};
            const productId = product._id || item.product;
            const name = product.name || 'Unknown Product';
            const price = product.price || 0;
            
            return {
                productId,
                name,
                price,
                quantity: item.quantity,
                subtotal: price * item.quantity
            };
        });
        this.total = cart.total;
        this.createdAt = cart.createdAt;
        this.updatedAt = cart.updatedAt;
    }

    static fromCart(cart) {
        return new CartDTO(cart);
    }
}

export default CartDTO;