class CartDTO {
    constructor(cart) {
        this.id = cart._id;
        this.userId = cart.user;
        this.items = cart.items.map(item => ({
            productId: item.product._id || item.product,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            subtotal: item.product.price * item.quantity
        }));
        this.total = cart.total;
        this.createdAt = cart.createdAt;
        this.updatedAt = cart.updatedAt;
    }

    static fromCart(cart) {
        return new CartDTO(cart);
    }
}

export default CartDTO;