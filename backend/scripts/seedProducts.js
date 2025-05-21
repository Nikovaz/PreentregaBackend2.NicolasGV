import mongoose from 'mongoose';
import Product from '../models/Product.js';

const products = [
    {
        name: 'Laptop Gaming',
        description: 'Laptop potente para gaming y desarrollo',
        price: 1299.99,
        stock: 10,
        category: 'Electronics'
    },
    {
        name: 'Smartphone Pro',
        description: 'Smartphone de última generación',
        price: 799.99,
        stock: 15,
        category: 'Electronics'
    },
    {
        name: 'Monitor 4K',
        description: 'Monitor de 27 pulgadas con resolución 4K',
        price: 499.99,
        stock: 20,
        category: 'Electronics'
    }
];

const seedProducts = async () => {
    try {
        // Conectar a MongoDB
        await mongoose.connect('mongodb+srv://NikovazBackend2:XTcqXBSt64ueNL3V@cluster0.wgaxipv.mongodb.net/ecommerce?retryWrites=true&w=majority');
        console.log('Connected to MongoDB');

        // Eliminar productos existentes
        await Product.deleteMany({});
        console.log('Existing products deleted');

        // Crear nuevos productos
        const createdProducts = await Product.insertMany(products);
        console.log(`Created ${createdProducts.length} products`);

        // Cerrar conexión
        mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
