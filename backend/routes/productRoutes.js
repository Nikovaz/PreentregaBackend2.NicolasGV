import express from 'express';
import passport from 'passport';
import { 
    getAllProducts, 
    createProduct, 
    getProductById, 
    updateProduct, 
    deleteProduct 
} from '../controllers/productController.js';

const router = express.Router();

// Apply authentication to all product routes
router.use(passport.authenticate('jwt', { session: false }));

// Get all products
router.get('/', getAllProducts);

// Create a new product
router.post('/', createProduct);

// Get product by ID
router.get('/:productId', getProductById);

// Update a product
router.put('/:productId', updateProduct);

// Delete a product
router.delete('/:productId', deleteProduct);

export default router;
