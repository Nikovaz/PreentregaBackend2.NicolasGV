import productService from '../services/productService.js';
import mongoose from 'mongoose';

export const getAllProducts = async (req, res, next) => {
    try {
        const { limit, page, sort } = req.query;
        const options = {
            limit: parseInt(limit) || 10,
            page: parseInt(page) || 1,
            sort: sort || 'name'
        };
        
        const products = await productService.getAllProducts(options);
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, stock, category } = req.body;
        
        if (!name || !description || !price || !stock || !category) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        const product = await productService.createProduct({
            name,
            description,
            price,
            stock,
            category,
            owner: req.user.id
        });
        
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const { productId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }
        
        const product = await productService.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const updates = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }
        
        const product = await productService.updateProduct(productId, updates);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const { productId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }
        
        const product = await productService.deleteProduct(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};
