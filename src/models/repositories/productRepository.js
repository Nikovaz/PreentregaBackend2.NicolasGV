import Product from '../Product.js';
import ProductDTO from '../dtos/productDTO.js';

class ProductRepository {
    async getAllProducts(options = {}, query = {}) {
        try {
            // Create default pagination options if not provided
            const defaultOptions = {
                limit: options.limit || 10,
                page: options.page || 1,
                sort: options.sort || {},
                lean: true
            };
            
            const result = await Product.paginate(query, defaultOptions);
            return result;
        } catch (error) {
            throw new Error(`Error fetching products: ${error.message}`);
        }
    }

    async getProductById(id) {
        try {
            const product = await Product.findById(id);
            if (!product) {
                throw new Error('Product not found');
            }
            return new ProductDTO(product);
        } catch (error) {
            throw new Error(`Error fetching product: ${error.message}`);
        }
    }

    async createProduct(productData) {
        try {
            const product = new Product(productData);
            const savedProduct = await product.save();
            return new ProductDTO(savedProduct);
        } catch (error) {
            throw new Error(`Error creating product: ${error.message}`);
        }
    }

    async updateProduct(id, updateData) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                id, 
                updateData, 
                { new: true }
            );
            
            if (!updatedProduct) {
                throw new Error('Product not found');
            }
            
            return new ProductDTO(updatedProduct);
        } catch (error) {
            throw new Error(`Error updating product: ${error.message}`);
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(id);
            
            if (!deletedProduct) {
                throw new Error('Product not found');
            }
            
            return true;
        } catch (error) {
            throw new Error(`Error deleting product: ${error.message}`);
        }
    }

    async updateProductStock(id, newStock) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                id,
                { stock: newStock },
                { new: true }
            );
            
            if (!updatedProduct) {
                throw new Error('Product not found');
            }
            
            return new ProductDTO(updatedProduct);
        } catch (error) {
            throw new Error(`Error updating product stock: ${error.message}`);
        }
    }

    async findByCategory(category) {
        try {
            const products = await Product.find({ category });
            return products.map(product => new ProductDTO(product));
        } catch (error) {
            throw new Error(`Error finding products by category: ${error.message}`);
        }
    }
}

export default new ProductRepository();