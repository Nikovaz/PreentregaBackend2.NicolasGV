class ProductDTO {
    constructor(product) {
        this.id = product._id;
        this.name = product.name;
        this.description = product.description;
        this.price = product.price;
        this.stock = product.stock;
        this.category = product.category;
        this.owner = product.owner;
    }

    static fromProduct(product) {
        return new ProductDTO(product);
    }

    static fromProducts(products) {
        return products.map(product => new ProductDTO(product));
    }
}

export default ProductDTO;