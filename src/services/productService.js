import productRepository from '../models/repositories/productRepository.js';
import ProductDTO from '../models/dtos/productDTO.js';

class ProductService {
    async getAllProducts(limit = 10, page = 1, sort = '', query = {}) {
        try {
            const options = {
                limit,
                page,
                sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
            };

            const result = await productRepository.getAllProducts(options, query);
            return {
                status: 'success',
                payload: result.docs.map(product => new ProductDTO(product)),
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage
            };
        } catch (error) {
            throw new Error(`Error fetching products: ${error.message}`);
        }
    }

    async getProductById(id) {
        try {
            const product = await productRepository.getProductById(id);
            if (!product) {
                throw new Error('Product not found');
            }
            return ProductDTO.fromProduct(product);
        } catch (error) {
            throw new Error(`Error fetching product: ${error.message}`);
        }
    }

    async createProduct(productData) {
        try {
            const newProduct = await productRepository.createProduct(productData);
            return ProductDTO.fromProduct(newProduct);
        } catch (error) {
            throw new Error(`Error creating product: ${error.message}`);
        }
    }

    async updateProduct(id, productData) {
        try {
            const updatedProduct = await productRepository.updateProduct(id, productData);
            if (!updatedProduct) {
                throw new Error('Product not found');
            }
            return ProductDTO.fromProduct(updatedProduct);
        } catch (error) {
            throw new Error(`Error updating product: ${error.message}`);
        }
    }

    async deleteProduct(id) {
        try {
            const result = await productRepository.deleteProduct(id);
            if (!result) {
                throw new Error('Product not found');
            }
            return { message: 'Product deleted successfully' };
        } catch (error) {
            throw new Error(`Error deleting product: ${error.message}`);
        }
    }
}

export default new ProductService();