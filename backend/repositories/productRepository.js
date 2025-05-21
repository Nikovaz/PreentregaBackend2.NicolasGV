import Product from '../models/Product.js';
import mongoose from 'mongoose';

// Helper function to safely convert to ObjectId 
const toObjectId = (id) => {
    try {
        return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
    } catch (error) {
        return null;
    }
};

class ProductRepository {
    async createProduct(productData) {
        try {
            const product = new Product(productData);
            return await product.save();
        } catch (error) {
            throw new Error(`Error creating product: ${error.message}`);
        }
    }

    async getProductById(productId) {
        try {
            const productIdObj = toObjectId(productId);
            if (!productIdObj) {
                throw new Error('Invalid product ID format');
            }
            return await Product.findById(productIdObj);
        } catch (error) {
            throw new Error(`Error fetching product: ${error.message}`);
        }
    }

    async getProducts(query = {}) {
        try {
            return await Product.find(query);
        } catch (error) {
            throw new Error(`Error fetching products: ${error.message}`);
        }
    }

    async updateProduct(productId, updateData) {
        try {
            const productIdObj = toObjectId(productId);
            if (!productIdObj) {
                throw new Error('Invalid product ID format');
            }
            return await Product.findByIdAndUpdate(productIdObj, updateData, { new: true });
        } catch (error) {
            throw new Error(`Error updating product: ${error.message}`);
        }
    }

    async deleteProduct(productId) {
        try {
            const productIdObj = toObjectId(productId);
            if (!productIdObj) {
                throw new Error('Invalid product ID format');
            }
            return await Product.findByIdAndDelete(productIdObj);
        } catch (error) {
            throw new Error(`Error deleting product: ${error.message}`);
        }
    }

    async getProductByCode(code) {
        try {
            return await Product.findOne({ code });
        } catch (error) {
            throw new Error(`Error fetching product by code: ${error.message}`);
        }
    }

    async getProductByName(name) {
        try {
            return await Product.findOne({ name });
        } catch (error) {
            throw new Error(`Error fetching product by name: ${error.message}`);
        }
    }
}

export default new ProductRepository();
