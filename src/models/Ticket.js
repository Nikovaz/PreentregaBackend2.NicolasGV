import mongoose from 'mongoose';
import crypto from 'crypto';

const ticketItemSchema = new mongoose.Schema({
    product: {
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
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    subtotal: {
        type: Number,
        required: true
    }
});

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
        default: () => crypto.randomBytes(8).toString('hex')
    },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    purchaser_email: {
        type: String,
        required: true
    },
    items: [ticketItemSchema],
    status: {
        type: String,
        enum: ['completed', 'partial'],
        default: 'completed'
    },
    unprocessed_items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        name: String,
        price: Number,
        quantity: Number,
        reason: String
    }]
}, {
    timestamps: true
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;