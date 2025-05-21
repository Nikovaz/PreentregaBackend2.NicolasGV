class CartDTO {
    constructor(cart) {
        this.items = cart.items.map(item => ({
            productId: item.product._id.toString(),
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            stock: item.product.stock,
            subtotal: (item.product.price * item.quantity).toFixed(2),
            description: item.product.description,
            category: item.product.category
        }));
        this.total = cart.total.toFixed(2);
        this.createdAt = cart.createdAt;
        this.updatedAt = cart.updatedAt;
    }

    toJSON() {
        return {
            items: this.items,
            total: this.total,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

export default CartDTO;
