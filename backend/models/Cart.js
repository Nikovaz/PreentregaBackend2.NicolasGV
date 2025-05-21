import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        subtotal: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    total: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Middleware para actualizar el total antes de guardar
const updateTotal = function(next) {
    this.total = this.items.reduce((sum, item) => {
        return sum + item.subtotal;
    }, 0);
    next();
};

cartSchema.pre('save', updateTotal);
cartSchema.pre('findOneAndUpdate', function(next) {
    this.findOneAndUpdate({}, {}, { new: true }).then(doc => {
        if (doc) {
            doc.total = doc.items.reduce((sum, item) => {
                return sum + item.subtotal;
            }, 0);
        }
        next();
    });
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;