import mongoose from 'mongoose';
import Product from '../models/Product.js';

mongoose.connect('mongodb+srv://NikovazBackend2:XTcqXBSt64ueNL3V@cluster0.wgaxipv.mongodb.net/ecommerce?retryWrites=true&w=majority')
    .then(async () => {
        const products = await Product.find();
        console.log('Product IDs in database:');
        products.forEach(product => {
            console.log(`ID: ${product._id}, Name: ${product.name}, Price: ${product.price}`);
        });
        mongoose.connection.close();
    })
    .catch(console.error);