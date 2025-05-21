import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    thumbnails: [{
        type: String
    }],
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Middleware para validar stock antes de guardar
productSchema.pre('save', function(next) {
    if (this.stock < 0) {
        throw new Error('Stock cannot be negative');
    }
    next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;